'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * デモ録画用の簡易Setup
 * - API Key自動生成
 * - Webhook URL自動登録
 * - 自動的にApprove Pageに遷移
 */
export default function DemoSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'init' | 'creating' | 'approving' | 'done'>('init');
  const [error, setError] = useState<string | null>(null);
  const [approveId, setApproveId] = useState<string | null>(null);

  const TENANT_ID = 'tenant_demo_001';
  const USER_ID = 'user_demo_001';
  const WEBHOOK_URL = 'http://localhost:4001/webhook';
  const CALENDAR_EMAIL = 'demo@example.com';

  useEffect(() => {
    if (step === 'init') {
      startDemo();
    }
  }, [step]);

  const startDemo = async () => {
    setStep('creating');
    setError(null);

    try {
      // Step 1: API Key作成
      const apiKeyRes = await fetch('/api/v1/setup/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: TENANT_ID,
          agent_label: 'Demo Agent',
        }),
      });

      if (!apiKeyRes.ok) {
        throw new Error('API Key作成失敗');
      }

      const { api_key, signing_secret } = await apiKeyRes.json();

      // Step 2: Webhook URL登録
      const webhookRes = await fetch('/api/v1/setup/webhook-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Yohaku-Api-Key': api_key,
        },
        body: JSON.stringify({
          tenant_id: TENANT_ID,
          url: WEBHOOK_URL,
        }),
      });

      if (!webhookRes.ok) {
        const errorData = await webhookRes.json();
        throw new Error(`Webhook URL登録失敗: ${errorData.error || 'Unknown error'}`);
      }

      // Step 3: Calendar Email登録
      const calendarRes = await fetch('/api/v1/setup/calendar-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Yohaku-Api-Key': api_key,
        },
        body: JSON.stringify({
          tenant_id: TENANT_ID,
          email: CALENDAR_EMAIL,
        }),
      });

      if (!calendarRes.ok) {
        throw new Error('Calendar Email登録失敗');
      }

      setStep('approving');

      // Step 4: Plan生成
      const planRes = await fetch('/api/v1/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Yohaku-Api-Key': api_key,
          'X-Yohaku-Agent-Label': 'Demo Agent',
        },
        body: JSON.stringify({
          input: 'Send webhook to https://example.com/webhook and create calendar hold for tomorrow 10am',
          context: {
            tenant_id: TENANT_ID,
            user_id: USER_ID,
            tz: 'Asia/Tokyo',
          },
        }),
      });

      if (!planRes.ok) {
        throw new Error('Plan生成失敗');
      }

      const planData = await planRes.json();
      const planId = planData.plans?.[0]?.id;

      if (!planId) {
        throw new Error('Plan ID取得失敗');
      }

      // Step 5: Approve生成
      const approveRes = await fetch('/api/v1/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Yohaku-Api-Key': api_key,
        },
        body: JSON.stringify({
          plan_id: planId,
          tenant_id: TENANT_ID,
          user_id: USER_ID,
        }),
      });

      if (!approveRes.ok) {
        throw new Error('Approve生成失敗');
      }

      const approveData = await approveRes.json();
      const approve_id = approveData.approve_id;

      setApproveId(approve_id);
      setStep('done');

      // 1秒後にApprove Pageに遷移
      setTimeout(() => {
        router.push(`/approve/${approve_id}`);
      }, 1000);

    } catch (err) {
      console.error('[DemoSetup] Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // エラー時は 'init' に戻さない（無限ループ防止）
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Yohaku Demo
          </h1>
          <p className="text-gray-600 mb-8">
            録画用セットアップ
          </p>

          {step === 'init' && (
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🚀</span>
              </div>
              <p className="text-gray-700 font-medium">準備中...</p>
            </div>
          )}

          {step === 'creating' && (
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">⚙️</span>
              </div>
              <p className="text-gray-700 font-medium">セットアップ中...</p>
              <p className="text-sm text-gray-500 mt-2">
                API Key + Webhook URL + Calendar Email
              </p>
            </div>
          )}

          {step === 'approving' && (
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">📝</span>
              </div>
              <p className="text-gray-700 font-medium">Plan生成中...</p>
              <p className="text-sm text-gray-500 mt-2">
                Approve Pageを準備しています
              </p>
            </div>
          )}

          {step === 'done' && !error && (
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">✅</span>
              </div>
              <p className="text-gray-700 font-medium">準備完了！</p>
              <p className="text-sm text-gray-500 mt-2">
                Approve Pageに移動します...
              </p>
            </div>
          )}

          {error && (
            <div>
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">❌</span>
              </div>
              <p className="text-red-700 font-medium mb-2">エラーが発生しました</p>
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setStep('init');
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                再試行
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Tenant:</span>
              <code className="text-gray-700">{TENANT_ID}</code>
            </div>
            <div className="flex justify-between">
              <span>Webhook:</span>
              <code className="text-gray-700">{WEBHOOK_URL}</code>
            </div>
            <div className="flex justify-between">
              <span>Calendar:</span>
              <code className="text-gray-700">{CALENDAR_EMAIL}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
