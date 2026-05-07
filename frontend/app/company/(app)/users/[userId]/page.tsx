// 企業が閲覧する求職者プロフィールページ。
// 自社求人にいいねした人のみ閲覧できる（バックエンド側でも403チェック済み）。

import { notFound } from 'next/navigation'
import { apiGet } from '@/lib/api'
import { getToken } from '@/lib/session'
import type { User } from '@/types'
import { BackButton } from './_components/BackButton'

interface Props {
  params: Promise<{ userId: string }>
}

export default async function UserProfileViewPage({ params }: Props) {
  const { userId } = await params
  const token = await getToken()

  const user = await apiGet<User>(`/company/users/${userId}`, token).catch(() => null)
  if (!user) notFound()

  return (
    <div>
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <BackButton />
        <h1 className="text-base font-bold text-gray-900">求職者プロフィール</h1>
      </header>

      <main className="px-4 py-4 space-y-3">
        {/* アバター・名前 */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl">
            {user.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
        </div>

        {/* 詳細情報 */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          {user.prefecture && <Row label="都道府県" value={user.prefecture} />}
          {user.gender && <Row label="性別" value={user.gender} />}
          {user.birth_date && <Row label="生年月日" value={user.birth_date} />}
          {user.self_introduction && (
            <div>
              <p className="text-xs text-gray-400 mb-1">自己紹介</p>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {user.self_introduction}
              </p>
            </div>
          )}
          {!user.prefecture && !user.gender && !user.birth_date && !user.self_introduction && (
            <p className="text-sm text-gray-400 text-center py-4">プロフィール未入力</p>
          )}
        </div>
      </main>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  )
}
