import type { NextApiRequest, NextApiResponse } from "next"
import Job from "../../../models/Job"
import connectDB from "../../../middleware/connectDB"
import Proposal from "../../../models/Proposal"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    let limit = 10

    const { title, location, pageParam, categories, price } = req.query

    let jobtype = [(categories as string).split(",") || []].flat()

    let queryTitle = { $regex: title, $options: "i" }
    let queryLocation = { $regex: location, $options: "i" }
    let queryType = { $in: jobtype }
    let queryPrice = { $gte: Number(price) }
    // Connect to DB
    await connectDB()

    const jobs = await Job.find({
      title: queryTitle,
      location: queryLocation,
      tutorType: queryType,
      budgetMin: queryPrice,
    })
      .populate({
        path: "proposals",
        model: Proposal,
      })
      .sort({ createdAt: -1 })
      .skip(Number(pageParam) > 0 ? limit * (Number(pageParam) - 1) : 0)
      .limit(limit)

    const total = await Job.countDocuments({
      title: queryTitle,
      location: queryLocation,
      tutorType: queryType,
      budgetMin: queryPrice,
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
