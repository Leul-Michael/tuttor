import type { NextApiRequest, NextApiResponse } from "next"
import Job from "../../../models/Job"
import connectDB from "../../../middleware/connectDB"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Connect to DB
    await connectDB()

    const jobs = await Job.find({}).sort({ createdAt: -1 })

    return res.status(200).json(jobs)
  }
}

export default handler
