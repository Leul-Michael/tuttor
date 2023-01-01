import type { NextApiRequest, NextApiResponse } from "next"
import Job from "../../../../models/Job"
import connectDB from "../../../../middleware/connectDB"
import { getSession } from "next-auth/react"
import { ACCOUNT_TYPE } from "../../../../types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const session = await getSession({ req })

    if (!session?.user) {
      return res.status(401).json({ msg: "Unauthorized!" })
    }

    if (session?.user.role !== ACCOUNT_TYPE.TUTTOR) {
      return res
        .status(400)
        .json({ msg: "You need to be a Tutor to apply for Jobs!" })
    }

    const { jobId, desc } = req.body
    const id = session?.user.id

    // Connect to DB
    await connectDB()

    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(400).json({ msg: "Job not found." })
    }

    const alreadySubmitted = job.proposals.some((job: any) => {
      return job.user.toString() === id
    })

    if (alreadySubmitted) {
      return res.status(400).json({ msg: "Proposal already exists!" })
    } else {
      job.proposals.unshift({
        user: id,
        desc,
      })
      await job.save()
      return res.status(200).json({ msg: "Proposal added successfully!" })
    }
  }
}

export default handler
