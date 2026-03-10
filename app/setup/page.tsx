'use client';

import { useState } from 'react';

type Step = 1 | 2 | 3 | 4;

export default function SetupWizard() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [apiKey, setApiKey] = useState('');
  const [agentLabel, setAgentLabel] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [signingSecret, setSigningSecret] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateApiKey = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/setup/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: 'tenant_demo_001',
          agent_label: agentLabel || 'Demo Agent',
        }),
      });

      if (!res.ok) throw new Error('API Key creation failed');

      const data = await res.json();
      setApiKey(data.api_key);
      setSigningSecret(data.signing_secret);
      setCurrentStep(2);
    } catch (err) {
      alert('❌ API Key作成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterWebhook = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/setup/webhook-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Yohaku-Api-Key': apiKey,
        },
        body: JSON.stringify({
          tenant_id: 'tenant_demo_001',
          url: webhookUrl,
        }),
      });

      if (!res.ok) throw new Error('Webhook URL registration failed');

      setCurrentStep(3);
    } catch (err) {
      alert('❌ Webhook URL登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTestPlan = async () => {
    setIsLoading(true);
    setTestResult(null);
    try {
      // Step 1: Generate Plan
      const planRes = await fetch('/api/v1/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Yohaku-Api-Key': apiKey,
          'X-Yohaku-Agent-Label': agentLabel || 'Demo Agent',
        },
        body: JSON.stringify({
          input: `Send test webhook to ${webhookUrl}`,
          context: {
            tenant_id: 'tenant_demo_001',
            user_id: 'user_demo_001',
          },
        }),
      });

      if (!planRes.ok) throw new Error('Plan generation failed');
      const planData = await planRes.json();
      const planId = planData.plans?.[0]?.id;

      // Step 2: Approve
      const approveRes = await fetch('/api/v1/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Yohaku-Api-Key': apiKey,
        },
        body: JSON.stringify({
          plan_id: planId,
          tenant_id: 'tenant_demo_001',
          user_id: 'user_demo_001',
        }),
      });

      if (!approveRes.ok) throw new Error('Approval failed');
      const approveData = await approveRes.json();

      // Step 3: Confirm
      const confirmRes = await fetch('/api/v1/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Yohaku-Api-Key': apiKey,
        },
        body: JSON.stringify({
          plan_id: planId,
          approve_id: approveData.approve_id,
          idempotency_key: `test_${Date.now()}`,
        }),
      });

      if (!confirmRes.ok) throw new Error('Confirm failed');
      const confirmData = await confirmRes.json();

      setTestResult({
        success: true,
        plan_id: planId,
        approve_id: approveData.approve_id,
        receipt_id: confirmData.receipt_id,
        webhook_job_id: confirmData.webhook_job_id,
      });

      setCurrentStep(4);
    } catch (err) {
      setTestResult({
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            30分導入セットアップ
          </h1>
          <p className="text-gray-600">
            Yohaku Action Cloudを4ステップで導入
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-24 h-1 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>API Key</span>
            <span>Webhook URL</span>
            <span>Receiver Kit</span>
            <span>Test</span>
          </div>
        </div>

        {/* Step 1: API Key作成 */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Step 1: API Key作成
            </h2>
            <p className="text-gray-600 mb-6">
              エージェントが使用するAPI Keyを作成します
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Agent Label（推奨）
                </label>
                <input
                  type="text"
                  value={agentLabel}
                  onChange={(e) => setAgentLabel(e.target.value)}
                  placeholder="例: My Demo Agent"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  KYA（Know Your Agent）で追跡するためのラベル
                </p>
              </div>
              <button
                onClick={handleCreateApiKey}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '作成中...' : 'API Key作成'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Webhook URL登録 */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Step 2: Webhook URL登録
            </h2>
            <p className="text-gray-600 mb-6">
              Webhookを受信するURLを登録します（事前登録制）
            </p>

            {/* API Key表示 */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 mb-2">
                ✅ API Key作成完了
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">API Key:</span>
                  <code className="ml-2 px-2 py-1 bg-white border border-green-300 rounded text-xs font-mono">
                    {apiKey}
                  </code>
                </div>
                <div>
                  <span className="text-gray-600">Signing Secret:</span>
                  <code className="ml-2 px-2 py-1 bg-white border border-green-300 rounded text-xs font-mono">
                    {signingSecret.substring(0, 6)}...
                  </code>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Webhook URL
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-domain.com/webhook"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ※ localhost は開発環境のみ許可（本番はHTTPS必須）
                </p>
              </div>
              <button
                onClick={handleRegisterWebhook}
                disabled={isLoading || !webhookUrl}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '登録中...' : 'Webhook URL登録'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Receiver Kit起動 */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Step 3: Receiver Kit起動
            </h2>
            <p className="text-gray-600 mb-6">
              Webhook受信サーバーを起動します
            </p>

            {/* コピペ用コマンド */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Node.js Receiver Kit
              </h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <div className="mb-2"># Clone Receiver Starter Kit</div>
                <div className="mb-2">
                  git clone https://github.com/yohaku/receiver-starter-node.git
                </div>
                <div className="mb-2">cd receiver-starter-node</div>
                <div className="mb-2">npm install</div>
                <div className="mb-4"># Start server</div>
                <div className="mb-2">
                  export WEBHOOK_SIGNING_SECRET="{signingSecret.substring(0, 6)}..."
                </div>
                <div>PORT=4001 npm start</div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `export WEBHOOK_SIGNING_SECRET="${signingSecret}"\nPORT=4001 npm start`
                  );
                  alert('✅ コピーしました');
                }}
                className="mt-3 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-800"
              >
                📋 コマンドをコピー
              </button>
            </div>

            {/* Secret prefix一致確認 */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                ⚠️ 重要: Secret prefix確認
              </h3>
              <p className="text-sm text-yellow-700">
                Receiver起動時のログで、secret prefixが <code className="px-1 bg-white rounded">{signingSecret.substring(0, 6)}</code> と一致していることを確認してください
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(4)}
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Receiver起動完了 → テストへ
            </button>
          </div>
        )}

        {/* Step 4: Test */}
        {currentStep === 4 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Step 4: エンドツーエンドテスト
            </h2>
            <p className="text-gray-600 mb-6">
              Plan → Approve → Confirm の流れを自動実行します
            </p>

            {!testResult && (
              <button
                onClick={handleSendTestPlan}
                disabled={isLoading}
                className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'テスト実行中...' : '🚀 テスト実行'}
              </button>
            )}

            {testResult && testResult.success && (
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  ✅ セットアップ完了！
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="w-32 text-gray-600">Plan ID:</span>
                    <code className="font-mono text-gray-900">{testResult.plan_id}</code>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-gray-600">Approve ID:</span>
                    <code className="font-mono text-gray-900">{testResult.approve_id}</code>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-gray-600">Receipt ID:</span>
                    <code className="font-mono text-gray-900">{testResult.receipt_id}</code>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-gray-600">Webhook Job:</span>
                    <code className="font-mono text-gray-900">{testResult.webhook_job_id}</code>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <a
                    href={`/receipt/${testResult.receipt_id}`}
                    className="flex-1 text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Receipt確認
                  </a>
                  <a
                    href="/jobs"
                    className="flex-1 text-center bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Webhook Jobs確認
                  </a>
                </div>
              </div>
            )}

            {testResult && !testResult.success && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-xl font-bold text-red-800 mb-2">
                  ❌ テスト失敗
                </h3>
                <p className="text-sm text-red-700">{testResult.error}</p>
                <button
                  onClick={handleSendTestPlan}
                  disabled={isLoading}
                  className="mt-4 w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  再試行
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

