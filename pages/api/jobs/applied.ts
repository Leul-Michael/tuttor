import type { NextApiRequest, NextApiResponse } from "next"
import Job from "../../../models/Job"
import connectDB from "../../../middleware/connectDB"
import { getSession } from "next-auth/react"
import Proposal from "../../../models/Proposal"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session?.user) {
    return res.status(401).json({ msg: "Unauthorized!" })
  }

  if (req.method === "GET") {
    // Connect to DB
    await connectDB()

    //

    try {
      const jobs: any = await Job.find().populate("proposals")

      const proposedJobs = jobs.filter((job: any) => {
        const isApplied = job?.proposals.some((proposal: any) => {
          return proposal.user.toString() === session.user.id
        })

        if (isApplied) {
          return job
        }
      })
      return res
        .status(200)
        .json(
          proposedJobs.sort((a: any, b: any) => b?.createdAt - a?.createdAt)
        )
    } catch (e) {
      console.log(e)
      return res.status(500).json({ msg: "Job not found!" })
    }
  }

  if (req.method === "DELETE") {
    const { jobId } = req.body

    // Connect to DB
    await connectDB()
    try {
      const job: any = await Job.findById(jobId).populate("proposals")

      const userProposal = job?.proposals.find((proposal: any) => {
        return proposal.user.toString() === session.user.id
      })

      await Proposal.findByIdAndRemove(userProposal._id)

      const newProposals = job?.proposals.filter((proposal: any) => {
        return proposal.user.toString() !== session.user.id
      })

      job.proposals = newProposals

      await job.save()

      return res.status(200).json({ msg: "Proposal withdrawn!" })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ msg: "Faild to withdraw proposal!" })
    }
  }
}

export default handler
