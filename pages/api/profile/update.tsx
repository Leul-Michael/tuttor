import type { NextApiRequest, NextApiResponse } from "next"
import User from "../../../models/User"
import connectDB from "../../../middleware/connectDB"
import { getSession } from "next-auth/react"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session?.user) {
    return res.status(401).json({ msg: "Unauthorized!" })
  }

  if (req.method === "POST") {
    // Connect to DB
    await connectDB()

    const emailExists = await User.findOne({ email: req.body?.email })

    if (emailExists.id.toString() !== session.user.id) {
      return res.status(400).json({ msg: "Update failed, Email exists" })
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: req.body },
      { new: true }
    )

    return res.status(201).json({ msg: "Profile updated successfully" })
  }
}

export default handler
