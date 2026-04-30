'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type User = { id: string; name: string; role: string; createdAt: string }
type Invite = { id: string; code: string; createdBy: string; usedByName: string | null; usedAt: string | null }
type Post = {
  id: string; content: string; authorName: string; recipients: string[]
  expiresAt: string; createdAt: string; isExpired: boolean; joinCount: number; watchCount: number
}

type Props = {
  users: User[]
  invites: Invite[]
  posts: Post[]
  adminCode: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function timeLeft(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return '期限切れ'
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  return h > 0 ? `${h}h${m}m` : `${m}m`
}

export default function AdminClient({ users, invites, posts, adminCode }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<'posts' | 'users' | 'invites'>('posts')
  const [label, setLabel] = useState('')
  const [newCode, setNewCode] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [localInvites, setLocalInvites] = useState(invites)
  const [copied, setCopied] = useState<string | null>(null)

  async function createInvite() {
    setCreating(true)
    const res = await fetch('/api/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label }),
    })
    const data = await res.json()
    setCreating(false)
    if (res.ok) {
      setNewCode(data.invite.code)
      setLabel('')
      setLocalInvites((prev) => [...prev, { ...data.invite, usedByName: null, usedAt: null }])
      router.refresh()
    }
  }

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/login')
  }

  function copyCode(code: string) {
    const url = `${window.location.origin}/join/${code}`
    navigator.clipboard.writeText(url)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const tabs = [
    { key: 'posts', label: `投稿 (${posts.length})` },
    { key: 'users', label: `ユーザー (${users.length})` },
    { key: 'invites', label: `招待 (${localInvites.length})` },
  ] as const

  return (
    <div className="flex flex-col gap-6">
      <div
        className="rounded-2xl p-4 flex flex-col gap-2"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>初回ログイン用の管理者コード</p>
        <div className="flex items-center gap-2">
          <code
            className="flex-1 text-sm px-3 py-2 rounded-lg"
            style={{ background: 'var(--surface-2)', color: 'var(--pink)' }}
          >
            {adminCode}
          </code>
          <button
            onClick={() => copyCode(adminCode)}
            className="text-xs px-3 py-2 rounded-lg"
            style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
          >
            {copied === adminCode ? '✓' : 'コピー'}
          </button>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          このコードで管理者としてログインできます
        </p>
      </div>

      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface)' }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: tab === t.key ? 'var(--surface-2)' : 'transparent',
              color: tab === t.key ? 'var(--text)' : 'var(--text-muted)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'posts' && (
        <div className="flex flex-col gap-3">
          {posts.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
              投稿なし
            </p>
          )}
          {posts.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl p-4 flex flex-col gap-2"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                opacity: p.isExpired ? 0.6 : 1,
              }}
            >
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="font-medium">{p.authorName}</span>
                <span style={{ color: p.isExpired ? 'var(--text-muted)' : 'var(--pink)' }}>
                  {timeLeft(p.expiresAt)}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{p.content}</p>
              <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>宛先: {p.recipients.join(', ')}</span>
                {p.joinCount > 0 && <span>🙌 {p.joinCount}</span>}
                {p.watchCount > 0 && <span>👀 {p.watchCount}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="flex flex-col gap-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{u.name}</span>
                {u.role === 'admin' && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--pink)', color: '#000' }}
                  >
                    管理者
                  </span>
                )}
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {formatDate(u.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'invites' && (
        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <p className="text-sm font-medium">新しい招待コードを作る</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="ラベル（任意）"
                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              />
              <button
                onClick={createInvite}
                disabled={creating}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-40"
                style={{ background: 'var(--pink)', color: '#000' }}
              >
                {creating ? '...' : '作成'}
              </button>
            </div>
            {newCode && (
              <div className="flex items-center gap-2">
                <code
                  className="flex-1 text-xs px-3 py-2 rounded-lg break-all"
                  style={{ background: 'var(--surface-2)', color: 'var(--pink)' }}
                >
                  {window.location.origin}/join/{newCode}
                </code>
                <button
                  onClick={() => copyCode(newCode)}
                  className="text-xs px-3 py-2 rounded-lg flex-shrink-0"
                  style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
                >
                  {copied === newCode ? '✓' : 'コピー'}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {localInvites.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl gap-2"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  opacity: inv.usedByName ? 0.6 : 1,
                }}
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <code className="text-xs truncate" style={{ color: inv.usedByName ? 'var(--text-muted)' : 'var(--text)' }}>
                    {inv.code}
                  </code>
                  {inv.usedByName && (
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {inv.usedByName} が使用済み
                    </span>
                  )}
                </div>
                {!inv.usedByName && (
                  <button
                    onClick={() => copyCode(inv.code)}
                    className="text-xs px-3 py-1.5 rounded-lg flex-shrink-0"
                    style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
                  >
                    {copied === inv.code ? '✓' : 'コピー'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={logout}
        className="text-sm text-center py-2"
        style={{ color: 'var(--text-muted)' }}
      >
        ログアウト
      </button>
    </div>
  )
}
