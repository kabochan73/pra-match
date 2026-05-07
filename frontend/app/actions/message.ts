'use server'

import { revalidatePath } from 'next/cache'
import { apiPost } from '@/lib/api'
import { getToken } from '@/lib/session'
import type { FormState } from '@/types'

export async function sendMessage(
  matchingId: number,
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const token = await getToken()
  const body = (formData.get('body') as string)?.trim()

  if (!body) return { error: 'メッセージを入力してください' }

  try {
    await apiPost(`/matchings/${matchingId}/messages`, { body }, token)
    // 求職者・企業どちらの画面でも反映されるよう両方リバリデート
    revalidatePath(`/user/messages/${matchingId}`)
    revalidatePath(`/company/messages/${matchingId}`)
  } catch (err) {
    return { error: err instanceof Error ? err.message : '送信に失敗しました' }
  }

  return {}
}
