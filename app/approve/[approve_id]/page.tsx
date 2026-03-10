'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Action = {
  action: string;
  payload?: any;
  [key: string]: any;
};

type Plan = {
  id: string;
  summary: string;
  actions: Action[];
  risk_tier?: string;
};

type ApprovalData = {
  approve_id: string;
  plan_id: string;
  plan: Plan;
  tenant_id: string;
  user_id?: string;
  executor_api_key_id?: string;
  executor_agent_label?: string;
  status: string;
  ttl_expires_at: string;
  created_at: string;
};

export default function ApprovePage() {
  const params = useParams();
  const router = useRouter();
  const approve_id = params.approve_id as string;

  const [data, setData] = useState<ApprovalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    // Fetch approval data
    const fetchApproval = async () => {
      try {
        const res = await fetch(`/api/v1/approve/${approve_id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('承認リクエストが見つかりません');
          } else if (res.status === 410) {
            setError('承認期限が切れています（TTL: 10分）');
          } else {
            setError('承認データの取得に失敗しました');
          }
          setIsLoading(false);
          return;
        }
        const approval = await res.json();
        setData(approval);

        // Calculate time left
        const expiresAt = new Date(approval.ttl_expires_at).getTime();
        const now = Date.now();
        const diff = Math.floor((expiresAt - now) / 1000);
        setTimeLeft(diff > 0 ? diff : 0);

        setIsLoading(false);
      } catch (err) {
        setError('承認データの取得に失敗しました');
        setIsLoading(false);
      }
    };

    fetchApproval();
  }, [approve_id]);

  // TTL countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleApprove = async () => {
    if (!data) return;
    setIsSubmitting(true);

    try {
      // Step 1: Approve
      const approveRes = await fetch(`/api/v1/approve/${approve_id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          approved_by_user_id: data.user_id || 'user_demo_001',
        }),
      });

      if (!approveRes.ok) {
        throw new Error('承認に失敗しました');
      }

      // Step 2: Confirm実行（idempotency_key決め打ち）
      const idempotencyKey = `ui_confirm:${approve_id}`;
      const confirmRes = await fetch('/api/v1/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Yohaku-Api-Key': data.executor_api_key_id || 'demo-key',
          'X-Yohaku-Agent-Label': data.executor_agent_label || 'UI',
          'X-Idempotency-Key': idempotencyKey, // ヘッダーにも送る（最強）
        },
        body: JSON.stringify({
          plan_id: data.plan_id,
          approve_id: approve_id,
          idempotency_key: idempotencyKey, // bodyにも送る（保険）
        }),
      });

      if (!confirmRes.ok) {
        throw new Error('実行に失敗しました');
      }

      const result = await confirmRes.json();
      // Redirect to receipt
      router.push(`/receipt/${result.receipt_id || approve_id}`);
    } catch (err) {
      alert(`❌ ${err instanceof Error ? err.message : '承認に失敗しました'}`);
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!data) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/v1/approve/${approve_id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
        }),
      });

      if (!res.ok) {
        throw new Error('却下に失敗しました');
      }

      alert('✅ 却下しました');
      router.push('/dashboard');
    } catch (err) {
      alert('❌ 却下に失敗しました');
      setIsSubmitting(false);
    }
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
          <h1 className="text-xl font-bold text-gray-900 mb-2">承認できません</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </main>
    );
  }

  if (!data) return null;

  const plan = data.plan;
  const riskTier = plan.risk_tier || 'medium';

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            実行承認リクエスト
          </h1>
          {timeLeft !== null && timeLeft > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full text-sm text-yellow-800">
              ⏱️ 残り時間: {Math.floor(timeLeft / 60)}分{timeLeft % 60}秒
            </div>
          )}
          {timeLeft === 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full text-sm text-red-800">
              ⚠️ 期限切れ
            </div>
          )}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Summary */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {plan.summary || 'Webhook送信 + Calendar Hold（可逆）'}
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                riskTier === 'low' ? 'bg-green-100 text-green-800' :
                riskTier === 'high' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                Risk: {riskTier}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                ✓ Reversible
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                ✓ Idempotent
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                ✓ Registered Target
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                External Call
              </span>
            </div>
          </div>

          {/* KYA Block */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              🔐 実行責任（KYA: Know Your Agent）
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="w-32 text-gray-600">Executor:</span>
                <span className="font-mono text-gray-900">
                  {data.executor_agent_label || data.executor_api_key_id || 'N/A'}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600">Principal:</span>
                <span className="font-mono text-gray-900">
                  {data.user_id || 'N/A'}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600">Tenant:</span>
                <span className="font-mono text-gray-900">{data.tenant_id}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              📋 実行内容（{plan.actions.length}件）
            </h3>
            <div className="space-y-4">
              {plan.actions.map((action, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {action.action === 'webhook.dispatch' && '🔗'}
                      {action.action === 'calendar.hold' && '📅'}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {action.action === 'webhook.dispatch' && 'Webhook送信'}
                        {action.action === 'calendar.hold' && 'Calendar Hold（ICS）'}
                      </h4>
                      
                      {action.action === 'webhook.dispatch' && (
                        <div className="space-y-1 text-sm">
                          <div className="flex">
                            <span className="w-20 text-gray-600">URL:</span>
                            <span className="font-mono text-gray-900 break-all">
                              {action.payload?.url || action.target_url || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">
                              ✓ 登録済みURL
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                              HMAC署名あり
                            </span>
                          </div>
                          <details className="mt-2">
                            <summary className="text-xs text-blue-600 cursor-pointer hover:underline">
                              Action詳細を見る
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
{JSON.stringify({
  action: action.action,
  event: action.event || 'action.executed',
  // NOTE: raw body は表示しない（Data-Minimization）
}, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}

                      {action.action === 'calendar.hold' && (
                        <div className="space-y-1 text-sm">
                          <div className="flex">
                            <span className="w-20 text-gray-600">日時:</span>
                            <span className="text-gray-900">
                              {action.start ? new Date(action.start).toLocaleString('ja-JP') : 'N/A'}
                            </span>
                          </div>
                          <div className="flex">
                            <span className="w-20 text-gray-600">期間:</span>
                            <span className="text-gray-900">{action.duration_min || 30}分</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence (折りたたみ) */}
          <details className="border-b border-gray-200">
            <summary className="p-6 cursor-pointer hover:bg-gray-50 text-sm font-semibold text-gray-700">
              📄 詳細情報を見る
            </summary>
            <div className="p-6 bg-gray-50">
              <pre className="text-xs overflow-x-auto bg-white p-4 rounded border border-gray-200">
{JSON.stringify({ approve_id: data.approve_id, plan_id: data.plan_id, plan: data.plan }, null, 2)}
              </pre>
            </div>
          </details>

          {/* CTA */}
          <div className="p-6 bg-white">
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={isSubmitting || timeLeft === 0}
                className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? '処理中...' : '✅ 承認して実行'}
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting || timeLeft === 0}
                className="px-6 py-4 rounded-lg font-semibold text-gray-700 border-2 border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              >
                ❌ 却下
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">
              承認すると、Ledger（監査台帳）に記録され、実行されます
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Yohaku Action Cloud – 実行責任を安全に</p>
        </div>
      </div>
    </main>
  );
}

