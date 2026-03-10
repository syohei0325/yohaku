'use client';

import { useEffect, useState } from 'react';

type WebhookJob = {
  job_id: string;
  tenant_id: string;
  target_url: string;
  status: 'queued' | 'delivering' | 'succeeded' | 'failed';
  attempts: number;
  error_code?: string;
  error_hash?: string;
  http_status?: number;
  idempotency_key: string;
  created_at: string;
  updated_at: string;
  next_retry_at?: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<WebhookJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'queued' | 'delivering' | 'succeeded' | 'failed'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`/api/v1/jobs?filter=${filter}`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data.jobs || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchJobs();
    }, 5000); // 5秒ごとに自動更新

    return () => clearInterval(interval);
  }, [autoRefresh, filter]);

  const handleRetry = async (jobId: string) => {
    try {
      const res = await fetch(`/api/v1/jobs/${jobId}/retry`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Retry failed');
      alert('✅ Retry queued');
      fetchJobs();
    } catch (err) {
      alert('❌ Retry failed');
    }
  };

  const statusConfig = {
    queued: { icon: '⏳', label: 'Queued', color: 'blue' },
    delivering: { icon: '🚀', label: 'Delivering', color: 'yellow' },
    succeeded: { icon: '✅', label: 'Succeeded', color: 'green' },
    failed: { icon: '❌', label: 'Failed', color: 'red' },
  };

  const filteredJobs = jobs;

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Webhook Jobs</h1>
            <p className="text-sm text-gray-600 mt-1">
              配送状況をリアルタイムでモニタリング
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              自動更新（5秒）
            </label>
            <button
              onClick={fetchJobs}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              🔄 更新
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'queued', 'delivering', 'succeeded', 'failed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Jobs Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-4xl animate-pulse mb-4">⏳</div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-600">Jobがありません</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Job ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Target URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Attempts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredJobs.map((job) => {
                    const config = statusConfig[job.status];
                    return (
                      <tr key={job.job_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-${config.color}-100 text-${config.color}-800`}
                          >
                            {config.icon} {config.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-xs font-mono text-gray-900">
                            {job.job_id.substring(0, 12)}...
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {job.target_url}
                          </div>
                          {job.error_code && (
                            <div className="text-xs text-red-600 mt-1 max-w-xs truncate">
                              Error: {job.error_code} (hash: {job.error_hash?.substring(0, 8)}...)
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{job.attempts}</span>
                          {job.next_retry_at && (
                            <div className="text-xs text-gray-500 mt-1">
                              Next: {new Date(job.next_retry_at).toLocaleTimeString('ja-JP')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(job.created_at).toLocaleString('ja-JP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {job.status === 'failed' && (
                            <button
                              onClick={() => handleRetry(job.job_id)}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Retry
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = jobs.filter((j) => j.status === status).length;
            return (
              <div
                key={status}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center`}
              >
                <div className="text-3xl mb-2">{config.icon}</div>
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-xs text-gray-600 uppercase">{config.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

