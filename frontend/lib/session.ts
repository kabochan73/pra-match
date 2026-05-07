// ログイン状態をCookieで管理する関数群。
// localStorageではなくCookieを使う理由は、middleware.ts（サーバー側）からも読めるから。
// localStorageはブラウザ上でしか読めないため、ルート保護に使えない。

import { cookies } from 'next/headers'
import type { AuthType } from '@/types'

const TOKEN_KEY = 'auth_token'  // Sanctumから発行されたAPIトークン
const TYPE_KEY = 'auth_type'    // 'user' または 'company'

const cookieOptions = {
  secure: process.env.NODE_ENV === 'production', // 本番環境ではHTTPSのみ
  sameSite: 'lax' as const, // CSRF対策
  path: '/',
}

// ログイン成功時にトークンとユーザー種別をCookieに保存する
// auth_token は httpOnly: true にして JavaScript から読めなくする（XSS対策）
export async function createSession(token: string, type: AuthType): Promise<void> {
  const jar = await cookies()
  jar.set(TOKEN_KEY, token, { ...cookieOptions, httpOnly: true })
  jar.set(TYPE_KEY, type, { ...cookieOptions, httpOnly: false }) // UIで表示に使うため読めるようにしておく
}

// ログアウト時にCookieを削除する
export async function deleteSession(): Promise<void> {
  const jar = await cookies()
  jar.delete(TOKEN_KEY)
  jar.delete(TYPE_KEY)
}

// APIリクエスト時にトークンを取り出す（Server Actions / Server Components 内で使う）
export async function getToken(): Promise<string | null> {
  const jar = await cookies()
  return jar.get(TOKEN_KEY)?.value ?? null
}

// 現在のログインユーザーが求職者か企業かを返す
export async function getAuthType(): Promise<AuthType | null> {
  const jar = await cookies()
  const val = jar.get(TYPE_KEY)?.value
  if (val === 'user' || val === 'company') return val
  return null
}
