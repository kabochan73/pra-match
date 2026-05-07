import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">PraMachi</h1>
        <p className="text-gray-500">企業と求職者をつなぐマッチングサービス</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
        {/* 求職者 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">求職者の方</h2>
            <p className="mt-1 text-sm text-gray-500">気になる求人に気軽にいいねしよう</p>
          </div>
          <div className="flex flex-col gap-2 mt-auto">
            <Link
              href="/user/login"
              className="w-full text-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/user/register"
              className="w-full text-center py-2.5 px-4 border border-blue-200 text-blue-600 hover:bg-blue-50 text-sm font-medium rounded-lg transition-colors"
            >
              新規登録
            </Link>
          </div>
        </div>

        {/* 企業 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">企業の方</h2>
            <p className="mt-1 text-sm text-gray-500">求人を掲載して優秀な人材を探そう</p>
          </div>
          <div className="flex flex-col gap-2 mt-auto">
            <Link
              href="/company/login"
              className="w-full text-center py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/company/register"
              className="w-full text-center py-2.5 px-4 border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-sm font-medium rounded-lg transition-colors"
            >
              新規登録
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
