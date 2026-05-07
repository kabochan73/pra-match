'use client'

import { useState, useTransition } from 'react'
import { companyLike } from '@/app/actions/matching'

export function MatchButton({ matchingId }: { matchingId: number }) {
  const [matched, setMatched] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleMatch = () => {
    startTransition(async () => {
      const result = await companyLike(matchingId)
      if (!result.error) setMatched(true)
    })
  }

  if (matched) {
    return (
      <span className="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
        マッチング成立！
      </span>
    )
  }

  return (
    <button
      onClick={handleMatch}
      disabled={isPending}
      className="text-xs bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-3 py-1.5 rounded-lg transition-colors"
    >
      {isPending ? '...' : 'いいねを返す'}
    </button>
  )
}
