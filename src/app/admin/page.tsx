import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { readDB, ADMIN_INVITE_CODE } from '@/lib/db'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin') redirect('/feed')

  const db = readDB()

  const users = db.users.map(({ id, name, role, createdAt }) => ({
    id, name, role, createdAt,
  }))

  const invites = db.invites.map((i) => {
    const usedByUser = i.usedBy ? db.users.find((u) => u.id === i.usedBy) : null
    return {
      id: i.id,
      code: i.code,
      createdBy: i.createdBy,
      usedByName: usedByUser?.name ?? null,
      usedAt: i.usedAt ?? null,
    }
  })

  const now = new Date()
  const posts = db.posts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((p) => {
      const author = db.users.find((u) => u.id === p.authorId)
      const recipients = p.recipientIds
        .map((id) => db.users.find((u) => u.id === id)?.name)
        .filter(Boolean)
      const joinCount = db.reactions.filter((r) => r.postId === p.id && r.type === 'join').length
      const watchCount = db.reactions.filter((r) => r.postId === p.id && r.type === 'watch').length
      return {
        id: p.id,
        content: p.content,
        authorName: author?.name ?? '不明',
        recipients: recipients as string[],
        expiresAt: p.expiresAt,
        createdAt: p.createdAt,
        isExpired: new Date(p.expiresAt) <= now,
        joinCount,
        watchCount,
      }
    })

  return (
    <div className="min-h-screen">
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
      >
        <Link href="/feed" className="text-sm" style={{ color: 'var(--text-muted)' }}>
          ← フィード
        </Link>
        <h1 className="text-base font-semibold">管理</h1>
        <div className="w-12" />
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <AdminClient
          users={users}
          invites={invites}
          posts={posts}
          adminCode={ADMIN_INVITE_CODE}
        />
      </main>
    </div>
  )
}
