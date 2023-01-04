import type { NextApiRequest, NextApiResponse } from "next"
import User from "../../../models/User"
import connectDB from "../../../middleware/connectDB"
import { getSession } from "next-auth/react"
import { EduProps } from "../../../components/Profile/Education"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session?.user) {
    return res.status(401).json({ msg: "Unauthorized!" })
  }

  if (req.method === "GET") {
    // Connect to DB
    await connectDB()

    const user = await User.findById(session?.user.id).select("resume")

    return res.status(200).json(user.resume)
  }

  if (req.method === "POST") {
    const { resume } = req.body

    // Connect to DB
    await connectDB()

    try {
      const user = await User.findById(session?.user.id).select("resume")

      user.resume = resume

      await user.save()

      return res.status(201).json({ msg: "Resume updated successfully!" })
    } catch {
      return res.status(500).json({ msg: "Something went wrong!" })
    }
  }

  if (req.method === "DELETE") {
    const id = session?.user.id
    // Connect to DB
    await connectDB()

    try {
      const user = await User.findById(id).select("resume")

      user.resume = ""

      await user.save()

      return res.status(201).json({ msg: "Resume updated successfully!" })
    } catch {
      return res.status(500).json({ msg: "Something went wrong!" })
    }
  }
}

export default handler
