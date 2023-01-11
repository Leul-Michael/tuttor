import type { NextApiRequest, NextApiResponse } from "next"
import Job from "../../../../models/Job"
import connectDB from "../../../../middleware/connectDB"
import { getSession } from "next-auth/react"
import { ACCOUNT_TYPE } from "../../../../types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session?.user) {
    return res.status(401).json({ msg: "Unauthorized!" })
  }

  if (session?.user.role !== ACCOUNT_TYPE.TUTTOR) {
    return res
      .status(400)
      .json({ msg: "You need to be a Tutor to apply for Jobs!" })
  }

  if (req.method === "POST") {
    const { jobId, desc, resume } = req.body
    const id = session?.user.id

    if (!resume) {
      return res
        .status(400)
        .json({ msg: "Please attach your resume before applying." })
    }

    // Connect to DB
    await connectDB()

    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(400).json({ msg: "Job not found." })
    }

    const alreadySubmitted = job.proposals.some((proposal: any) => {
      return proposal.user.toString() === id
    })

    if (alreadySubmitted) {
      return res.status(400).json({ msg: "Proposal already exists!" })
    } else {
      job.proposals.unshift({
        user: id,
        desc,
        resume,
      })
      await job.save()
      return res.status(200).json({ msg: "Proposal submitted successfully!" })
    }
  }
}

export default handler
