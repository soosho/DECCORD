export interface UserSession {
  user: {
    name: string
    email: string
    avatar?: string
  }
  // ...other session properties
}