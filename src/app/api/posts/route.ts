import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { readDB, writeDB, generateId } from '@/lib/db'

const POST_TTL_MS = 24 * 60 * 60 * 1000

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = readDB()
  const now = new Date()

  const posts = db.posts.filter((p) => {
    if (user.role === 'admin') return true
    return (
      p.recipientIds.includes(user.id) || p.authorId === user.id
    )
  })

  const enriched = posts.map((p) => {
    const author = db.users.find((u) => u.id === p.authorId)
    const reactions = db.reactions.filter((r) => r.postId === p.id)
    const myReaction = reactions.find((r) => r.userId === user.id)
    const isExpired = new Date(p.expiresAt) <= now
    return { ...p, author, reactions, myReaction: myReaction?.type ?? null, isExpired }
  })

  enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json({ posts: enriched })
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content, recipientIds } = await request.json()
  if (!content?.trim()) {
    return NextResponse.json({ error: '内容を入力してください' }, { status: 400 })
  }
  if (!Array.isArray(recipientIds) || recipientIds.length === 0) {
    return NextResponse.json({ error: '送る相手を選んでください' }, { status: 400 })
  }

  const db = readDB()
  const post = {
    id: generateId(),
    authorId: user.id,
    content: content.trim(),
    recipientIds,
    expiresAt: new Date(Date.now() + POST_TTL_MS).toISOString(),
    createdAt: new Date().toISOString(),
  }
  db.posts.push(post)
  writeDB(db)

  return NextResponse.json({ post })
}
