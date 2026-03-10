export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { guardAction, PhaseGuardError, CURRENT_PHASE } from '@/lib/phase-guard';
import { validateWebhookUrl, hashWebhookUrl } from '@/lib/webhook-validator';
import { signWebhook, getWebhookSigningSecret } from '@/lib/webhook-signer';
import crypto from 'crypto';

/**
 * Context Receipt 署名検証（NEW: 外部データアクセスの証明）
 * - type: 'mcp_resource'|'external_api'|'database_query'
 * - ref: リソース識別子（URL/URN）
 * - hash: アクセスしたデータのハッシュ（データ自体は保存しない）
 * - sig: 発行者の署名（HMAC-SHA256）
 * - issuer: 発行者ID（例: 'mcp-server-slack'）
 * - accessed_at: アクセス日時（ISO8601）
 * - scope: アクセス権限スコープ（例: 'read:messages'）
 * 
 * Phase1: 署名検証はスキップ（受け取って保存のみ）
 * Phase2: issuer別の公開鍵で署名検証を実装
 */
function verifyContextReceipts(
  contextReceipts?: Array<{
    type: string;
    ref: string;
    hash: string;
    sig: string;
    issuer: string;
    accessed_at: string;
    scope: string;
  }>
): { valid: boolean; error?: string } {
  if (!contextReceipts || contextReceipts.length === 0) {
    return { valid: true }; // Context Receipt は任意
  }
  
  // Phase1: 基本的なフォーマット検証のみ
  for (const receipt of contextReceipts) {
    if (!receipt.type || !receipt.ref || !receipt.hash || !receipt.sig || !receipt.issuer) {
      return { 
        valid: false, 
        error: 'Context receipt missing required fields (type/ref/hash/sig/issuer)' 
      };
    }
    
    // TODO Phase2: issuer別の公開鍵で署名検証
    // const isValidSig = verifySignature(receipt.issuer, receipt.hash, receipt.sig);
    // if (!isValidSig) {
    //   return { valid: false, error: `Invalid signature for issuer: ${receipt.issuer}` };
    // }
  }
  
  return { valid: true };
}

/**
 * Outcome Pack生成（NEW: 結果/事故/停止/上書きの最小信号）
 * - final_status: queued|simulated|succeeded|failed|partial
 * - actions[]: 各アクションの状態（attempts/latency/http_status/error_code）
 * - incident: 事故フラグ（flag/severity/reason_short/ref/freeze_rule_id）
 * - overrides[]: 手動介入（manual_retry/manual_freeze/rollback等）
 * 
 * NOTE: raw data（response body/生ログ）は持たない。hashのみ可。
 */
function generateOutcomePack(
  actions: Array<{action: string; status: string; job_id?: string}>,
  executionMode: string
): any {
  // final_status を actions の status から決定
  const hasError = actions.some(a => a.status === 'error');
  const hasQueued = actions.some(a => a.status === 'queued');
  const finalStatus = executionMode === 'shadow' ? 'simulated' :
                     hasError ? 'partial' :
                     hasQueued ? 'queued' :
                     'success';
  
  return {
    final_status: finalStatus,
    completed_at: null,
    duration_ms: null,
    actions: actions.map(a => ({
      action: a.action,
      job_id: a.job_id || null,  // Job突合の真のキー
      status: executionMode === 'shadow' ? 'simulated' : a.status,
      attempts: 0,
      latency_ms: null,
      http_status: null,
      error_code: null,
      error_hash: null,
      response_hash: null,
    })),
    incident: {
      flag: false,
      severity: null,
      reason_short: null,
      incident_ref: null,
      freeze_rule_id: null,
    },
    overrides: [],
  };
}

/**
 * Evidence Pack生成（Responsible AI / Evidence-First）
 * - decision_rationale: 判断の要点（短文、400文字上限）
 * - data_sources: 参照元（ref+hash+typeのみ、contentは持たない）
 * - model_info: モデル情報（provider/model/mode/version）
 * - context_refs: MCP参照（保存のみ、phase1は同期しない）
 */
