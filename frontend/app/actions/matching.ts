'use server'

// 企業のマッチング操作 Server Actions

import { revalidatePath } from 'next/cache'
import { apiPost } from '@/lib/api'
import { getToken } from '@/lib/session'

// 企業がいいねを返す（pending → matched）
export async function companyLike(matchingId: number): Promise<{ error?: string }> {
  const token = await getToken()

  try {
    await apiPost(`/matchings/${matchingId}/like`, {}, token)
    revalidatePath('/company/likes')
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' }
  }

  return {}
}
