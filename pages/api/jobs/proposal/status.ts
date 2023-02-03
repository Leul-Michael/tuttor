import type { NextApiRequest, NextApiResponse } from "next"
import Job from "../../../../models/Job"
import connectDB from "../../../../middleware/connectDB"
import { getSession } from "next-auth/react"
import { ACCOUNT_TYPE } from "../../../../types"
import Proposal from "../../../../models/Proposal"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session?.user) {
    return res.status(401).json({ msg: "Unauthorized!" })
  }

  if (session?.user.role !== ACCOUNT_TYPE.EMPLOYER) {
    return res
      .status(400)
      .json({ msg: "You need to be a Employee to Update job status!" })
  }

  if (req.method === "POST") {
    const { status, jobId, proposalId } = req.body
    const id = session?.user.id

    // Connect to DB
    await connectDB()

    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(400).json({ msg: "Job not found." })
    }

    if (job.user.toString() !== id) {
      return res.status(401).json({ msg: "Not authorised." })
    }

    try {
      const jobPropsal = await Proposal.findById(proposalId)
      jobPropsal.status = status
      await jobPropsal.save()

      return res.status(201).json({ msg: "Status updated!" })
    } catch (e: any) {
      console.log(e.message)

      return res.status(500).json({ msg: "Something went wrong!" })
    }
  }
}

export default handler
