// 企業のいいね欄。求人ごとにいいねしてきた求職者の一覧が見れる。

import Link from 'next/link'
import { apiGet } from '@/lib/api'
import { getToken } from '@/lib/session'
import type { JobPosting } from '@/types'

export default async function CompanyLikesPage() {
  const token = await getToken()
  let jobPostings: JobPosting[] = []

  try {
    jobPostings = await apiGet<JobPosting[]>('/company/my-job-postings', token)
  } catch {
    // エラー時は空配列のまま表示
  }

  return (
    <div>
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-lg font-bold text-gray-900">いいね欄</h1>
      </header>

      <main className="px-4 py-4 space-y-3">
        {jobPostings.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <p className="text-gray-400 text-sm">求人がありません</p>
            <Link href="/company/jobs/new" className="text-emerald-600 text-sm hover:underline">
              求人を作成する
            </Link>
          </div>
        ) : (
          jobPostings.map((job) => (
            <Link key={job.id} href={`/company/likes/${job.id}`}>
              <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-medium text-gray-900">{job.title}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {job.is_active ? '公開中' : '非公開'}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))
        )}
      </main>
    </div>
  )
}
