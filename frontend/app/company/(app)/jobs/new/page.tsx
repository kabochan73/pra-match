import Link from 'next/link'
import { createJobPosting } from '@/app/actions/jobPosting'
import { JobForm } from '../_components/JobForm'

export default function NewJobPage() {
  return (
    <div>
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <Link href="/company/jobs" className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-base font-bold text-gray-900">求人を作成</h1>
      </header>

      <main className="px-4 py-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <JobForm action={createJobPosting} submitLabel="求人を作成する" />
        </div>
      </main>
    </div>
  )
}
