import type { NextApiRequest, NextApiResponse } from "next"
import User from "../../../models/User"
import bcrypt from "bcryptjs"
import connectDB from "../../../middleware/connectDB"
import { getSession } from "next-auth/react"
import { ACCOUNT_TYPE } from "../../../types"
import Job from "../../../models/Job"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session?.user) {
    return res.status(401).json({ msg: "Unauthorized!" })
  }

  if (req.method === "DELETE") {
    const { currentPassword } = req.body

    if (!currentPassword) {
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
        return res.status(400).json({ msg: "Incorrect password!" })
      }

      if (loggedUser.role === ACCOUNT_TYPE.EMPLOYER) {
        await Job.deleteMany({ user: session.user.id })
      }

      await loggedUser.remove()

      return res.status(200).json({ msg: "Account Closed!" })
    } catch (e) {
      console.log(e)

      return res.status(500).json({ msg: "Something went wrong!" })
    }
  }
}

export default handler
