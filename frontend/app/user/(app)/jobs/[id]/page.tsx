// 求人詳細ページ。求人情報とスタッフ状況を表示し、いいねができる。

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { apiGet } from '@/lib/api'
import { getToken } from '@/lib/session'
import type { JobPosting, Like } from '@/types'
import { LikeButton } from './_components/LikeButton'

const employmentTypeLabel: Record<string, string> = {
  full_time: '正社員',
  part_time: 'パート・アルバイト',
  contract: '契約社員',
  freelance: 'フリーランス',
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params
  const token = await getToken()

  // 求人詳細とユーザーのいいね一覧を並行取得
  const [job, likes] = await Promise.all([
    apiGet<JobPosting>(`/job-postings/${id}`).catch(() => null),
    token
      ? apiGet<Like[]>('/likes', token).catch(() => [] as Like[])
      : Promise.resolve([] as Like[]),
  ])

  if (!job) notFound()

  // この求人をすでにいいね済みかチェック
  const isLiked = likes.some((l) => l.job_posting_id === job.id)

  return (
    <div>
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <Link href="/user/jobs" className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-base font-bold text-gray-900 truncate">{job.title}</h1>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* 会社情報 */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
            {job.company?.name?.charAt(0) ?? '?'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{job.company?.name}</p>
            {job.company?.industry && (
              <p className="text-sm text-gray-500">{job.company.industry}</p>
            )}
          </div>
        </div>

        {/* 求人情報 */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
          <h2 className="font-bold text-gray-900 text-lg">{job.title}</h2>

          <div className="flex flex-wrap gap-2">
            {job.employment_type && (
              <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                {employmentTypeLabel[job.employment_type] ?? job.employment_type}
              </span>
            )}
            {job.prefecture && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                {job.prefecture}
              </span>
            )}
          </div>

          {job.salary && (
            <div>
              <p className="text-xs text-gray-400 mb-0.5">給与</p>
              <p className="font-medium text-gray-800">{job.salary}</p>
            </div>
          )}

          {job.description && (
            <div>
              <p className="text-xs text-gray-400 mb-1">仕事内容</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          )}
        </div>

        {/* いいねボタン */}
        <LikeButton jobPostingId={job.id} initialLiked={isLiked} />
      </main>
    </div>
  )
}
