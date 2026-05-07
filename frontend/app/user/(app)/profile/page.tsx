// Server Component でプロフィールを取得し、Client Component のフォームに渡す。
// Client Component から直接APIを叩くと CORS の問題があるため、この構造にしている。

import { apiGet } from '@/lib/api'
import { getToken } from '@/lib/session'
import { userLogout } from '@/app/actions/userAuth'
import type { User } from '@/types'
import { ProfileForm } from './_components/ProfileForm'

export default async function UserProfilePage() {
  const token = await getToken()
  const user = await apiGet<User>('/user/profile', token).catch(() => null)

  return (
    <div>
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-lg font-bold text-gray-900">マイページ</h1>
      </header>

      <main className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">プロフィール編集</h2>
          {user ? (
            <ProfileForm user={user} />
          ) : (
            <p className="text-sm text-gray-400">プロフィールの取得に失敗しました</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <form action={userLogout}>
            <button
              type="submit"
              className="w-full py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              ログアウト
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
