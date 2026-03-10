'use client';

import { useState } from 'react';

type FreezeScope = 'tenant' | 'connector' | 'target';

type FreezeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onFreeze: (scope: FreezeScope, value: string, reason: string) => Promise<void>;
};

export default function FreezeModal({ isOpen, onClose, onFreeze }: FreezeModalProps) {
  const [scope, setScope] = useState<FreezeScope>('tenant');
  const [value, setValue] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || !reason.trim()) {
      alert('⚠️ すべての項目を入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      await onFreeze(scope, value, reason);
      // Reset form
      setValue('');
      setReason('');
      onClose();
    } catch (err) {
      alert('❌ Freeze設定に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🧊</span>
              <div>
                <h2 className="text-2xl font-bold text-red-900">Freeze（緊急停止）</h2>
                <p className="text-sm text-red-700 mt-1">
                  実行を即座に停止します（慎重に使用してください）
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Scope Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Freeze範囲
            </label>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="scope"
                  value="tenant"
                  checked={scope === 'tenant'}
                  onChange={(e) => setScope(e.target.value as FreezeScope)}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-gray-900">Tenant全体</div>
                  <div className="text-sm text-gray-600">
                    指定したTenantのすべての実行を停止
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="scope"
                  value="connector"
                  checked={scope === 'connector'}
                  onChange={(e) => setScope(e.target.value as FreezeScope)}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-gray-900">Connector単位</div>
                  <div className="text-sm text-gray-600">
                    特定のConnector（例: webhook, calendar）のみ停止
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="scope"
                  value="target"
                  checked={scope === 'target'}
                  onChange={(e) => setScope(e.target.value as FreezeScope)}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-gray-900">Target URL単位</div>
                  <div className="text-sm text-gray-600">
                    特定のWebhook URLへの配送のみ停止
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Value Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {scope === 'tenant' && 'Tenant ID'}
              {scope === 'connector' && 'Connector名'}
              {scope === 'target' && 'Target URL'}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={
                scope === 'tenant'
                  ? '例: tenant_demo_001'
                  : scope === 'connector'
                  ? '例: webhook'
                  : '例: https://example.com/webhook'
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          {/* Reason Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              停止理由（必須）
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="例: 不正なWebhook配送を検知したため緊急停止"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={4}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              ※ 停止理由は監査ログに記録されます
            </p>
          </div>

          {/* Warning */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">注意事項</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Freeze中は対象範囲のすべての実行が拒否されます</li>
                  <li>解除するまで実行は再開されません</li>
                  <li>Freeze操作は監査ログに記録されます</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-red-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '停止中...' : '🧊 Freeze実行'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-4 rounded-lg font-semibold text-gray-700 border-2 border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

