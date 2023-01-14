import type { NextApiRequest, NextApiResponse } from "next"
import User from "../../../models/User"
import connectDB from "../../../middleware/connectDB"
import { ACCOUNT_TYPE } from "../../../types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { pageParam } = req.query

    let limit = 10
    // Connect to DB
    await connectDB()

    const tutors = await User.find({ role: ACCOUNT_TYPE.TUTTOR })
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(Number(pageParam) > 0 ? limit * (Number(pageParam) - 1) : 0)
      .limit(limit)

    const total = await User.countDocuments({
      role: ACCOUNT_TYPE.TUTTOR,
    }).exec()

    const response = {
      hasMore: Number(pageParam) * limit < total,
      tutors,
      pageParam,
    }

    return res.status(200).json(response)
  }
}

export default handler
