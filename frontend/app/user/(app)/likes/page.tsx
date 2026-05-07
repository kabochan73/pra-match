// いいね欄。求職者がいいねした求人の一覧。マッチング状況もここで確認できる。

import Link from 'next/link'
import { apiGet } from '@/lib/api'
import { getToken } from '@/lib/session'
import type { Like, MatchStatus } from '@/types'

// マッチングステータスの日本語表示
const statusLabel: Record<MatchStatus, { label: string; color: string }> = {
  pending:          { label: '返答待ち',         color: 'text-yellow-600 bg-yellow-50' },
  expired:          { label: '期限切れ',          color: 'text-gray-400 bg-gray-100' },
  matched:          { label: 'マッチング成立！',  color: 'text-blue-600 bg-blue-50' },
  casual_interview: { label: 'カジュアル面談中', color: 'text-purple-600 bg-purple-50' },
  rejected:         { label: '見送り',            color: 'text-red-500 bg-red-50' },
  interview:        { label: '本面接中',           color: 'text-green-600 bg-green-50' },
}

export default async function LikesPage() {
  const token = await getToken()
  let likes: Like[] = []

  try {
    likes = await apiGet<Like[]>('/likes', token)
  } catch {
    // エラー時は空配列のまま表示
  }

  return (
    <div>
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-lg font-bold text-gray-900">いいね欄</h1>
      </header>

      <main className="px-4 py-4 space-y-3">
        {likes.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <p className="text-gray-400 text-sm">まだいいねした求人がありません</p>
            <Link href="/user/jobs" className="text-blue-600 text-sm hover:underline">
              求人を探す
            </Link>
          </div>
        ) : (
          likes.map((like) => {
            const job = like.job_posting
            if (!job) return null

            return (
              <Link key={like.id} href={`/user/jobs/${job.id}`}>
                <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                        {job.company?.name?.charAt(0) ?? '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 truncate">{job.company?.name}</p>
                        <p className="font-medium text-gray-900 text-sm truncate">{job.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </main>
    </div>
  )
}
