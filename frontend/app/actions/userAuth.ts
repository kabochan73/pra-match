'use server'

import { redirect } from 'next/navigation'
import { apiPost } from '@/lib/api'
import { createSession, deleteSession, getToken } from '@/lib/session'
import type { FormState, User } from '@/types'

interface AuthResponse {
  user: User
  token: string
}

export async function userLogin(_state: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const data = await apiPost<AuthResponse>('/user/login', { email, password })
    await createSession(data.token, 'user')
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'ログインに失敗しました' }
  }

  return { redirectTo: '/user/jobs' }
}

export async function userRegister(_state: FormState, formData: FormData): Promise<FormState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const password_confirmation = formData.get('password_confirmation') as string

  try {
    const data = await apiPost<AuthResponse>('/user/register', {
      name,
      email,
      password,
      password_confirmation,
    })
    await createSession(data.token, 'user')
  } catch (err) {
    return { error: err instanceof Error ? err.message : '登録に失敗しました' }
  }

  return { redirectTo: '/user/jobs' }
}

export async function userLogout(): Promise<void> {
  const token = await getToken()
  if (token) {
    try {
      await apiPost('/user/logout', {}, token)
    } catch {
      // APIが失敗してもCookieは削除するので無視
    }
  }
  await deleteSession()
  redirect('/user/login')
}
