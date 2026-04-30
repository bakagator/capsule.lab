import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import type { DB } from './types'

const DB_PATH = path.join(process.cwd(), 'data', 'db.json')
export const ADMIN_INVITE_CODE = 'capsule-admin'

function initDB(): DB {
  return {
    users: [],
    invites: [
      {
        id: crypto.randomUUID(),
        code: ADMIN_INVITE_CODE,
        createdBy: 'system',
      },
    ],
    posts: [],
    reactions: [],
    sessions: [],
  }
}

export function readDB(): DB {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const dir = path.dirname(DB_PATH)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      const db = initDB()
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
      return db
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) as DB
  } catch {
    return initDB()
  }
}

export function writeDB(db: DB): void {
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}
