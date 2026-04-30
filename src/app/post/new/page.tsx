'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type User = { id: string; name: string }

export default function NewPostPage() {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/users')
      .then((r) => {
        if (r.status === 401) { router.push('/login'); return null }
        return r.json()
      })
      .then((data) => {
        if (data) setUsers(data.users)
      })
  }, [router])

  function toggleUser(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function selectAll() {
    setSelected(users.map((u) => u.id))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || selected.length === 0) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, recipientIds: selected }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'エラーが発生しました')
      setLoading(false)
      return
    }

    router.push('/feed')
  }

  return (
    <div className="min-h-screen">
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
      >
        <Link href="/feed" className="text-sm" style={{ color: 'var(--text-muted)' }}>
          ← 戻る
        </Link>
        <h1 className="text-base font-semibold">やりたいことを投稿</h1>
        <div className="w-12" />
      </header>

      <main className="max-w-sm mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="何やりたい？&#10;例：文化祭でカフェやりたい！みんな来て"
              rows={5}
              maxLength={280}
              className="w-full px-4 py-3 rounded-xl text-sm leading-relaxed resize-none outline-none"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
            <p className="text-right text-xs" style={{ color: 'var(--text-muted)' }}>
              {content.length}/280
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">誰に見せる？</p>
              {users.length > 0 && (
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-xs"
                  style={{ color: 'var(--pink)' }}
                >
                  全員選ぶ
                </button>
              )}
            </div>

            {users.length === 0 && (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                読み込み中...
              </p>
            )}

            <div className="flex flex-col gap-2">
              {users.map((u) => (
                <label
                  key={u.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: selected.includes(u.id) ? 'var(--surface-2)' : 'var(--surface)',
                    border: `1px solid ${selected.includes(u.id) ? 'var(--pink)' : 'var(--border)'}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(u.id)}
                    onChange={() => toggleUser(u.id)}
                    className="hidden"
                  />
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center text-xs flex-shrink-0"
                    style={{
                      background: selected.includes(u.id) ? 'var(--pink)' : 'var(--surface-2)',
                      border: `1px solid ${selected.includes(u.id) ? 'var(--pink)' : 'var(--border)'}`,
                    }}
                  >
                    {selected.includes(u.id) && '✓'}
                  </span>
                  <span className="text-sm">{u.name}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-center" style={{ color: 'var(--pink)' }}>
              {error}
            </p>
          )}

          <div
            className="py-3 rounded-xl text-xs text-center"
            style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}
          >
            ⏱ 投稿は24時間後に消えます
          </div>

          <button
            type="submit"
            disabled={loading || !content.trim() || selected.length === 0}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40"
            style={{ background: 'var(--pink)', color: '#000' }}
          >
            {loading ? '投稿中...' : '投稿する'}
          </button>
        </form>
      </main>
    </div>
  )
}
