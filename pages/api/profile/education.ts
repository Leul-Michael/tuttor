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

    const user = await User.findById(session?.user.id).select("education")

    return res.status(200).json(user.education)
  }

  if (req.method === "POST") {
    const { level, field, school } = req.body

    // Connect to DB
    await connectDB()

    const user = await User.findById(session?.user.id).select("education")

    user.education.unshift({
      level,
      field,
      school,
    })
    await user.save()

    return res.status(201).json(user.education)
  }

  if (req.method === "DELETE") {
    const { eduId } = req.body

    const id = session?.user.id
    // Connect to DB
    await connectDB()

    const user = await User.findById(id).select("education")

    const filterdEducation = user.education.filter((edu: EduProps) => {
      return edu._id.toString() !== eduId
    })
    // user.education.forEach((edu: EduProps, idx: number) => {
    //   if (edu._id.toString() === eduId) {
    //     user.education.splice(idx, 1)
    //   }
    // })

    user.education = filterdEducation
    await user.save()

    return res.status(200).json(user.education)
  }
}

export default handler
