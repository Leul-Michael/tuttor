import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axiosInstance from "../../../axios/axios"

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      type: "credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
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
        token.id = user.id
        token.name = user.name
        token.role = user.role
        token.email = user.email
      }

      return token
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.role = token.role
        session.user.email = token.email
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
