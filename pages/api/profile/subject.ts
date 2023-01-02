import type { NextApiRequest, NextApiResponse } from "next"
import User from "../../../models/User"
import connectDB from "../../../middleware/connectDB"
import { getSession } from "next-auth/react"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session?.user) {
    return res.status(401).json({ msg: "Unauthorized!" })
  }

  if (req.method === "GET") {
    // Connect to DB
    await connectDB()

    const user = await User.findById(session?.user.id).select("subjects")

    return res.status(200).json(user.subjects)
  }

  if (req.method === "POST") {
    const { subject } = req.body

    // Connect to DB
    await connectDB()

    const user = await User.findById(session?.user.id).select("subjects")
    if (!user.subjects.includes(subject.toLowerCase())) {
      user.subjects.unshift(subject.toLowerCase())
      await user.save()
    }

    return res.status(201).json(user.subjects)
  }

  if (req.method === "DELETE") {
    const { subject } = req.body

    const id = session?.user.id
    // Connect to DB
    await connectDB()

    const user = await User.findById(id).select("subjects")
    if (user.subjects.includes(subject.toLowerCase())) {
      const likeIndex = user.subjects.indexOf(subject.toLowerCase())
      user.subjects.splice(likeIndex, 1)
      await user.save()
    }

    return res.status(200).json(user.subjects)
  }
}

export default handler
