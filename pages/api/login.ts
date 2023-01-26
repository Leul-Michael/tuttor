import type { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcryptjs"
import User from "../../models/User"
import jwt from "jsonwebtoken"
import cookie from "cookie"
import connectDB from "../../middleware/connectDB"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Connect to DB
    await connectDB()

    const { email, password } = req.body

    const user = await User.findOne({
      email: email.toLowerCase(),
    })

    if (!user) {
      return res.status(400).json({ msg: "Invalid email!" })
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.status(201).json({
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
      })
    } else {
      return res.status(400).json({ msg: "Invalid Password!" })
    }
  }
}
