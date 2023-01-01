import type { NextApiRequest, NextApiResponse } from "next"
import Job from "../../../models/Job"
import connectDB from "../../../middleware/connectDB"
import { getSession } from "next-auth/react"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { jobId } = req.query
    // Connect to DB
    await connectDB()

    try {
      const job = await Job.findById(jobId)
      return res.status(200).json(job)
    } catch {
      return res.status(500).json({ msg: "Job not found!" })
    }
  }

  if (req.method === "DELETE") {
    const session = await getSession({ req })

    if (!session?.user) {
      return res.status(401).json({ msg: "Unauthorized!" })
    }

    const { jobId } = req.query
    const id = session?.user.id
    // Connect to DB
    await connectDB()

    const job = await Job.findById(jobId).populate("user")

    if (!job) {
      return res.status(400).json({ msg: "Job not found." })
    }

    if (job.user.id !== id) {
      return res
        .status(401)
        .json({ msg: "You're not allowed to perform this action." })
    }

    await job.remove()

    return res.status(200).json({ msg: "Job deleted successfully." })
  }
}

export default handler
