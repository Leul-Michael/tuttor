import type { NextApiRequest, NextApiResponse } from "next"
import Job from "../../../models/Job"
import connectDB from "../../../middleware/connectDB"
import { getSession } from "next-auth/react"
import { ACCOUNT_TYPE } from "../../../types"
import { IProposal } from "../../../models/Proposal"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session?.user || session?.user.role !== ACCOUNT_TYPE.EMPLOYER) {
    return res.status(401).json({ msg: "Unauthorized!" })
  }

  if (req.method === "GET") {
    // Connect to DB
    await connectDB()

    try {
      const jobs = await Job.find({ user: session.user.id })
        .select("title invites")
        .sort({ createdAt: -1 })

      return res.status(200).json(jobs)
    } catch (e: any) {
      console.log(e.message)
      return res.status(500).json(null)
    }
  }

  if (req.method === "PATCH") {
    const { jobId, userId } = req.body

    if (!jobId || !userId) {
      return res.status(400).json({ msg: "Missing required fields!" })
    }

    // Connect to DB
    await connectDB()

    try {
      const job = await Job.findById(jobId).populate("proposals")

      const isApplied = job?.proposals.some((proposal: IProposal) => {
        return proposal.user.toString() === userId
      })

      if (isApplied) {
        return res
          .status(200)
          .json({ msg: "User has already Applied for this job." })
      }

      //   job.invites = []
      job.invites.unshift(userId)

      await job.save()

      return res.status(200).json({ msg: "User Invited." })
    } catch (e: any) {
      console.log(e.message)
      return res.status(500).json(null)
    }
  }
}

export default handler
