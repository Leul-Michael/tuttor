import type { NextApiRequest, NextApiResponse } from "next"
import Job from "../../../models/Job"
import connectDB from "../../../middleware/connectDB"
import { getSession } from "next-auth/react"
import Proposal from "../../../models/Proposal"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { jobId } = req.query
    // Connect to DB
    await connectDB()

    try {
      const job = await Job.findById(jobId).populate({
        path: "proposals",
        model: Proposal,
      })
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

    let job
    try {
      job = await Job.findById(jobId)

      if (job.user.toString() !== id) {
        return res
          .status(401)
          .json({ msg: "You're not allowed to perform this action." })
      }

      job.proposals.map(
        async (p: string) => await Proposal.findByIdAndRemove(p)
      )

      await job.remove()

      return res.status(200).json({ msg: "Job deleted successfully." })
    } catch (e) {
      if (!job) {
        return res.status(400).json({ msg: "Job not found." })
      } else {
        return res.status(500).json({ msg: "Something went wrong, try again." })
      }
    }
  }
}

export default handler
