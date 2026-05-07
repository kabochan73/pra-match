// 求職者のメッセージ画面。ポーリングで新着メッセージを自動取得する。

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { apiGet } from '@/lib/api'
import { getToken } from '@/lib/session'
import type { Matching, Message } from '@/types'
import { MessageInput } from '@/app/_components/MessageInput'
import { PollingRefresher } from '@/app/_components/PollingRefresher'

interface Props {
  params: Promise<{ matchingId: string }>
}

export default async function UserMessageThreadPage({ params }: Props) {
  const { matchingId } = await params
  const token = await getToken()

  const [matching, messages] = await Promise.all([
    apiGet<Matching>(`/user/matchings`, token)
      .then((list) => (list as Matching[]).find((m) => m.id === Number(matchingId)) ?? null)
      .catch(() => null),
    apiGet<Message[]>(`/matchings/${matchingId}/messages`, token).catch(() => [] as Message[]),
  ])

  if (!matching) notFound()

  return (
    <div className="flex flex-col h-screen">
      {/* ポーリング（3秒ごとに router.refresh() を呼ぶだけ） */}
      <PollingRefresher intervalMs={20000} />

      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 shrink-0">
        <Link href="/user/messages" className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {matching.job_posting?.company?.name}
          </p>
          <p className="text-xs text-gray-400 truncate">{matching.job_posting?.title}</p>
        </div>
      </header>

      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-4">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">
            最初のメッセージを送ってみましょう
          </p>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender_type === 'user'
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMine
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {msg.body}
              </div>
            </div>
          )
        })}
      </div>

      {/* 入力欄（画面下部に固定） */}
      <div className="shrink-0 mb-16">
        <MessageInput matchingId={Number(matchingId)} />
      </div>
    </div>
  )
}
