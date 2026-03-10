'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type ReceiptData = {
  receipt_id: string;
  tenant_id: string;
  plan_id: string;
  approve_id: string;
  status: 'succeeded' | 'partial' | 'failed' | 'queued';
  approval_lane?: string; // auto|review|gate
  principal_type?: string; // human|policy
  executor_api_key_id?: string;
  executor_agent_label?: string;
  principal_user_id?: string;
  policy_ref?: string;
  risk_tier?: string;
  receipt_hash?: string;
  server_sig?: string;
  execution_mode?: string;
  evidence?: {
    decision_rationale?: string;
    data_sources?: Array<{type: string; ref: string; hash: string}>;
    model_info?: {planner_mode?: string; provider?: string; model?: string; version?: string};
    context_refs?: Array<{type: string; ref: string; hash: string; note?: string}>;
  };
  context_receipts?: Array<{
    type: string;
    ref: string;
    hash: string;
    sig: string;
    issuer: string;
    accessed_at: string;
    scope: string;
  }>;
  outcome?: {
    final_status?: string;
    completed_at?: string;
    duration_ms?: number;
    actions?: Array<{
      action: string;
      status: string;
      attempts?: number;
      latency_ms?: number;
      http_status?: number;
      error_code?: string;
      error_hash?: string;
      response_hash?: string;
    }>;
    incident?: {
      flag: boolean;
      severity?: string;
      reason_short?: string;
      incident_ref?: string;
      freeze_rule_id?: string;
    };
    overrides?: Array<{
      type: string;
      by_principal_type: string;
      by_principal_ref: string;
      reason_short: string;
      at: string;
    }>;
  };
  actions: Array<{
    action: string;
    status: string;
    webhook_job_id?: string;
    ics_url?: string;
    error?: string;
    mode?: string;
  }>;
  ledger_event_id?: string;
  prev_hash?: string;
  created_at: string;
  completed_at?: string;
};

