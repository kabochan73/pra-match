// 企業の求人管理ページ。自社の求人一覧と作成・編集・削除ができる。

import Link from 'next/link'
import { apiGet } from '@/lib/api'
import { getToken } from '@/lib/session'
import type { JobPosting } from '@/types'
import { DeleteButton } from './_components/DeleteButton'

export default async function CompanyJobsPage() {
  const token = await getToken()
  let jobPostings: JobPosting[] = []

  try {
    jobPostings = await apiGet<JobPosting[]>('/company/my-job-postings', token)
  } catch {
    // エラー時は空配列のまま表示
  }

  return (
    <div>
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">求人管理</h1>
        <Link
          href="/company/jobs/new"
          className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          + 新規作成
        </Link>
      </header>

      <main className="px-4 py-4 space-y-3">
        {jobPostings.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <p className="text-gray-400 text-sm">まだ求人がありません</p>
            <Link
              href="/company/jobs/new"
              className="inline-block text-emerald-600 text-sm border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              最初の求人を作成する
            </Link>
          </div>
        ) : (
          jobPostings.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-semibold text-gray-900 truncate">{job.title}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                      job.is_active
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {job.is_active ? '公開中' : '非公開'}
                    </span>
                  </div>
                  {job.salary && (
                    <p className="text-sm text-gray-500">{job.salary}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/company/jobs/${job.id}/edit`}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2.5 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    編集
                  </Link>
                  <DeleteButton jobId={job.id} />
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}
