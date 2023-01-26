import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    chats: string[]
  }
}

import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      chats: string[]
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name: string
    role: string
    chats: string[]
  }
}
