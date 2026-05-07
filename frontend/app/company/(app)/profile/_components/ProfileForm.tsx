'use client'

import { useActionState } from 'react'
import { updateCompanyProfile } from '@/app/actions/profile'
import type { FormState, Company } from '@/types'

export function ProfileForm({ company }: { company: Company }) {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    updateCompanyProfile,
    undefined,
  )

  return (
    <form action={action} className="space-y-4" key={company.updated_at}>
      {state?.error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{state.error}</div>
      )}
      {!state?.error && state !== undefined && (
        <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">保存しました</div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          会社名 <span className="text-red-400">*</span>
        </label>
        <input
          id="name" name="name" type="text" required
          defaultValue={company.name}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
        />
      </div>

      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">業種</label>
        <input
          id="industry" name="industry" type="text"
          defaultValue={company.industry ?? ''}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          placeholder="例：IT・インターネット"
        />
      </div>

      <div>
        <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 mb-1">所在地</label>
        <input
          id="prefecture" name="prefecture" type="text"
          defaultValue={company.prefecture ?? ''}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          placeholder="例：東京都"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">会社紹介</label>
        <textarea
          id="description" name="description" rows={4}
          defaultValue={company.description ?? ''}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
          placeholder="会社の特徴や雰囲気を入力してください"
        />
      </div>

      <button
        type="submit" disabled={isPending}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {isPending ? '保存中...' : '変更を保存'}
      </button>
    </form>
  )
}
