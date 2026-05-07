import { getAuthType } from '@/lib/session'
import { redirect } from 'next/navigation'
import { companyLogout } from '@/app/actions/companyAuth'

export default async function CompanyDashboardPage() {
  const authType = await getAuthType()
  if (authType !== 'company') redirect('/company/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">企業ダッシュボード</h1>
        <form action={companyLogout}>
          <button
            type="submit"
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ログアウト
          </button>
        </form>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-gray-500 text-sm">
          ログイン成功！ここに求人管理などが表示されます。
        </p>
      </main>
    </div>
  )
}
