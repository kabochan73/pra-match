'use server'

import { revalidatePath } from 'next/cache'
import { apiPut } from '@/lib/api'
import { getToken, getAuthType } from '@/lib/session'
import type { FormState } from '@/types'

export async function updateUserProfile(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const token = await getToken()

  try {
    await apiPut('/user/profile', {
      name:              formData.get('name'),
      birth_date:        formData.get('birth_date') || null,
      gender:            formData.get('gender') || null,
      prefecture:        formData.get('prefecture') || null,
      self_introduction: formData.get('self_introduction') || null,
    }, token)
    revalidatePath('/user/profile')
  } catch (err) {
    return { error: err instanceof Error ? err.message : '更新に失敗しました' }
  }

  return {}
}

export async function updateCompanyProfile(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const token = await getToken()

  try {
    await apiPut('/company/profile', {
      name:        formData.get('name'),
      industry:    formData.get('industry') || null,
      prefecture:  formData.get('prefecture') || null,
      description: formData.get('description') || null,
    }, token)
    revalidatePath('/company/profile')
  } catch (err) {
    return { error: err instanceof Error ? err.message : '更新に失敗しました' }
  }

  return {}
}
