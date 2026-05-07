'use client'

// 削除ボタン。確認ダイアログを出してから削除する。

import { useTransition } from 'react'
import { deleteJobPosting } from '@/app/actions/jobPosting'

export function DeleteButton({ jobId }: { jobId: number }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('この求人を削除しますか？')) return
    startTransition(async () => {
      await deleteJobPosting(jobId)
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs text-red-400 hover:text-red-600 px-2.5 py-1 border border-red-100 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
    >
      {isPending ? '削除中...' : '削除'}
    </button>
  )
}