function generateEvidencePack(
  planPayload: any,
  contextRefs?: Array<{type: string; ref: string; hash: string; note?: string}>
): any {
  const EVIDENCE_RATIONALE_MAX_CHARS = 400;
  
  // decision_rationale（短文）
  const rationale = planPayload.rationale || 
    `Plan approved and executed. Actions: ${planPayload.actions?.map((a: any) => a.action).join(', ') || 'none'}`;
  const truncatedRationale = rationale.substring(0, EVIDENCE_RATIONALE_MAX_CHARS);
  
  // data_sources（ref+hash+typeのみ、contentは絶対に持たない）
  const dataSources = [
    {
      type: 'policy',
      ref: 'phase1_allowlist+registered_target',
      hash: crypto.createHash('sha256').update('phase1_policy').digest('hex'),
    },
  ];
  
  // context_refsがあれば追加（MCP-ready）
  if (contextRefs && contextRefs.length > 0) {
    contextRefs.forEach(ref => {
      dataSources.push({
        type: ref.type,
        ref: ref.ref,
        hash: ref.hash,
      });
    });
  }
  
  // model_info
  const modelInfo = {
    planner_mode: planPayload.planner_mode || 'openai',
    provider: planPayload.provider || 'openai',
    model: planPayload.model || 'gpt-4',
    version: planPayload.version || 'v1',
  };
  
  return {
    decision_rationale: truncatedRationale,
    data_sources: dataSources,
    model_info: modelInfo,
    context_refs: contextRefs || [],
  };
}

/**
 * POST /v1/confirm - 実行確定（Action Cloud / phase1）
 * 
 * phase1の動作:
 * - approve_id必須（TTL10分）
 * - idempotency_key必須（24h）
 * - webhook.dispatch / calendar.hold.create のみ許可
 * - call.place は SEALED（403）
 * - ledger に append-only chain で記録
 * - partial success contract（422）
 * - metering（confirm/webhook_job/calendar_hold）
 */
