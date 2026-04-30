import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { readDB, writeDB, generateId } from '@/lib/db'
import type { ReactionType } from '@/lib/types'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId, type } = await request.json()
  if (!postId || !['join', 'watch'].includes(type)) {
    return NextResponse.json({ error: '無効なリクエストです' }, { status: 400 })
  }

  const db = readDB()
  const post = db.posts.find((p) => p.id === postId)
  if (!post) return NextResponse.json({ error: '投稿が見つかりません' }, { status: 404 })

  if (new Date(post.expiresAt) <= new Date()) {
    return NextResponse.json({ error: 'この投稿は期限切れです' }, { status: 400 })
  }

  const existing = db.reactions.findIndex(
    (r) => r.postId === postId && r.userId === user.id
  )

  if (existing >= 0) {
    if (db.reactions[existing].type === type) {
      db.reactions.splice(existing, 1)
      writeDB(db)
      return NextResponse.json({ type: null })
    }
    db.reactions[existing].type = type as ReactionType
    db.reactions[existing].createdAt = new Date().toISOString()
  } else {
    db.reactions.push({
      id: generateId(),
      postId,
      userId: user.id,
      type: type as ReactionType,
      createdAt: new Date().toISOString(),
    })
  }

  writeDB(db)
  return NextResponse.json({ type })
}
