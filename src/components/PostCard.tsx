'use client'

import { useState } from 'react'
import type { ReactionType } from '@/lib/types'

type PostCardProps = {
  post: {
    id: string
    content: string
    expiresAt: string
    createdAt: string
    isExpired: boolean
    author?: { name: string }
    reactions: { userId: string; type: ReactionType }[]
    myReaction: ReactionType | null
  }
  currentUserId: string
  isAdmin?: boolean
}

function timeRemaining(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return '期限切れ'
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (h > 0) return `あと${h}時間${m}分`
  return `あと${m}分`
}

export default function PostCard({ post, currentUserId, isAdmin }: PostCardProps) {
  const [myReaction, setMyReaction] = useState<ReactionType | null>(post.myReaction)
  const [reactions, setReactions] = useState(post.reactions)
  const [loading, setLoading] = useState(false)

  const joinCount = reactions.filter((r) => r.type === 'join').length
  const watchCount = reactions.filter((r) => r.type === 'watch').length

  async function react(type: ReactionType) {
    if (post.isExpired || loading) return
    setLoading(true)

    const newType = myReaction === type ? null : type

    setMyReaction(newType)
    setReactions((prev) => {
      const without = prev.filter((r) => r.userId !== currentUserId)
      if (newType) return [...without, { userId: currentUserId, type: newType }]
      return without
    })

    await fetch('/api/reactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: post.id, type }),
    })

    setLoading(false)
  }

  const isAuthor = post.author === undefined

  return (
    <div
      className={`rounded-2xl border p-5 flex flex-col gap-3 transition-opacity ${
        post.isExpired ? 'opacity-50' : ''
      }`}
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          {post.author?.name ?? '（自分）'}
          {isAdmin && post.author && (
            <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
              admin表示
            </span>
          )}
        </span>
        <span
          className="text-xs"
          style={{ color: post.isExpired ? 'var(--text-muted)' : 'var(--pink)' }}
        >
          {timeRemaining(post.expiresAt)}
        </span>
      </div>

      <p className="text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>

      {!post.isExpired && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => react('join')}
            disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: myReaction === 'join' ? 'var(--pink)' : 'var(--surface-2)',
              color: myReaction === 'join' ? '#000' : 'var(--text-muted)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: myReaction === 'join' ? 'var(--pink)' : 'var(--border)',
            }}
          >
            🙌 一緒にやりたい
            {joinCount > 0 && <span className="ml-1.5">{joinCount}</span>}
          </button>
          <button
            onClick={() => react('watch')}
            disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: myReaction === 'watch' ? '#333' : 'var(--surface-2)',
              color: myReaction === 'watch' ? '#fff' : 'var(--text-muted)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: myReaction === 'watch' ? '#555' : 'var(--border)',
            }}
          >
            👀 見てるだけ
            {watchCount > 0 && <span className="ml-1.5">{watchCount}</span>}
          </button>
        </div>
      )}

      {post.isExpired && (
        <div className="flex gap-4 text-sm pt-1" style={{ color: 'var(--text-muted)' }}>
          {joinCount > 0 && <span>🙌 {joinCount}人</span>}
          {watchCount > 0 && <span>👀 {watchCount}人</span>}
        </div>
      )}
    </div>
  )
}
