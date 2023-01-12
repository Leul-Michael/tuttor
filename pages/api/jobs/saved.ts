import type { NextApiRequest, NextApiResponse } from "next"
import Job from "../../../models/Job"
import connectDB from "../../../middleware/connectDB"
import { getSession } from "next-auth/react"
import { ACCOUNT_TYPE } from "../../../types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session?.user) {
    return res.status(401).json({ msg: "Unauthorized!" })
  }

  if (session?.user.role === ACCOUNT_TYPE.EMPLOYER) {
    return res.status(200).json({ msg: "You have to be tutor!" })
  }

  if (req.method === "GET") {
    // Connect to DB
    await connectDB()

    try {
      const savedJobs: any = await Job.find()
        .where({
          saves: { $in: [session.user.id] },
        })
        .sort({ createdAt: -1 })

      return res.status(200).json(savedJobs)
    } catch (e: any) {
      console.log(e.message)
      return res.status(500).json(null)
    }
  }

  if (req.method === "POST") {
    const { jobId } = req.body

    if (!jobId) {
      return res.status(400).json({ msg: "Job Id is required!" })
    }
    // Connect to DB
    await connectDB()

    try {
      let job: any = await Job.findById(jobId)
      if (job?.saves.includes(session.user.id)) {
        const likeIndex = job?.saves.indexOf(session.user.id)
        job?.saves.splice(likeIndex, 1)
        await job.save()
        return res.status(201).json({ msg: "Job Removed!" })
      } else {
        job?.saves.unshift(session.user.id)
        await job.save()
        return res.status(201).json({ msg: "Job Saved!" })
      }
    } catch (e) {
      console.log(e)

      return res.status(500).json({ msg: "Something went wrong!" })
    }
  }

  if (req.method === "DELETE") {
    const { jobId } = req.body

    if (!jobId) {
      return res.status(400).json({ msg: "Job Id is required!" })
    }
    // Connect to DB
    await connectDB()

    try {
      let job: any = await Job.findById(jobId)
      const likeIndex = job?.saves.indexOf(session.user.id)
      job?.saves.splice(likeIndex, 1)
      await job.save()
      return res.status(201).json({ msg: "Job Removed!" })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ msg: "Something went wrong!" })
    }
  }
}

export default handler
