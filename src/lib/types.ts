export type UserRole = 'admin' | 'user'

export type User = {
  id: string
  name: string
  role: UserRole
  createdAt: string
}

export type Invite = {
  id: string
  code: string
  createdBy: string
  usedBy?: string
  usedAt?: string
}

export type Post = {
  id: string
  authorId: string
  content: string
  recipientIds: string[]
  expiresAt: string
  createdAt: string
}

export type ReactionType = 'join' | 'watch'

export type Reaction = {
  id: string
  postId: string
  userId: string
  type: ReactionType
  createdAt: string
}

export type Session = {
  token: string
  userId: string
  expiresAt: string
}

export type DB = {
  users: User[]
  invites: Invite[]
  posts: Post[]
  reactions: Reaction[]
  sessions: Session[]
}
