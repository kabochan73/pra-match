// 求人ごとのいいね一覧。いいねを返すボタンからマッチング成立させられる。

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { apiGet } from '@/lib/api'
import { getToken } from '@/lib/session'
import type { JobPosting, Like, MatchStatus } from '@/types'
import { MatchButton } from './_components/MatchButton'

const statusInfo: Record<MatchStatus, { label: string; color: string }> = {
  pending:          { label: '返答待ち',        color: 'text-yellow-600 bg-yellow-50' },
  expired:          { label: '期限切れ',         color: 'text-gray-400 bg-gray-100' },
  matched:          { label: 'マッチング成立',   color: 'text-blue-600 bg-blue-50' },
  casual_interview: { label: 'カジュアル面談中', color: 'text-purple-600 bg-purple-50' },
  rejected:         { label: '見送り',           color: 'text-red-500 bg-red-50' },
  interview:        { label: '本面接中',          color: 'text-emerald-600 bg-emerald-50' },
}

interface Props {
  params: Promise<{ jobId: string }>
}

export default async function JobLikesPage({ params }: Props) {
  const { jobId } = await params
  const token = await getToken()

  const [job, likes] = await Promise.all([
    apiGet<JobPosting>(`/job-postings/${jobId}`, token).catch(() => null),
    apiGet<Like[]>(`/job-postings/${jobId}/likes`, token).catch(() => [] as Like[]),
  ])

  if (!job) notFound()

  return (
    <div>
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <Link href="/company/likes" className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-base font-bold text-gray-900 truncate">{job.title}</h1>
      </header>

      <main className="px-4 py-4 space-y-3">
        {likes.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-16">まだいいねがありません</p>
        ) : (
          likes.map((like) => {
            const status = like.matching?.status
            const info = status ? statusInfo[status] : null

            return (
              <div key={like.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                      {like.user?.name?.charAt(0) ?? '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">{like.user?.name}</p>
                      {info && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${info.color}`}>
                          {info.label}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* pending のときだけ「いいねを返す」ボタンを表示 */}
                  {status === 'pending' && like.matching && (
                    <MatchButton matchingId={like.matching.id} />
                  )}
                </div>
              </div>
            )
          })
        )}
      </main>
    </div>
  )
}
