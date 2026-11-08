export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000'

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(BASE + path, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init.headers },
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Is "npm run api" running?')
  }
  if (!res.ok) throw new ApiError(res.status, `Request failed (${res.status}).`)
  return (await res.json()) as T
}

export const jsonBody = (data: unknown): RequestInit => ({ body: JSON.stringify(data) })
