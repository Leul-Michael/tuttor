import type { NextApiRequest, NextApiResponse } from "next"
import User from "../../../models/User"
import bcrypt from "bcryptjs"
import connectDB from "../../../middleware/connectDB"
import { getSession } from "next-auth/react"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session?.user) {
    return res.status(401).json({ msg: "Unauthorized!" })
  }

  if (req.method === "POST") {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: "Please fill all required fields!" })
    }

    // Connect to DB
    await connectDB()

    try {
      const loggedUser = await User.findById(session?.user.id)

      const passwordMatch = await bcrypt.compare(
        currentPassword,
        loggedUser.password
      )

      if (!passwordMatch) {
        return res.status(400).json({ msg: "Incorrect old password!" })
      }

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)

      loggedUser.password = hashedPassword

      await loggedUser.save()

      return res.status(200).json({ msg: "Password changed successfully!" })
    } catch (e) {
      return res.status(500).json({ msg: "Something went wrong!" })
    }
  }
}

export default handler
