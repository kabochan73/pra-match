// 求職者向けページの共通レイアウト。
// ボトムナビを全ページに表示する。

import { BottomNav } from './_components/BottomNav'

export default function UserAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ボトムナビの高さ分だけ下にpaddingを確保 */}
      <div className="pb-16">{children}</div>
      <BottomNav />
    </div>
  )
}
