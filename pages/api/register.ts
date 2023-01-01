import type { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcryptjs"
import User from "../../models/User"
import connectDB from "../../middleware/connectDB"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Connect to DB
  await connectDB()

  if (req.method === "POST") {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please input all fields." })
    }

    const userExists = await User.findOne({
      email: email.toLowerCase(),
    })

    if (userExists) {
      return res.status(400).json({ msg: "Email already exists." })
    }

    try {
      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role,
      })

      return res
        .status(201)
        .json({ name: user.name, email: user.email, role: user.role })
    } catch (e) {
      console.log(e)

      return res.status(500).json({ msg: "Oops Something went wrong." })
    }
  }
}

export default handler
