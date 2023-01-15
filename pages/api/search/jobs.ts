import type { NextApiRequest, NextApiResponse } from "next"
import Job from "../../../models/Job"
import connectDB from "../../../middleware/connectDB"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { title, location, pageParam } = req.query

    let limit = 10

    let queryTitle = { $regex: title, $options: "i" }
    let queryLocation = { $regex: location, $options: "i" }
    // Connect to DB
    await connectDB()

    const jobs = await Job.find({
      title: queryTitle,
      location: queryLocation,
    })
      .sort({ createdAt: -1 })
      .skip(Number(pageParam) > 0 ? limit * (Number(pageParam) - 1) : 0)
      .limit(limit)

    const total = await Job.countDocuments({
      title: queryTitle,
      location: queryLocation,
    }).exec()

    const response = {
      total,
      hasMore: Number(pageParam) * limit < total,
      jobs,
      pageParam,
    }

    return res.status(200).json(response)
  }
}

export default handler
