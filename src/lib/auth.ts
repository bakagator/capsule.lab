import { cookies } from 'next/headers'
import { readDB } from './db'
import type { User } from './types'

export const SESSION_COOKIE = 'capsule_session'
export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const db = readDB()
  const session = db.sessions.find(
    (s) => s.token === token && new Date(s.expiresAt) > new Date()
  )
  if (!session) return null

  return db.users.find((u) => u.id === session.userId) ?? null
}
