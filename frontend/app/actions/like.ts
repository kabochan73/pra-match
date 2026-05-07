'use server'

// 求職者がいいねするアクション。
// いいねすると同時にLaravel側でmatchesレコード（status: pending）も作られる。

import { revalidatePath } from 'next/cache'
import { apiPost } from '@/lib/api'
import { getToken } from '@/lib/session'

export async function likeJob(jobPostingId: number): Promise<{ error?: string }> {
  const token = await getToken()

  try {
    await apiPost(`/job-postings/${jobPostingId}/like`, {}, token)
    // キャッシュを更新して、詳細ページといいね欄に反映させる
    revalidatePath(`/user/jobs/${jobPostingId}`)
    revalidatePath('/user/likes')
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'いいねに失敗しました' }
  }

  return {}
}
