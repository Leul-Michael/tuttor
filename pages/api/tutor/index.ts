import type { NextApiRequest, NextApiResponse } from "next"
import User from "../../../models/User"
import connectDB from "../../../middleware/connectDB"
import { ACCOUNT_TYPE } from "../../../types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { pageParam, name, location } = req.query

    let limit = 15
    let queryName = { $regex: name, $options: "i" }
    let queryLocation = { $regex: location, $options: "i" }
    // Connect to DB
    await connectDB()

    const tutors = await User.find({
      role: ACCOUNT_TYPE.TUTTOR,
      name: queryName,
      location: queryLocation,
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(Number(pageParam) > 0 ? limit * (Number(pageParam) - 1) : 0)
      .limit(limit)

    const total = await User.countDocuments({
      role: ACCOUNT_TYPE.TUTTOR,
      name: queryName,
      location: queryLocation,
    }).exec()

    const response = {
      total,
      hasMore: Number(pageParam) * limit < total,
      tutors,
      pageParam,
    }

    return res.status(200).json(response)
  }
}

export default handler
