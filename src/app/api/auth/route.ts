import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { readDB, writeDB, generateId, generateToken } from '@/lib/db'
import { SESSION_COOKIE, SESSION_DURATION_MS } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { code, name } = await request.json()

  if (!code || !name?.trim()) {
    return NextResponse.json({ error: '招待コードと名前を入力してください' }, { status: 400 })
  }

  const db = readDB()
  const invite = db.invites.find((i) => i.code === code && !i.usedBy)
  if (!invite) {
    return NextResponse.json({ error: '招待コードが無効です' }, { status: 400 })
  }

  const isFirstUser = db.users.length === 0
  const isAdminCode = invite.createdBy === 'system'
  const role = isFirstUser || isAdminCode ? 'admin' : 'user'

  const user = {
    id: generateId(),
    name: name.trim(),
    role: role as 'admin' | 'user',
    createdAt: new Date().toISOString(),
  }

  invite.usedBy = user.id
  invite.usedAt = new Date().toISOString()
  db.users.push(user)

  const token = generateToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString()
  db.sessions.push({ token, userId: user.id, expiresAt })
  writeDB(db)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  })

  return NextResponse.json({ user })
}

export async function DELETE() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (token) {
    const db = readDB()
    db.sessions = db.sessions.filter((s) => s.token !== token)
    writeDB(db)
    cookieStore.delete(SESSION_COOKIE)
  }

  return NextResponse.json({ ok: true })
}
