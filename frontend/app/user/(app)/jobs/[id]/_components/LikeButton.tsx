'use client'

// いいねボタン。押したら即座に「いいね済み」に変わるUIにしている。
// useTransition でサーバーアクションの実行中は disabled にする。

import { useState, useTransition } from 'react'
import { likeJob } from '@/app/actions/like'

interface LikeButtonProps {
  jobPostingId: number
  initialLiked: boolean
}

export function LikeButton({ jobPostingId, initialLiked }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleLike = () => {
    if (liked || isPending) return

    startTransition(async () => {
      const result = await likeJob(jobPostingId)
      if (result.error) {
        setError(result.error)
      } else {
        setLiked(true)
      }
    })
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleLike}
        disabled={liked || isPending}
        className={`w-full py-3 px-6 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2
          ${liked
            ? 'bg-gray-100 text-gray-400 cursor-default'
            : isPending
              ? 'bg-blue-400 text-white cursor-wait'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
      >
        <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {liked ? 'いいね済み' : isPending ? '送信中...' : 'この求人にいいね！'}
      </button>

      {error && (
        <p className="text-red-500 text-xs text-center">{error}</p>
      )}
    </div>
  )
}
