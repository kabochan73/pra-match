'use client'

// メッセージ入力フォーム。送信成功後に入力欄をクリアする。

import { useActionState, useEffect, useRef } from 'react'
import { sendMessage } from '@/app/actions/message'
import type { FormState } from '@/types'

export function MessageInput({ matchingId }: { matchingId: number }) {
  const action = sendMessage.bind(null, matchingId)
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, undefined)
  const inputRef = useRef<HTMLInputElement>(null)

  // 送信成功後に入力欄をリセット
  useEffect(() => {
    if (!isPending && !state?.error && inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.focus()
    }
  }, [isPending, state])

  return (
    <div className="border-t border-gray-100 bg-white p-3">
      {state?.error && (
        <p className="text-red-500 text-xs mb-2 px-1">{state.error}</p>
      )}
      <form action={formAction} className="flex gap-2">
        <input
          ref={inputRef}
          name="body"
          type="text"
          required
          placeholder="メッセージを入力..."
          className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-full text-sm font-medium transition-colors"
        >
          送信
        </button>
      </form>
    </div>
  )
}
