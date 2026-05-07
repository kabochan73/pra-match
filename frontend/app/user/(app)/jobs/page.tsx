// 求人一覧ページ。認証不要でも見れるAPIだが、求職者としてログイン中の画面。

import Link from 'next/link'
import { apiGet } from '@/lib/api'
import type { JobPosting } from '@/types'

// 雇用形態の日本語マッピング
const employmentTypeLabel: Record<string, string> = {
  full_time: '正社員',
  part_time: 'パート・アルバイト',
  contract: '契約社員',
  freelance: 'フリーランス',
}

export default async function JobsPage() {
  let jobPostings: JobPosting[] = []

  try {
    jobPostings = await apiGet<JobPosting[]>('/job-postings')
  } catch {
    // エラー時は空配列のまま表示
  }

  return (
    <div>
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-lg font-bold text-gray-900">求人一覧</h1>
      </header>

      <main className="px-4 py-4 space-y-3">
        {jobPostings.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-16">求人がありません</p>
        ) : (
          jobPostings.map((job) => (
            <Link key={job.id} href={`/user/jobs/${job.id}`}>
              <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
                {/* 会社名 */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                    {job.company?.name?.charAt(0) ?? '?'}
                  </div>
                  <span className="text-sm text-gray-500">{job.company?.name}</span>
                </div>

                {/* 求人タイトル */}
                <h2 className="font-semibold text-gray-900 mb-2">{job.title}</h2>

                {/* バッジ類 */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {job.employment_type && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      {employmentTypeLabel[job.employment_type] ?? job.employment_type}
                    </span>
                  )}
                  {job.prefecture && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {job.prefecture}
                    </span>
                  )}
                </div>

                {/* 給与 */}
                {job.salary && (
                  <p className="text-sm font-medium text-gray-700">{job.salary}</p>
                )}
              </div>
            </Link>
          ))
        )}
      </main>
    </div>
  )
}
