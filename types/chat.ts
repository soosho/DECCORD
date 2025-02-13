export interface User {
  id: string
  username: string
  avatar: string
  isPro: boolean
  level: number
}

export interface Message {
  id: string
  content: string
  timestamp: Date
  isUser: boolean
  channel: string
  user: User
}