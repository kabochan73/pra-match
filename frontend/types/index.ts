// アプリ全体で使う型定義。
// Laravelのモデル・レスポンスの形に合わせて定義している。

export type AuthType = 'user' | 'company'

// 求職者
export interface User {
  id: number
  name: string
  email: string
  birth_date?: string
  gender?: string
  prefecture?: string
  self_introduction?: string
  avatar?: string
}

// 企業
export interface Company {
  id: number
  name: string
  email: string
  industry?: string
  prefecture?: string
  description?: string
  logo?: string
}

// 求人投稿
export interface JobPosting {
  id: number
  company_id: number
  company?: Company      // リレーションで取得した場合に含まれる
  title: string
  description?: string
  salary?: string
  employment_type?: string
  prefecture?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// 求職者が求人にいいねした記録
export interface Like {
  id: number
  user_id: number
  job_posting_id: number
  job_posting?: JobPosting
  expires_at: string     // 企業が1週間以内に返答しないと期限切れになる
  created_at: string
}

// マッチングのステータス一覧
// pending → matched → casual_interview → interview の順に進む
export type MatchStatus =
  | 'pending'           // 求職者がいいね済み・企業未返答
  | 'expired'           // 1週間以内に企業がいいねせず不成立
  | 'matched'           // 双方いいねでマッチング成立
  | 'casual_interview'  // カジュアル面談フェーズ
  | 'rejected'          // カジュアル面談で企業が不成立
  | 'interview'         // 本面接フェーズ

// マッチング
export interface Matching {
  id: number
  user_id: number
  job_posting_id: number
  job_posting?: JobPosting
  user?: User
  status: MatchStatus
  created_at: string
  updated_at: string
}

// メッセージ
export interface Message {
  id: number
  match_id: number
  sender_type: 'user' | 'company'  // どちらが送ったか
  sender_id: number
  body: string
  created_at: string
}

// Server Actions のフォーム状態。
// useActionState の第1引数の型として使う。
export type FormState =
  | { error?: string; fieldErrors?: Record<string, string[]> }
  | undefined
