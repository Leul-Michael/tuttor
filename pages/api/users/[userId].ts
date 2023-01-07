import type { NextApiRequest, NextApiResponse } from "next"
import connectDB from "../../../middleware/connectDB"
import User from "../../../models/User"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { userId } = req.query
    // Connect to DB
    await connectDB()

    try {
      const user = await User.findById(userId)
      return res.status(200).json(user)
    } catch {
      return res.status(500).json({ msg: "User not found!" })
    }
  }
}

export default handler
