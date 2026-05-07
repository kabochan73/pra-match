'use server'

// 企業の求人CRUD Server Actions

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { apiPost, apiPut, apiDelete } from '@/lib/api'
import { getToken } from '@/lib/session'
import type { FormState, JobPosting } from '@/types'

export async function createJobPosting(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const token = await getToken()

  try {
    await apiPost<JobPosting>('/job-postings', {
      title:           formData.get('title'),
      description:     formData.get('description') || null,
      salary:          formData.get('salary') || null,
      employment_type: formData.get('employment_type') || null,
      prefecture:      formData.get('prefecture') || null,
    }, token)
  } catch (err) {
    return { error: err instanceof Error ? err.message : '作成に失敗しました' }
  }

  redirect('/company/jobs')
}

export async function updateJobPosting(
  id: number,
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const token = await getToken()

  try {
    await apiPut<JobPosting>(`/job-postings/${id}`, {
      title:           formData.get('title'),
      description:     formData.get('description') || null,
      salary:          formData.get('salary') || null,
      employment_type: formData.get('employment_type') || null,
      prefecture:      formData.get('prefecture') || null,
      is_active:       formData.get('is_active') === 'true',
    }, token)
  } catch (err) {
    return { error: err instanceof Error ? err.message : '更新に失敗しました' }
  }

  redirect('/company/jobs')
}

export async function deleteJobPosting(id: number): Promise<{ error?: string }> {
  const token = await getToken()

  try {
    await apiDelete(`/job-postings/${id}`, token)
    revalidatePath('/company/jobs')
  } catch (err) {
    return { error: err instanceof Error ? err.message : '削除に失敗しました' }
  }

  return {}
}
