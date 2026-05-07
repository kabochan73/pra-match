'use client'

// 求人作成・編集で共用するフォーム

import { useActionState } from 'react'
import Link from 'next/link'
import type { FormState, JobPosting } from '@/types'

interface JobFormProps {
  action: (state: FormState, formData: FormData) => Promise<FormState>
  defaultValues?: Partial<JobPosting>
  submitLabel: string
}

const employmentTypes = [
  { value: 'full_time',  label: '正社員' },
  { value: 'part_time',  label: 'パート・アルバイト' },
  { value: 'contract',   label: '契約社員' },
  { value: 'freelance',  label: 'フリーランス' },
]

export function JobForm({ action, defaultValues, submitLabel }: JobFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, undefined)

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          求人タイトル <span className="text-red-400">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={defaultValues?.title ?? ''}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          placeholder="例：フロントエンドエンジニア募集"
        />
      </div>

      <div>
        <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700 mb-1">
          雇用形態
        </label>
        <select
          id="employment_type"
          name="employment_type"
          defaultValue={defaultValues?.employment_type ?? ''}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
        >
          <option value="">選択してください</option>
          {employmentTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 mb-1">
          勤務地
        </label>
        <input
          id="prefecture"
          name="prefecture"
          type="text"
          defaultValue={defaultValues?.prefecture ?? ''}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          placeholder="例：東京都"
        />
      </div>

      <div>
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
          給与
        </label>
        <input
          id="salary"
          name="salary"
          type="text"
          defaultValue={defaultValues?.salary ?? ''}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          placeholder="例：月給25万円〜"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          仕事内容
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={defaultValues?.description ?? ''}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
          placeholder="仕事内容を入力してください"
        />
      </div>

      {defaultValues && (
        <div className="flex items-center gap-3">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            value="true"
            defaultChecked={defaultValues?.is_active ?? true}
            className="w-4 h-4 accent-emerald-600"
          />
          <label htmlFor="is_active" className="text-sm text-gray-700">
            公開する
          </label>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Link
          href="/company/jobs"
          className="flex-1 py-3 text-center text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {isPending ? '保存中...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
