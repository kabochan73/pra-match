// 企業のメッセージ一覧。マッチング成立した求職者との会話リスト。

import Link from 'next/link'
import { apiGet } from '@/lib/api'
import { getToken } from '@/lib/session'
import type { Matching, MatchStatus } from '@/types'

const statusLabel: Record<MatchStatus, string> = {
  pending:          '返答待ち',
  expired:          '期限切れ',
  matched:          'マッチング成立',
  casual_interview: 'カジュアル面談中',
  rejected:         '見送り',
  interview:        '本面接中',
}

export default async function CompanyMessagesPage() {
  const token = await getToken()
  let matchings: Matching[] = []

  try {
    matchings = await apiGet<Matching[]>('/company/matchings', token)
  } catch {
    // エラー時は空配列のまま表示
  }

  return (
    <div>
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-lg font-bold text-gray-900">メッセージ</h1>
      </header>

      <main className="px-4 py-4 space-y-3">
        {matchings.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-16">
            マッチングした求職者がいません
          </p>
        ) : (
          matchings.map((m) => (
            <Link key={m.id} href={`/company/messages/${m.id}`}>
              <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                    {m.user?.name?.charAt(0) ?? '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{m.user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{m.job_posting?.title}</p>
                  </div>
                </div>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                  {statusLabel[m.status]}
                </span>
              </div>
            </Link>
          ))
        )}
      </main>
    </div>
  )
}
