import type { NextApiRequest, NextApiResponse } from "next"
import User from "../../../models/User"
import connectDB from "../../../middleware/connectDB"
import { ACCOUNT_TYPE } from "../../../types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Connect to DB
    await connectDB()

    const tutors = await User.find({ role: ACCOUNT_TYPE.TUTTOR })
      .select("-password")
      .sort({
        createdAt: -1,
      })

    return res.status(200).json(tutors)
  }
}

export default handler
