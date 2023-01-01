import type { NextApiRequest, NextApiResponse } from "next"
import User from "../../models/User"
import connectDB from "../../middleware/connectDB"
import { getSession } from "next-auth/react"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getSession({ req })

    if (!session) {
      return res.status(401).json({ msg: "Unauthorized!" })
    }
    const id = session?.user.id

    // Connect to DB
    await connectDB()

    const user = await User.findById(id).select("-password")

    if (!user) {
      return res.status(400).json({ msg: "User not found!" })
    }

    return res.status(200).json(user)
  }
}
