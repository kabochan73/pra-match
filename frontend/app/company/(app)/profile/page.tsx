import { apiGet } from '@/lib/api'
import { getToken } from '@/lib/session'
import { companyLogout } from '@/app/actions/companyAuth'
import type { Company } from '@/types'
import { ProfileForm } from './_components/ProfileForm'

export default async function CompanyProfilePage() {
  const token = await getToken()
  const company = await apiGet<Company>('/company/profile', token).catch(() => null)

  return (
    <div>
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-lg font-bold text-gray-900">マイページ</h1>
      </header>

      <main className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">会社情報編集</h2>
          {company ? (
            <ProfileForm company={company} />
          ) : (
            <p className="text-sm text-gray-400">プロフィールの取得に失敗しました</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <form action={companyLogout}>
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
