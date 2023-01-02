import type { NextApiRequest, NextApiResponse } from "next"
import Job from "../../../models/Job"
import connectDB from "../../../middleware/connectDB"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { title, location } = req.query

    let queryTitle = { $regex: title, $options: "i" }
    let queryLocation = { $regex: location, $options: "i" }
    // Connect to DB
    await connectDB()

    const jobs = await Job.find({
      title: queryTitle,
      location: queryLocation,
    }).sort({ createdAt: -1 })

    return res.status(200).json(jobs)
  }
}

export default handler
