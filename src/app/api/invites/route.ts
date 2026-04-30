import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { readDB, writeDB, generateId } from '@/lib/db'

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const db = readDB()
  const invites = db.invites.map((i) => {
    const usedByUser = i.usedBy ? db.users.find((u) => u.id === i.usedBy) : null
    return { ...i, usedByName: usedByUser?.name ?? null }
  })

  return NextResponse.json({ invites })
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { label } = await request.json()
  const code = `${label ? label.toLowerCase().replace(/\s+/g, '-') + '-' : ''}${Math.random().toString(36).slice(2, 8)}`

  const db = readDB()
  const invite = {
    id: generateId(),
    code,
    createdBy: user.id,
  }
  db.invites.push(invite)
  writeDB(db)

  return NextResponse.json({ invite })
}
