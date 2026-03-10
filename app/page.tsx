'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Yohaku Action Cloud
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-4">
            AI/Automationの実行責任を<br className="sm:hidden" />30分で導入
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Exit-first / Confirm Layer / Private β
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/setup"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              🚀 30分導入を始める
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
            >
              Dashboard
            </Link>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-sm text-green-800">
            ✅ MVP完成 / 設計パートナー募集中
          </div>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          3つの価値提案
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* KYA */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-5xl mb-4">🔐</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              KYA（Know Your Agent）
            </h3>
            <p className="text-gray-600">
              誰が・誰の代理で・何を確定したかを必ず記録。監査に耐える実行責任。
            </p>
          </div>

          {/* Ledger */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-5xl mb-4">📜</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Ledger（監査台帳）
            </h3>
            <p className="text-gray-600">
              Append-only / Tamper-evidentな実行ログ。後から一発で説明できる。
            </p>
          </div>

          {/* Freeze */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-5xl mb-4">🧊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Freeze（緊急停止）
            </h3>
            <p className="text-gray-600">
              異常検知時に即座に停止。Tenant/Connector/Target単位で制御可能。
            </p>
          </div>
        </div>
      </div>

      {/* Core Experience */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          コア体験（4ステップ）
        </h2>
        <div className="space-y-6">
          {[
            { step: 1, icon: '📝', title: 'Plan生成', desc: 'Agentが /plan を叩く（複数案 or 1案）' },
            { step: 2, icon: '✅', title: 'Approve', desc: '人間 or ルールが承認（TTL 10分）' },
            { step: 3, icon: '🚀', title: 'Confirm', desc: '実行（idempotency必須）' },
            { step: 4, icon: '📜', title: 'Receipt', desc: 'Ledger（監査台帳）に記録 + 社内共有' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                {item.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connectors */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Phase1コネクタ（2本固定）
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Webhook */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-5xl mb-4">🔗</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Webhook Dispatch
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>HMAC署名 + Timestamp</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Retry（指数バックオフ、2h収束）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Idempotency（24h保証）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>事前登録制URL</span>
              </li>
            </ul>
          </div>

          {/* Calendar Hold */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Calendar Hold（ICS）
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>ICSファイル生成</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Google/Outlook/Apple対応</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>可逆（削除可能）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Timezone対応</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-blue-600 rounded-2xl shadow-xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            設計パートナー募集中
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            60日無料で一緒に作り切ります
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/setup"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              30分導入を始める
            </Link>
            <a
              href="mailto:hello@yohaku.app"
              className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold text-lg hover:bg-blue-800 transition-colors border-2 border-blue-500"
            >
              お問い合わせ
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-gray-600">
            © 2025 Yohaku. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/docs" className="text-gray-600 hover:text-gray-900">
              Docs
            </Link>
            <Link href="/jobs" className="text-gray-600 hover:text-gray-900">
              Jobs
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <a
              href="https://github.com/yohaku"
              className="text-gray-600 hover:text-gray-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
