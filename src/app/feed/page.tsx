import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { readDB } from '@/lib/db'
import PostCard from '@/components/PostCard'
import type { ReactionType } from '@/lib/types'

export default async function FeedPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const db = readDB()
  const now = new Date()

  const rawPosts = db.posts
    .filter((p) => {
      if (user.role === 'admin') return true
      return p.recipientIds.includes(user.id) || p.authorId === user.id
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const posts = rawPosts.map((p) => {
    const author = db.users.find((u) => u.id === p.authorId)
    const reactions = db.reactions
      .filter((r) => r.postId === p.id)
      .map((r) => ({ userId: r.userId, type: r.type as ReactionType }))
    const myReaction =
      (db.reactions.find((r) => r.postId === p.id && r.userId === user.id)?.type as ReactionType) ?? null
    return {
      ...p,
      author: author ? { name: author.name } : undefined,
      reactions,
      myReaction,
      isExpired: new Date(p.expiresAt) <= now,
    }
  })

  const active = posts.filter((p) => !p.isExpired)
  const expired = posts.filter((p) => p.isExpired)

  return (
    <div className="min-h-screen">
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
      >
        <h1 className="text-lg font-bold tracking-tight">capsule</h1>
        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <Link
              href="/admin"
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
            >
              管理
            </Link>
          )}
          <Link
            href="/post/new"
            className="text-sm px-4 py-1.5 rounded-xl font-semibold"
            style={{ background: 'var(--pink)', color: '#000' }}
          >
            ＋ 投稿
          </Link>
        </div>
      </header>

      <main className="max-w-sm mx-auto px-4 py-6 flex flex-col gap-4">
        {active.length === 0 && expired.length === 0 && (
          <div className="text-center py-16 flex flex-col gap-3">
            <p className="text-4xl">✦</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              まだ投稿がありません
            </p>
            <Link
              href="/post/new"
              className="mt-2 text-sm font-medium"
              style={{ color: 'var(--pink)' }}
            >
              最初の投稿をしてみよう
            </Link>
          </div>
        )}

        {active.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={user.id}
            isAdmin={user.role === 'admin'}
          />
        ))}

        {expired.length > 0 && (
          <>
            <p className="text-xs pt-2" style={{ color: 'var(--text-muted)' }}>
              期限切れ
            </p>
            {expired.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user.id}
                isAdmin={user.role === 'admin'}
              />
            ))}
          </>
        )}
      </main>
    </div>
  )
}
