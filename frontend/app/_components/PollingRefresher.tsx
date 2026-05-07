'use client'

// 一定間隔でページを再フェッチするコンポーネント。
// router.refresh() でサーバーコンポーネントのデータを再取得することでポーリングを実現している。

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function PollingRefresher({ intervalMs = 3000 }: { intervalMs?: number }) {
  const router = useRouter()

  useEffect(() => {
    const id = setInterval(() => {
      router.refresh()
    }, intervalMs)

    return () => clearInterval(id)
  }, [router, intervalMs])

  return null
}
