// Next.jsのミドルウェア。すべてのリクエストに対してルート保護を行う。
// ページコンポーネントより先に実行されるので、未ログインユーザーのアクセスをここで弾ける。

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Cookieからログイン状態を確認する（localStorageはサーバー側では読めないのでCookieを使う）
  const token = request.cookies.get('auth_token')?.value
  const authType = request.cookies.get('auth_type')?.value

  const isUserAuthPage = pathname === '/user/login' || pathname === '/user/register'
  const isCompanyAuthPage = pathname === '/company/login' || pathname === '/company/register'
  const isUserProtected = pathname.startsWith('/user/') && !isUserAuthPage
  const isCompanyProtected = pathname.startsWith('/company/') && !isCompanyAuthPage

  // ログイン済みが認証ページにアクセスしてきたらダッシュボードへリダイレクト
  if (token && isUserAuthPage) {
    return NextResponse.redirect(new URL('/user/jobs', request.url))
  }
  if (token && isCompanyAuthPage) {
    return NextResponse.redirect(new URL('/company/dashboard', request.url))
  }

  // 未認証 または 権限の種類が違う場合はログインページへリダイレクト
  if (isUserProtected && (!token || authType !== 'user')) {
    return NextResponse.redirect(new URL('/user/login', request.url))
  }
  if (isCompanyProtected && (!token || authType !== 'company')) {
    return NextResponse.redirect(new URL('/company/login', request.url))
  }

  return NextResponse.next()
}

// ミドルウェアを適用するパスの設定。
// 静的ファイル（_next/static など）には適用しない。
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
