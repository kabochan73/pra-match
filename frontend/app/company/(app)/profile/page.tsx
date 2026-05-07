import { companyLogout } from '@/app/actions/companyAuth'

export default function CompanyProfilePage() {
  return (
    <div>
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-lg font-bold text-gray-900">マイページ</h1>
      </header>
      <main className="px-4 py-4">
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