export default function ReceiptPage() {
  const params = useParams();
  const receipt_id = params.receipt_id as string;

  const [data, setData] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await fetch(`/api/v1/receipt/${receipt_id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Receiptが見つかりません');
          } else {
            setError('Receiptの取得に失敗しました');
          }
          setIsLoading(false);
          return;
        }
        const receipt = await res.json();
        setData(receipt);
        setIsLoading(false);
      } catch (err) {
        setError('Receiptの取得に失敗しました');
        setIsLoading(false);
      }
    };

    fetchReceipt();
  }, [receipt_id]);

  const handleCopyToSlack = () => {
    if (!data) return;

    const slackText = `✅ *Action Confirmed*
• Approved by: ${data.principal_user_id || 'N/A'}
• Executed by: ${data.executor_agent_label || data.executor_api_key_id || 'N/A'}
• Status: ${data.status}
• Receipt ID: \`${data.receipt_id}\`
• Actions: ${data.actions.length} completed
${data.actions.map(a => `  - ${a.action}: ${a.status}`).join('\n')}
• Ledger: ${data.ledger_event_id || 'N/A'}`;

    navigator.clipboard.writeText(slackText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-pulse mb-4">⏳</div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Receipt取得エラー</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </main>
    );
  }

  if (!data) return null;

  const statusConfig: Record<string, { icon: string; label: string; color: string }> = {
    succeeded: { icon: '✅', label: '完了', color: 'green' },
    success:   { icon: '✅', label: '完了', color: 'green' },
    partial:   { icon: '⚠️', label: '一部完了', color: 'yellow' },
    failed:    { icon: '❌', label: '失敗', color: 'red' },
    queued:    { icon: '⏳', label: '処理中', color: 'blue' },
    simulated: { icon: '🔵', label: 'Shadow実行', color: 'purple' },
  };

  const config = statusConfig[data.status] ?? statusConfig.queued;

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{config.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">実行レシート</h1>
              <p className={`text-sm font-semibold text-${config.color}-600`}>
                Status: {config.label}
              </p>
            </div>
          </div>
          <button
            onClick={handleCopyToSlack}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            {copied ? '✓ Copied!' : '📋 Copy to Slack'}
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Receipt ID */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 mb-1">RECEIPT ID</h3>
                <p className="font-mono text-sm text-gray-900">{data.receipt_id}</p>
              </div>
              <div className="text-right">
                <h3 className="text-xs font-semibold text-gray-500 mb-1">CREATED AT</h3>
                <p className="text-sm text-gray-900">
                  {new Date(data.created_at).toLocaleString('ja-JP')}
                </p>
              </div>
            </div>
          </div>

          {/* Approval Lanes Block */}
          <div className="p-6 bg-blue-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              🚦 Approval Lane（Human optional. Accountability mandatory.）
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-gray-600 mb-1">Lane</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  data.approval_lane === 'auto' ? 'bg-green-100 text-green-800' :
                  data.approval_lane === 'gate' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {data.approval_lane === 'auto' && '🤖 Auto'}
                  {data.approval_lane === 'review' && '👤 Review'}
                  {data.approval_lane === 'gate' && '🚨 Gate'}
                  {!data.approval_lane && 'N/A'}
                </span>
              </div>
              <div>
                <span className="block text-gray-600 mb-1">Principal Type</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  data.principal_type === 'policy' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {data.principal_type === 'policy' && '📋 Policy'}
                  {data.principal_type === 'human' && '👤 Human'}
                  {!data.principal_type && 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* KYA Block */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              🔐 実行責任（KYA: Know Your Agent）
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-gray-600 mb-1">Executor (Agent)</span>
                <span className="font-mono text-gray-900">
                  {data.executor_agent_label || data.executor_api_key_id || 'N/A'}
                </span>
              </div>
              <div>
                <span className="block text-gray-600 mb-1">Principal (User)</span>
                <span className="font-mono text-gray-900">
                  {data.principal_user_id || 'N/A'}
                </span>
              </div>
              <div>
                <span className="block text-gray-600 mb-1">Tenant</span>
                <span className="font-mono text-gray-900">{data.tenant_id}</span>
              </div>
              <div>
                <span className="block text-gray-600 mb-1">Policy Ref</span>
                <span className="font-mono text-gray-900">{data.policy_ref || 'default'}</span>
              </div>
              <div>
                <span className="block text-gray-600 mb-1">Risk Tier</span>
                <span className="font-mono text-gray-900">{data.risk_tier || 'low'}</span>
              </div>
              {data.execution_mode && (
                <div>
                  <span className="block text-gray-600 mb-1">Execution Mode</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                    data.execution_mode === 'shadow' ? 'bg-gray-100 text-gray-800' :
                    data.execution_mode === 'canary' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {data.execution_mode}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Evidence Pack（Responsible AI）*/}
          {data.evidence && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                📊 Evidence Pack（Responsible AI）
              </h3>
              <div className="space-y-4 text-sm">
                {/* Decision Rationale */}
                {data.evidence.decision_rationale && (
                  <div>
                    <span className="block text-gray-600 mb-1 font-medium">判断の要点</span>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
                      {data.evidence.decision_rationale}
                    </p>
                  </div>
                )}
                
                {/* Data Sources */}
                {data.evidence.data_sources && data.evidence.data_sources.length > 0 && (
                  <div>
                    <span className="block text-gray-600 mb-2 font-medium">
                      参照元（{data.evidence.data_sources.length}件）
                    </span>
                    <div className="space-y-2">
                      {data.evidence.data_sources.map((source, idx) => (
                        <div key={idx} className="bg-gray-50 p-2 rounded border border-gray-200">
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase">
                              {source.type}
                            </span>
                            <span className="font-mono text-xs text-gray-900 break-all flex-1">
                              {source.ref}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500 font-mono break-all">
                            hash: {source.hash.substring(0, 16)}...
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Model Info */}
                {data.evidence.model_info && (
                  <div>
                    <span className="block text-gray-600 mb-2 font-medium">モデル情報</span>
                    <div className="bg-gray-50 p-3 rounded border border-gray-200 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Planner Mode:</span>{' '}
                        <span className="font-mono text-gray-900">{data.evidence.model_info.planner_mode || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Provider:</span>{' '}
                        <span className="font-mono text-gray-900">{data.evidence.model_info.provider || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Model:</span>{' '}
                        <span className="font-mono text-gray-900">{data.evidence.model_info.model || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Version:</span>{' '}
                        <span className="font-mono text-gray-900">{data.evidence.model_info.version || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Context Refs（MCP-ready）*/}
                {data.evidence.context_refs && data.evidence.context_refs.length > 0 && (
                  <div>
                    <span className="block text-gray-600 mb-2 font-medium">
                      Context Refs（MCP）: {data.evidence.context_refs.length}件
                    </span>
                    <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-200">
                      参照のみ保存（Data-Minimization）
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Context Receipts（NEW: 署名付きコンテキスト証明）*/}
          {data.context_receipts && data.context_receipts.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                🔐 Context Receipts（アクセス証明）
              </h3>
              <div className="space-y-3">
                <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border border-blue-200 mb-3">
                  AIエージェントが外部データにアクセスした証明（署名付き）
                </div>
                {data.context_receipts.map((receipt, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <span className="ml-2 font-medium text-gray-900">{receipt.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Issuer:</span>
                        <span className="ml-2 font-medium text-gray-900">{receipt.issuer}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Ref:</span>
                        <span className="ml-2 font-mono text-gray-900 break-all">{receipt.ref}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Hash:</span>
                        <span className="ml-2 font-mono text-gray-900 break-all">{receipt.hash.substring(0, 16)}...</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Accessed:</span>
                        <span className="ml-2 text-gray-900">{new Date(receipt.accessed_at).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Scope:</span>
                        <span className="ml-2 text-gray-900">{receipt.scope}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Signature:</span>
                        <span className="ml-2 font-mono text-xs text-green-700 break-all">{receipt.sig.substring(0, 32)}...</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Truth-First（Receipt検証）*/}
          {data.receipt_hash && data.server_sig && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                🔒 Truth-First（Receipt検証）
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="block text-gray-600 mb-1">Receipt Hash</span>
                  <span className="font-mono text-xs text-gray-900 break-all bg-gray-50 p-2 rounded border border-gray-200 block">
                    {data.receipt_hash}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-600 mb-1">Server Signature</span>
                  <span className="font-mono text-xs text-gray-900 break-all bg-gray-50 p-2 rounded border border-gray-200 block">
                    {data.server_sig.substring(0, 32)}...
                  </span>
                </div>
                <div className="mt-3">
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    ✓ Tamper-evident / Verifiable
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Outcome Pack（NEW: 結果/事故/停止/上書きの最小信号）*/}
          {data.outcome && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                📊 Outcome Pack（結果の追跡）
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Final Status:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    data.outcome.final_status === 'succeeded' ? 'bg-green-100 text-green-800' :
                    data.outcome.final_status === 'failed' ? 'bg-red-100 text-red-800' :
                    data.outcome.final_status === 'simulated' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {data.outcome.final_status || 'queued'}
                  </span>
                </div>
                
                {data.outcome.incident?.flag && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-600 font-semibold">⚠️ Incident Flagged</span>
                      {data.outcome.incident.severity && (
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                          {data.outcome.incident.severity}
                        </span>
                      )}
                    </div>
                    {data.outcome.incident.reason_short && (
                      <p className="text-sm text-gray-700">{data.outcome.incident.reason_short}</p>
                    )}
                    {data.outcome.incident.incident_ref && (
                      <p className="text-xs text-gray-600 mt-1">Ref: {data.outcome.incident.incident_ref}</p>
                    )}
                  </div>
                )}
                
                {data.outcome.overrides && data.outcome.overrides.length > 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-semibold text-blue-800 mb-2">🔧 Manual Overrides</div>
                    {data.outcome.overrides.map((override, idx) => (
                      <div key={idx} className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">{override.type}</span> by {override.by_principal_type}
                        {override.reason_short && <span className="text-gray-600"> - {override.reason_short}</span>}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 italic">
                  ※ Outcome Pack: raw データは持たない（hash のみ）
                </div>
              </div>
            </div>
          )}

          {/* Actions Result */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              📋 実行結果（{data.actions.length}件）
            </h3>
            <div className="space-y-3">
              {data.actions.map((action, idx) => (
                <div
                  key={idx}
                  className={`border rounded-lg p-4 ${
                    action.status === 'succeeded'
                      ? 'border-green-200 bg-green-50'
                      : action.status === 'failed'
                      ? 'border-red-200 bg-red-50'
                      : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">
                        {action.action === 'webhook.dispatch' && '🔗'}
                        {action.action === 'calendar.hold' && '📅'}
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {action.action === 'webhook.dispatch' && 'Webhook送信'}
                          {action.action === 'calendar.hold' && 'Calendar Hold'}
                        </h4>
                        <div className="text-sm space-y-1">
                          {action.webhook_job_id && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">Job ID:</span>
                              <span className="font-mono text-gray-900 text-xs">
                                {action.webhook_job_id}
                              </span>
                            </div>
                          )}
                          {action.ics_url && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">ICS:</span>
                              <a
                                href={action.ics_url}
                                className="text-blue-600 hover:underline text-xs"
                              >
                                Download
                              </a>
                            </div>
                          )}
                          {action.error && (
                            <div className="text-red-600 text-xs mt-1">
                              Error: {action.error}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        action.status === 'succeeded'
                          ? 'bg-green-100 text-green-800'
                          : action.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {action.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ledger Reference */}
          <div className="p-6 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              📜 Ledger（監査台帳）
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="w-32 text-gray-600">Event ID:</span>
                <span className="font-mono text-gray-900 text-xs">
                  {data.ledger_event_id || 'N/A'}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600">Prev Hash:</span>
                <span className="font-mono text-gray-900 text-xs break-all">
                  {data.prev_hash || 'N/A'}
                </span>
              </div>
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  ✓ Append-only / Tamper-evident
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Export */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Export JSON
          </button>
          <button className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Export CSV
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Yohaku Action Cloud – 実行責任を安全に</p>
        </div>
      </div>
    </main>
  );
}

