'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { userLogin } from '@/app/actions/userAuth'
import type { FormState } from '@/types'

export default function UserLoginPage() {
  const [state, action, isPending] = useActionState<FormState, FormData>(userLogin, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">求職者ログイン</h1>
          <p className="mt-2 text-sm text-gray-500">アカウントにサインインしてください</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {state?.error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {state.error}
            </div>
          )}

          <form action={action} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="8文字以上"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors text-sm"
            >
              {isPending ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            アカウントをお持ちでない方は{' '}
            <Link href="/user/register" className="text-blue-600 hover:underline font-medium">
              新規登録
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          企業の方は{' '}
          <Link href="/company/login" className="text-gray-600 hover:underline">
            こちら
          </Link>
        </p>
      </div>
    </div>
  )
}
