import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axiosInstance from "../../../axios/axios"

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string
          password: string
        }

        try {
          const res = await axiosInstance.post("/login", {
            email,
            password,
          })

          if (res.data) {
            return res.data
          } else {
            return null
          }
        } catch (e: any) {
          throw new Error(e?.response?.data.msg || "Something went wrong!")
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token = { ...user }
      }
      return token
    },
    session: ({ session, token }) => {
      if (token) {
        session.user = { ...token }
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.ACCESS_TOKEN_SECRET,
}
export default NextAuth(authOptions)
