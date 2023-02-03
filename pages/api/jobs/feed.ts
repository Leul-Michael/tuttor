import type { NextApiRequest, NextApiResponse } from "next"
import Job from "../../../models/Job"
import connectDB from "../../../middleware/connectDB"
import Proposal from "../../../models/Proposal"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { pageParam } = req.query

    let limit = 10
    // Connect to DB
    await connectDB()

    const jobs = await Job.find({})
      .populate({
        path: "proposals",
        model: Proposal,
      })
      .sort({ createdAt: -1 })
      .skip(Number(pageParam) > 0 ? limit * (Number(pageParam) - 1) : 0)
      .limit(limit)

    const total = await Job.countDocuments().exec()

    const response = {
      hasMore: Number(pageParam) * limit < total,
      jobs,
      pageParam,
    }

    return res.status(200).json(response)
  }
}

export default handler