export async function POST(request: NextRequest) {
  console.log('[CONFIRM] === Request started ===');
  
  try {
    const body = await request.json();
    console.log('[CONFIRM] Body received:', JSON.stringify(body));
    
    // idempotency_keyはヘッダーとbodyの両方から読む（ヘッダー優先）
    const idempotencyKeyFromHeader = request.headers.get('x-idempotency-key');
    const idempotencyKeyFromBody = body.idempotency_key;
    const idempotency_key = idempotencyKeyFromHeader || idempotencyKeyFromBody;
    
    const { plan_id, approve_id, context_refs, context_receipts } = body;
    
    // KYA (Know Your Agent) - ヘッダーから取得
    const apiKeyId = request.headers.get('x-yohaku-api-key-id') || 'key_mock_001';
    const agentId = request.headers.get('x-yohaku-agent-id');
    const agentLabel = request.headers.get('x-yohaku-agent-label') || 'unknown-agent';
    
    // Agent IDをhash化（存在する場合）
    const agentIdHash = agentId ? crypto.createHash('sha256').update(agentId).digest('hex') : null;
    
    // No-Switch Ops: execution_mode（shadow|canary|live）
    const executionModeFromHeader = request.headers.get('x-yohaku-execution-mode');
    const executionModeFromBody = body.execution_mode;
    const executionMode = executionModeFromHeader || executionModeFromBody || 'live';
    
    // shadow mode validation
    const isShadowMode = executionMode === 'shadow';
    
    // 必須パラメータチェック
    if (!plan_id) {
      return NextResponse.json(
        { error: '400_PLAN_ID_REQUIRED', message: 'plan_id is required' },
        { status: 400 }
      );
    }
    
    if (!approve_id) {
      return NextResponse.json(
        { error: '400_APPROVAL_REQUIRED', message: 'approve_id is required (ConfirmOS)' },
        { status: 400 }
      );
    }
    
    if (!idempotency_key) {
      return NextResponse.json(
        { error: '400_IDEMPOTENCY_KEY_REQUIRED', message: 'idempotency_key is required (ConfirmOS)' },
        { status: 400 }
      );
    }

    // Approval validation
    const approval = await prisma.approval.findUnique({
      where: { approveId: approve_id },
    });

    if (!approval) {
      return NextResponse.json(
        { error: '400_APPROVAL_NOT_FOUND', message: 'Approval not found' },
        { status: 400 }
      );
    }

    const now = new Date();
    if (now > approval.expiresAt) {
      return NextResponse.json(
        { error: '400_APPROVAL_EXPIRED', message: 'Approval has expired (TTL 10min)' },
        { status: 400 }
      );
    }

    if (approval.usedAt) {
      return NextResponse.json(
        { error: '409_APPROVAL_ALREADY_USED', message: 'Approval already used' },
        { status: 409 }
      );
    }
    
    // Context Receipt 検証（Phase1: フォーマットチェックのみ）
    const contextReceiptValidation = verifyContextReceipts(context_receipts);
    if (!contextReceiptValidation.valid) {
      return NextResponse.json(
        { 
          error: '400_INVALID_CONTEXT_RECEIPT', 
          message: contextReceiptValidation.error 
        },
        { status: 400 }
      );
    }

    // Idempotency check（tenant_id × idempotency_key で握る）
    // request_hash: 安定した入力だけでハッシュ化（T03: 409判定用）
    // NOTE: 
    // - executionMode は必ず明示的な値（デフォルト値込み）でハッシュ化
    // - context_refs と context_receipts をソートして digest 化（T03を厳密に）
    const contextRefsDigest = context_refs
      ? crypto.createHash('sha256')
          .update(JSON.stringify(context_refs.sort((a: any, b: any) => 
            `${a.type}:${a.ref}:${a.hash}`.localeCompare(`${b.type}:${b.ref}:${b.hash}`)
          )))
          .digest('hex')
      : 'no_context';
    
    const contextReceiptsDigest = context_receipts
      ? crypto.createHash('sha256')
          .update(JSON.stringify(context_receipts.sort((a: any, b: any) => 
            `${a.type}:${a.ref}:${a.hash}:${a.issuer}`.localeCompare(`${b.type}:${b.ref}:${b.hash}:${b.issuer}`)
          )))
          .digest('hex')
      : 'no_receipts';
    
    const requestHash = crypto
      .createHash('sha256')
      .update(`${plan_id}:${approve_id}:${executionMode}:${contextRefsDigest}:${contextReceiptsDigest}`)
      .digest('hex');
    
    // ConfirmRequest の確保（unique制約で並列レース対策）
    // NOTE: stale delete 後のロック再取得のため while ループ
    let existingConfirmRequest = null;
    let confirmRequest: any = null;  // フェンシング用に保持
    let confirm_id: string = '';
    const idempotencyTtl = 24 * 60 * 60 * 1000;  // 24h
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      retryCount++;
      
      // confirm_id: 内部生成ID（監査・追跡の軸 + 副作用ゼロ証明用）
      confirm_id = `c_${uuidv4()}`;
      const expiresAt = new Date(Date.now() + idempotencyTtl);
      
      try {
        confirmRequest = await prisma.confirmRequest.create({
          data: {
            tenantId: approval.tenantId,
            idempotencyKey: idempotency_key,
            requestHash,
            confirmId: confirm_id,  // 副作用ゼロ証明用
            contextReceiptsDigest,  // Context Receipt digest（T03厳密化用）
            status: 'started',
            expiresAt,
          },
        });
        // 成功したらループを抜ける
        break;
      } catch (error: any) {
        // unique violation = 既に存在
        if (error.code !== 'P2002') {
          throw error;
        }
        
        existingConfirmRequest = await prisma.confirmRequest.findUnique({
          where: {
            unique_tenant_idempotency: {
              tenantId: approval.tenantId,
              idempotencyKey: idempotency_key,
            },
          },
        });
        
        if (!existingConfirmRequest) {
          throw new Error('ConfirmRequest not found after unique violation');
        }
        
        // request_hash が違う場合は 409 (T03: Idempotency conflict)
        if (existingConfirmRequest.requestHash !== requestHash) {
          console.log('[CONFIRM] Idempotency conflict: different request content');
          return NextResponse.json(
            {
              error: '409_IDEMPOTENCY_CONFLICT',
              message: 'Same idempotency_key with different request content',
            },
            { status: 409 }
          );
        }
        
        // request_hash が同じ場合は既存レスポンスを返す（冪等レスポンス）
        console.log('[CONFIRM] Idempotency: Returning cached response');
        
        // status が started or side_effects_started のまま古い場合は、クラッシュの可能性
        const isStale = (existingConfirmRequest.status === 'started' || 
                        existingConfirmRequest.status === 'side_effects_started') &&
                       (Date.now() - existingConfirmRequest.updatedAt.getTime() > 60000);  // 1分
        
        if (isStale) {
          console.log('[CONFIRM] Stale request detected, checking for side effects');
          
          const webhookJobCount = await prisma.webhookJob.count({
            where: {
              tenantId: approval.tenantId,
              idempotencyKey: idempotency_key,
            },
          });
          
          const ledgerEventCount = await prisma.ledgerEvent.count({
            where: {
              tenantId: approval.tenantId,
              approveId: approve_id,
              action: 'confirm',
            },
          });
          
          const hasSideEffects = webhookJobCount > 0 || ledgerEventCount > 0;
          
          if (hasSideEffects) {
            console.log('[CONFIRM] Stale request has side effects, attempting recovery');
            
            const recoveredReceipt = await prisma.receipt.findUnique({
              where: {
                unique_tenant_confirm: {
                  tenantId: approval.tenantId,
                  confirmId: existingConfirmRequest.confirmId,
                },
              },
            });
            
            if (recoveredReceipt) {
              console.log('[CONFIRM] Recovery successful: Receipt found');
              const existingOutcome = recoveredReceipt.outcomeJson ? JSON.parse(recoveredReceipt.outcomeJson) : null;
              const existingEvidence = recoveredReceipt.evidenceJson ? JSON.parse(recoveredReceipt.evidenceJson) : null;
              
              const recoveredResponse = {
                success: true,
                results: existingOutcome?.actions || [],
                receipt_id: recoveredReceipt.id,
                receipt_hash: recoveredReceipt.receiptHash,
                server_sig: recoveredReceipt.serverSig,
                approval: {
                  approval_lane: recoveredReceipt.approvalLane,
                  principal_type: recoveredReceipt.principalType,
                },
                kya: {
                  executor_api_key_id: recoveredReceipt.executorApiKeyId,
                  executor_agent_label: recoveredReceipt.executorAgentLabel,
                  principal_user_id: recoveredReceipt.principalUserId,
                },
                policy: {
                  policy_ref: recoveredReceipt.policyRef || 'phase1_allowlist+registered_target',
                  risk_tier: recoveredReceipt.riskTier || 'low',
                },
                evidence: existingEvidence,
                outcome: existingOutcome,
                metering: {
                  confirm: 0,
                  shadow_confirm: 0,
                  webhook_job: 0,
                  calendar_hold: 0,
                },
                execution_mode: recoveredReceipt.executionMode,
              };
              
              await prisma.confirmRequest.update({
                where: {
                  unique_tenant_idempotency: {
                    tenantId: approval.tenantId,
                    idempotencyKey: idempotency_key,
                  },
                },
                data: {
                  status: 'completed',
                  receiptId: recoveredReceipt.id,
                  responseJson: JSON.stringify(recoveredResponse),
                },
              });
              
              return NextResponse.json({
                ...recoveredResponse,
                idempotent: true,
                recovered: true,
              });
            } else {
              console.log('[CONFIRM] Recovery failed: Receipt not found, still in progress');
              return NextResponse.json(
                {
                  error: 'IN_PROGRESS',
                  message: 'Request is being processed. Please retry after a few seconds.',
                  idempotency_key,
                },
                { status: 202 }
              );
            }
          } else {
            console.log('[CONFIRM] Stale request has no side effects, deleting and retrying');
            await prisma.confirmRequest.delete({
              where: {
                unique_tenant_idempotency: {
                  tenantId: approval.tenantId,
                  idempotencyKey: idempotency_key,
                },
              },
            });
            continue;
          }
        }
        
        // stale でない場合は冪等レスポンスを返す
        if (existingConfirmRequest.responseJson) {
          const cachedResponse = JSON.parse(existingConfirmRequest.responseJson);
          return NextResponse.json({
            ...cachedResponse,
            idempotent: true,
            metering: {
              confirm: 0,
              shadow_confirm: 0,
              webhook_job: 0,
              calendar_hold: 0,
            },
          });
        } else if (existingConfirmRequest.receiptId) {
          const existingReceipt = await prisma.receipt.findUnique({
            where: { id: existingConfirmRequest.receiptId },
          });
          
          if (existingReceipt) {
            const existingOutcome = existingReceipt.outcomeJson ? JSON.parse(existingReceipt.outcomeJson) : null;
            const existingEvidence = existingReceipt.evidenceJson ? JSON.parse(existingReceipt.evidenceJson) : null;
            
            return NextResponse.json({
              success: true,
              idempotent: true,
              results: existingOutcome?.actions || [],
              receipt_id: existingReceipt.id,
              receipt_hash: existingReceipt.receiptHash,
              server_sig: existingReceipt.serverSig,
              approval: {
                approval_lane: existingReceipt.approvalLane,
                principal_type: existingReceipt.principalType,
              },
              kya: {
                executor_api_key_id: existingReceipt.executorApiKeyId,
                executor_agent_label: existingReceipt.executorAgentLabel,
                principal_user_id: existingReceipt.principalUserId,
              },
              policy: {
                policy_ref: existingReceipt.policyRef,
                risk_tier: existingReceipt.riskTier,
              },
              evidence: existingEvidence,
              outcome: existingOutcome,
              metering: {
                confirm: 0,
                shadow_confirm: 0,
                webhook_job: 0,
                calendar_hold: 0,
              },
              execution_mode: existingReceipt.executionMode,
            });
          } else {
            return NextResponse.json(
              {
                error: 'IN_PROGRESS',
                message: 'Request is being processed. Please retry.',
                idempotency_key,
              },
              { status: 202 }
            );
          }
        }
        // ここまで来たら break してループを抜ける
        break;
      }
    }
    
    // maxRetries に達した場合
    if (retryCount >= maxRetries && existingConfirmRequest) {
      return NextResponse.json(
        {
          error: 'TOO_MANY_RETRIES',
          message: 'Failed to acquire lock after multiple retries',
        },
        { status: 503 }
      );
    }
    
    // NOTE: confirm_id は既に上で生成済み（ConfirmRequest 作成時）
    
    // 🔒 Fencing: 副作用の直前に「自分がまだ正当な実行者か」を確認
    // ABA問題を防ぐため、id と confirmId で縛る（tenantId+idempotencyKey は広すぎる）
    // stale delete → recreate が起きても、古いプロセスは絶対に新しい行を奪えない
    if (!confirmRequest) {
      throw new Error('confirmRequest not initialized (logic error)');
    }
    
    const fencingResult = await prisma.confirmRequest.updateMany({
      where: {
        id: confirmRequest.id,              // ← ABA問題を潰す（最重要）
        confirmId: confirmRequest.confirmId, // ← 二重で縛る（さらに強い）
        status: 'started',
      },
      data: {
        status: 'side_effects_started',
      },
    });

    if (fencingResult.count !== 1) {
      // 自分はもう実行者じゃない（stale delete / takeover済み）
      console.log('[CONFIRM] Fencing failed: not the rightful executor');
      return NextResponse.json(
        {
          error: 'IN_PROGRESS',
          message: 'Request was taken over by another process',
          idempotency_key,
        },
        { status: 202 }
      );
    }
    
    console.log('[CONFIRM] Fencing passed: proceeding with side effects');

    // Freeze check（Kill/Freeze）
    const activeFreezeRules = await prisma.freezeRule.findMany({
      where: {
        tenantId: approval.tenantId,
        active: true,
        OR: [
          { level: 'global' },
          { level: 'tenant' },
        ],
      },
    });

    if (activeFreezeRules.length > 0) {
      return NextResponse.json(
        { error: '403_FROZEN', message: 'Tenant is frozen', reason: activeFreezeRules[0].reason },
        { status: 403 }
      );
    }

    // Mark approval as used
    await prisma.approval.update({
      where: { approveId: approve_id },
      data: { usedAt: now },
    });

    // Plan取得
    const plan = await prisma.plan.findUnique({
      where: { id: plan_id },
    });

    if (!plan) {
      return NextResponse.json(
        { error: '400_PLAN_NOT_FOUND', message: 'Plan not found' },
        { status: 400 }
      );
    }

    const planPayload = JSON.parse(plan.payloadJson);
    const actions = planPayload.actions || [];

    // Phase1 Policy: webhook.dispatch は最大1本（DB unique 制約の前提）
    const webhookActions = actions.filter((a: any) => a.action === 'webhook.dispatch');
    if (webhookActions.length > 1) {
      return NextResponse.json(
        { 
          error: '400_POLICY_VIOLATION', 
          message: 'Phase1: Maximum 1 webhook.dispatch action allowed per confirm' 
        },
        { status: 400 }
      );
    }

    // アクション実行
    const results: Array<{ action: string; status: string; id?: string; error?: string; mode?: string; ics_url?: string; job_id?: string }> = [];
    let meteringConfirms = 0;
    let meteringWebhookJobs = 0;
    let meteringCalendarHolds = 0;

    for (const action of actions) {
      try {
        // Phase Guard: アクションが phase1 で許可されているかチェック
        guardAction(action.action, CURRENT_PHASE);

        if (action.action === 'webhook.dispatch') {
          // Webhook実行（phase1の主戦場）
          const targetUrl = action.target_url || action.payload?.url || action.connector_id;
          
          if (!targetUrl) {
            results.push({
              action: 'webhook.dispatch',
              status: 'error',
              error: 'target_url or connector_id is required',
            });
            continue;
          }

          // 1. URL形式チェック（SSRF対策）
          const urlValidation = validateWebhookUrl(targetUrl);
          if (!urlValidation.valid) {
            results.push({
              action: 'webhook.dispatch',
              status: 'error',
              error: `Invalid webhook URL: ${urlValidation.reason}`,
            });
            continue;
          }

          // 2. 登録済みかチェック（事前登録制）
          const targetUrlHash = hashWebhookUrl(targetUrl);
          const connectorConfig = await prisma.connectorConfig.findFirst({
            where: {
              tenantId: approval.tenantId,
              connector: 'webhook',
            },
          });

          // connector_configsに登録されているか確認
          let configJson: any = {};
          if (connectorConfig) {
            configJson = JSON.parse(connectorConfig.configJson);
          }

          const registeredUrls = configJson.registered_urls || [];
          const isRegistered = registeredUrls.some((u: any) => 
            hashWebhookUrl(u.url) === targetUrlHash && u.enabled !== false
          );

          if (!isRegistered) {
            results.push({
              action: 'webhook.dispatch',
              status: 'error',
              error: 'Webhook target URL is not registered. Please register it in connector_configs first.',
            });
            continue;
          }

          // 3. Webhook Job作成（outbox pattern + HMAC署名 + timestamp）
          const jobId = `job_${uuidv4()}`;
          // Data-Minimization: raw body は送らない（event type + refs のみ）
          const webhookPayload = {
            event: action.event || 'action.executed',
            tenant_id: approval.tenantId,
            confirm_id,  // 内部生成ID（監査の軸）
            idempotency_key,  // 外部入力（冪等の軸）
            plan_id,
            approve_id,
            job_id: jobId,  // Job突合の真のキー
            kya: {
              executor_api_key_id: apiKeyId,
              executor_agent_label: agentLabel,
            },
            // payload: 最小限の参照情報のみ（raw body は含めない）
            action_ref: action.action,
          };
          
          // Shadow mode: 外部実行しない（Dry-run）
          if (isShadowMode) {
            results.push({
              action: 'webhook.dispatch',
              status: 'simulated',
              job_id: jobId,
              mode: 'shadow',
            });
            // shadow modeではwebhook_jobをカウントしない
          } else {
            // Live/Canary mode: 実際に実行
          // 重要: 署名生成とDB保存で同じJSON文字列を使用
          const payloadJsonString = JSON.stringify(webhookPayload);
          
          const signingSecret = getWebhookSigningSecret();
          const signatureResult = signWebhook(webhookPayload, jobId, idempotency_key, signingSecret);
            
            // Data-Minimization: payloadHash を追加（検証用）
            const payloadHash = crypto.createHash('sha256').update(payloadJsonString).digest('hex');
          
          await prisma.webhookJob.create({
            data: {
              tenantId: approval.tenantId,
              jobId,
              targetUrlHash,
              payloadJson: payloadJsonString,
                payloadHash,
              signature: signatureResult.signature,
              timestamp: BigInt(signatureResult.timestamp),
              idempotencyKey: signatureResult.headers['X-Idempotency-Key'],
              status: 'queued',
              attempts: 0,
              nextAttemptAt: new Date(),
                errorCode: null,
                errorHash: null,
                httpStatus: null,
            },
          });

          results.push({
            action: 'webhook.dispatch',
            status: 'queued',
              job_id: jobId,  // Job突合の真のキー
          });

          meteringWebhookJobs += 1;

          // 即時配送（デモ/開発用: queued → delivering → delivered）
          // Production では別ワーカーが担当
          try {
            const dispatchRes = await fetch(targetUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Yohaku-Signature': signatureResult.signature,
                'X-Yohaku-Timestamp': String(signatureResult.timestamp),
                'X-Idempotency-Key': idempotency_key,
              },
              body: payloadJsonString,
              signal: AbortSignal.timeout(5000),
            });
            const httpStatus = dispatchRes.status;
            const delivered = httpStatus >= 200 && httpStatus < 300;
            await prisma.webhookJob.update({
              where: { jobId },
              data: {
                status: delivered ? 'delivered' : 'failed',
                httpStatus,
                attempts: 1,
              },
            });
            // results の status も更新
            const resultEntry = results.find(r => r.job_id === jobId);
            if (resultEntry) resultEntry.status = delivered ? 'delivered' : 'failed';
          } catch (dispatchErr: any) {
            console.warn('[CONFIRM] Webhook dispatch failed (non-fatal):', dispatchErr.message);
            await prisma.webhookJob.update({
              where: { jobId },
              data: { status: 'failed', errorCode: 'DISPATCH_ERROR', attempts: 1 },
            });
          }
          }

        } else if (action.action === 'calendar.hold.create') {
          // Calendar Hold実行（ICS fallback-first）
          const eventId = uuidv4();
          const actionPayload = action.payload || action;
          
          // Shadow mode: ICSは生成するが、実際の配信はしない
          if (isShadowMode) {
            results.push({
              action: 'calendar.hold.create',
              status: 'simulated',
              mode: 'ics_shadow',
              ics_url: undefined,
            });
            // shadow modeではcalendar_holdをカウントしない
          } else {
            // Live/Canary mode: 実際にICS生成
          const icsContent = generateIcsContent(eventId, actionPayload);

          results.push({
            action: 'calendar.hold.create',
            status: 'ok',
            mode: 'ics',
            ics_url: `/api/download/${eventId}`,
          });

          meteringCalendarHolds += 1;
          }

        } else {
          // 未知のアクション
          results.push({
            action: action.action,
            status: 'error',
            error: 'Unknown action',
          });
        }

      } catch (error) {
        if (error instanceof PhaseGuardError) {
          // Phase Guard violation
          results.push({
            action: action.action,
            status: 'error',
            error: `SEALED_IN_${CURRENT_PHASE.toUpperCase()}: ${error.message}`,
          });
        } else {
          results.push({
            action: action.action,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    }

    // Metering: confirm は1回だけカウント（idempotencyで重複課金しない）
    // Shadow mode: 課金対象のconfirmにはカウントしない
    meteringConfirms = isShadowMode ? 0 : 1;
    const meteringShadowConfirms = isShadowMode ? 1 : 0;

    // Audit log
    await prisma.auditLog.create({
      data: {
        tenantId: approval.tenantId,
        userId: approval.userId,
        approveId: approval.id, // approvals.id を参照
        action: 'confirm',
        payloadJson: JSON.stringify({
          plan_id,
          idempotency_key,
          results,
        }),
      },
    });

    // Ledger event（append-only chain）
    const prevEvent = await prisma.ledgerEvent.findFirst({
      where: { tenantId: approval.tenantId },
      orderBy: { ts: 'desc' },
    });
    
    const currentEventData = {
      plan_id,
      approve_id,
      results,
    };
    
    const prevHash = prevEvent?.prevHash || null;
    const currentHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(currentEventData) + (prevHash || ''))
      .digest('hex');
    
    // Evidence Pack生成（Responsible AI）
    const evidencePack = generateEvidencePack(planPayload, context_refs);
    
    // Outcome Pack生成（NEW: 結果/事故/停止/上書きの最小信号）
    const outcomePack = generateOutcomePack(results, executionMode);
    
    await prisma.ledgerEvent.create({
      data: {
        tenantId: approval.tenantId,
        approveId: approval.id, // approvals.id を参照
        planId: plan_id,
        action: 'confirm',
        status: isShadowMode ? 'simulated' : 'executed',
        
        // Approval Lanes（Auto/Review/Gate）- phase1必須
        approvalLane: approval.approvalLane,
        principalType: approval.principalType,
        
        // KYA (Know Your Agent)
        executorApiKeyId: apiKeyId,
        executorAgentIdHash: agentIdHash,
        executorAgentLabel: agentLabel,
        principalUserId: approval.approvedByUserId || approval.userId,
        principalEmailHash: approval.approvedByEmailHash,
        
        // Truth-First
        policyRef: approval.principalPolicyRef || 'phase1_allowlist+registered_target',
        riskTier: 'low',
        
        // Evidence-First
        evidenceJson: JSON.stringify(evidencePack),
        
        // Context Receipts (NEW: 署名付きコンテキスト証明)
        contextReceipts: context_receipts ? JSON.stringify(context_receipts) : null,
        
        // Outcome Pack (NEW)
        outcomeJson: JSON.stringify(outcomePack),
        
        beforeJson: null,
        afterJson: JSON.stringify(currentEventData),
        reversible: true,
        prevHash: currentHash,
      },
    });

    // Usage metering（日次集計）
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.usageCounterDaily.upsert({
      where: {
        tenantId_day: {
          tenantId: approval.tenantId,
          day: today,
        },
      },
      update: {
        confirms: { increment: meteringConfirms },
        shadowConfirms: { increment: meteringShadowConfirms },
        webhookJobs: { increment: meteringWebhookJobs },
        calendarHolds: { increment: meteringCalendarHolds },
      },
      create: {
        tenantId: approval.tenantId,
        day: today,
        confirms: meteringConfirms,
        shadowConfirms: meteringShadowConfirms,
        webhookJobs: meteringWebhookJobs,
        calendarHolds: meteringCalendarHolds,
      },
    });

    // Receipt生成（KYA表示 + Truth-First + Evidence-First）
    const receiptId = `rcp_${uuidv4()}`;
    const receiptData = {
      id: receiptId,
      tenant_id: approval.tenantId,
      plan_id,
      status: results.some(r => r.status === 'error') ? 'partial' : 'success',
      summary: `Executed ${results.length} actions`,
      kya: {
        executor_api_key_id: apiKeyId,
        executor_agent_label: agentLabel,
        principal_user_id: approval.approvedByUserId || approval.userId,
      },
      policy: {
        policy_ref: 'phase1_allowlist+registered_target',
        risk_tier: 'low',
      },
      evidence: evidencePack,
      execution_mode: executionMode,
      results,
    };
    
    // Truth-First: Receipt hash + server signature
    const receiptHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(receiptData))
      .digest('hex');
    
    const serverSecret = process.env.YOHAKU_SERVER_SECRET || 'dev_server_secret';
    const serverSig = crypto
      .createHmac('sha256', serverSecret)
      .update(receiptHash)
      .digest('hex');
    
    // Receipt status と Outcome Pack の final_status を一致させる
    const receiptStatus = isShadowMode ? 'simulated' : 
                         results.some(r => r.status === 'error') ? 'partial' : 
                         results.some(r => r.status === 'queued') ? 'queued' : 
                         'success';
    
    await prisma.receipt.create({
      data: {
        id: receiptId,
        tenantId: approval.tenantId,
        confirmId: confirm_id,  // 202詰み復旧用
        planId: plan_id,
        status: receiptStatus,
        summaryText: `Executed ${results.length} actions`,
        
        // Approval Lanes（Auto/Review/Gate）- phase1必須
        approvalLane: approval.approvalLane,
        principalType: approval.principalType,
        
        // KYA（receiptに表示）
        executorApiKeyId: apiKeyId,
        executorAgentLabel: agentLabel,
        principalUserId: approval.approvedByUserId || approval.userId,
        
        // Truth-First（T20）
        policyRef: approval.principalPolicyRef || 'phase1_allowlist+registered_target',
        riskTier: 'low',
        receiptHash,
        serverSig,
        receiptVersion: 1,  // 初回生成時は version 1
        
        // Evidence-First（T22）
        evidenceJson: JSON.stringify(evidencePack),
        
        // Context Receipts (NEW: 署名付きコンテキスト証明)
        contextReceipts: context_receipts ? JSON.stringify(context_receipts) : null,
        
        // Outcome Pack (NEW)
        outcomeJson: JSON.stringify(outcomePack),
        
        // No-Switch Ops
        executionMode,
      },
    });

    const response = {
      success: true,
      results,
      receipt_id: receiptId,
      receipt_hash: receiptHash,
      server_sig: serverSig,
      approval: {
        approval_lane: approval.approvalLane,
        principal_type: approval.principalType,
      },
      kya: {
        executor_api_key_id: apiKeyId,
        executor_agent_label: agentLabel,
        principal_user_id: approval.approvedByUserId || approval.userId,
      },
      policy: {
        policy_ref: approval.principalPolicyRef || 'phase1_allowlist+registered_target',
        risk_tier: 'low',
      },
      evidence: evidencePack,
      outcome: outcomePack,
      metering: {
        confirm: meteringConfirms,
        shadow_confirm: meteringShadowConfirms,
        webhook_job: meteringWebhookJobs,
        calendar_hold: meteringCalendarHolds,
      },
      execution_mode: executionMode,
    };
    
    // ConfirmRequest を completed 状態に更新（冪等レスポンス用にキャッシュ）
    await prisma.confirmRequest.update({
      where: {
        unique_tenant_idempotency: {
          tenantId: approval.tenantId,
          idempotencyKey: idempotency_key,
        },
      },
      data: {
        status: 'completed',
        receiptId,
        responseJson: JSON.stringify(response),
      },
    });
    
    console.log('[CONFIRM] Response ready');
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('[CONFIRM] Error:', error);
    return NextResponse.json(
      { 
        error: 'Confirm failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function generateIcsContent(eventId: string, action: any): string {
  const now = new Date();
  const startTime = action.start ? new Date(action.start) : new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const endTime = new Date(startTime.getTime() + (action.duration_min || 30) * 60 * 1000);
  
  const formatDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hour}${minute}${second}`;
  };

  const title = action.title || 'Calendar Hold';

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Yohaku Action Cloud//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${eventId}@yohaku.app
DTSTART:${formatDateTime(startTime)}
DTEND:${formatDateTime(endTime)}
SUMMARY:${title}
DESCRIPTION:Generated by Yohaku Action Cloud (Calendar Hold)
STATUS:TENTATIVE
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/v1/confirm',
    phase: CURRENT_PHASE,
    runtime: 'nodejs',
  });
}

