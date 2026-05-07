// 求人編集ページ。既存の値をフォームに初期値として渡す。

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { apiGet } from '@/lib/api'
import { getToken } from '@/lib/session'
import type { JobPosting, FormState } from '@/types'
import { JobForm } from '../../_components/JobForm'
import { updateJobPosting } from '@/app/actions/jobPosting'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditJobPage({ params }: Props) {
  const { id } = await params
  const token = await getToken()

  const job = await apiGet<JobPosting>(`/job-postings/${Number(id)}`, token).catch(() => null)
  if (!job) notFound()

  // updateJobPosting は (id, state, formData) なので bind で id を束縛する
  const updateAction = updateJobPosting.bind(null, job.id) as (
    state: FormState,
    formData: FormData,
  ) => Promise<FormState>

  return (
    <div>
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <Link href="/company/jobs" className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-base font-bold text-gray-900">求人を編集</h1>
      </header>

      <main className="px-4 py-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <JobForm
            action={updateAction}
            defaultValues={job}
            submitLabel="変更を保存する"
          />
        </div>
      </main>
    </div>
  )
}
