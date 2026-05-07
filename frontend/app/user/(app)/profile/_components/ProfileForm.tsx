'use client'

import { useActionState } from 'react'
import { updateUserProfile } from '@/app/actions/profile'
import type { FormState, User } from '@/types'

const genderOptions = ['男性', '女性', 'その他']

export function ProfileForm({ user }: { user: User }) {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    updateUserProfile,
    undefined,
  )

  return (
    <form action={action} className="space-y-4" key={user.updated_at}>
      {state?.error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{state.error}</div>
      )}
      {!state?.error && state !== undefined && (
        <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">保存しました</div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          お名前 <span className="text-red-400">*</span>
        </label>
        <input
          id="name" name="name" type="text" required
          defaultValue={user.name}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">性別</label>
        <select
          id="gender" name="gender"
          defaultValue={user.gender ?? ''}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="">選択してください</option>
          {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-1">生年月日</label>
        <input
          id="birth_date" name="birth_date" type="date"
          defaultValue={user.birth_date ?? ''}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div>
        <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 mb-1">都道府県</label>
        <input
          id="prefecture" name="prefecture" type="text"
          defaultValue={user.prefecture ?? ''}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="例：東京都"
        />
      </div>

      <div>
        <label htmlFor="self_introduction" className="block text-sm font-medium text-gray-700 mb-1">自己紹介</label>
        <textarea
          id="self_introduction" name="self_introduction" rows={4}
          defaultValue={user.self_introduction ?? ''}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          placeholder="自己紹介を入力してください"
        />
      </div>

      <button
        type="submit" disabled={isPending}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {isPending ? '保存中...' : '変更を保存'}
      </button>
    </form>
  )
}
