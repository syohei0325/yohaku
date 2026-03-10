import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/v1/receipt/[receipt_id]
 * Receiptデータを取得
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { receipt_id: string } }
) {
  const { receipt_id } = params;

  try {
    const receipt = await prisma.receipt.findUnique({
      where: { id: receipt_id },
    });

    if (!receipt) {
      return NextResponse.json(
        { error: 'Receipt not found' },
        { status: 404 }
      );
    }

    // Get webhook jobs for this receipt
    const webhookJobs = await prisma.webhookJob.findMany({
      where: {
        tenantId: receipt.tenantId,
        // Assuming we store approve_id or plan_id in metadata
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Build actions result from Outcome Pack（job_id で突合）
    const actionsResult = [];
    
    // Parse outcome pack from receipt
    const outcomeForActions = receipt.outcomeJson ? JSON.parse(receipt.outcomeJson) : null;
    const outcomeActions = outcomeForActions?.actions || [];
    
    for (const outcomeAction of outcomeActions) {
      if (outcomeAction.action === 'webhook.dispatch' && outcomeAction.job_id) {
        // job_id で突合（真のキー）
        const job = webhookJobs.find(j => j.jobId === outcomeAction.job_id);
        actionsResult.push({
          action: outcomeAction.action,
          status: job?.status || outcomeAction.status || 'unknown',
          webhook_job_id: outcomeAction.job_id,
          error_code: job?.errorCode,
          error_hash: job?.errorHash,
          http_status: job?.httpStatus,
        });
      } else if (outcomeAction.action === 'calendar.hold.create') {
        actionsResult.push({
          action: outcomeAction.action,
          status: outcomeAction.status || 'succeeded',
          ics_url: `/api/download/${receipt.id}.ics`,
        });
      } else {
        // Fallback: outcome に job_id がない場合
        actionsResult.push({
          action: outcomeAction.action,
          status: outcomeAction.status || 'unknown',
        });
      }
    }

    // Determine overall status
    let overallStatus: 'succeeded' | 'partial' | 'failed' | 'queued' = 'succeeded';
    const statuses = actionsResult.map(a => a.status);
    if (statuses.includes('failed')) {
      overallStatus = statuses.every(s => s === 'failed') ? 'failed' : 'partial';
    } else if (statuses.includes('queued') || statuses.includes('delivering')) {
      overallStatus = 'queued';
    }

    // Parse evidence if exists
    const evidence = receipt.evidenceJson ? JSON.parse(receipt.evidenceJson) : null;
    
    // Parse context receipts if exists (NEW)
    const contextReceipts = receipt.contextReceipts ? JSON.parse(receipt.contextReceipts) : null;
    
    // Parse outcome pack if exists (NEW)
    const outcome = receipt.outcomeJson ? JSON.parse(receipt.outcomeJson) : null;

    return NextResponse.json({
      receipt_id: receipt.id,
      tenant_id: receipt.tenantId,
      plan_id: receipt.planId,
      status: receipt.status || overallStatus,
      approval_lane: receipt.approvalLane,
      principal_type: receipt.principalType,
      executor_api_key_id: receipt.executorApiKeyId,
      executor_agent_label: receipt.executorAgentLabel,
      principal_user_id: receipt.principalUserId,
      policy_ref: receipt.policyRef,
      risk_tier: receipt.riskTier,
      receipt_hash: receipt.receiptHash,
      server_sig: receipt.serverSig,
      execution_mode: receipt.executionMode,
      evidence,
      context_receipts: contextReceipts,
      outcome,
      actions: actionsResult,
      created_at: receipt.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('[GET /api/v1/receipt/:id] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

