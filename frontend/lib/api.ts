// Laravel APIへのリクエストをまとめた共通関数。
// fetch を直接書く代わりにこれを使うことで、認証ヘッダーやエラー処理を一箇所で管理できる。

// Server Actions/Server Components からは API_URL（docker内部ネットワーク経由）、
// ブラウザからは NEXT_PUBLIC_API_URL（localhostのポート経由）を使う。
// docker内ではlocalhost:8000は存在しないので環境を分ける必要がある。
function getApiBase(): string {
  if (typeof window === 'undefined') {
    return process.env.API_URL ?? 'http://localhost:8000/api'
  }
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'
}

// レスポンスを受け取り、エラーなら例外を投げる。
// Laravelのバリデーションエラーは errors オブジェクトの中に入っているので、
// その最初のメッセージを取り出して使いやすい形にする。
async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json()
  if (!res.ok) {
    if (data.errors) {
      const firstKey = Object.keys(data.errors)[0]
      const firstMsg = (data.errors[firstKey] as string[])[0]
      throw new Error(firstMsg)
    }
    throw new Error(data.message ?? 'エラーが発生しました')
  }
  return data as T
}

// POST リクエスト（ログイン・登録・いいね など）
export async function apiPost<T>(
  path: string,
  body: unknown,
  token?: string | null, // ログイン済みの場合はトークンを渡す
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${getApiBase()}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  return handleResponse<T>(res)
}

// GET リクエスト（一覧取得・詳細取得 など）
export async function apiGet<T>(
  path: string,
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${getApiBase()}${path}`, { headers })
  return handleResponse<T>(res)
}

// PUT リクエスト（編集 など）
export async function apiPut<T>(
  path: string,
  body: unknown,
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${getApiBase()}${path}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  })
  return handleResponse<T>(res)
}

// DELETE リクエスト（削除 など）
export async function apiDelete<T>(
  path: string,
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${getApiBase()}${path}`, {
    method: 'DELETE',
    headers,
  })
  return handleResponse<T>(res)
}
