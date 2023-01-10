import type { NextApiRequest, NextApiResponse } from "next"
import User from "../../../models/User"
import Job from "../../../models/Job"
import connectDB from "../../../middleware/connectDB"
import { getSession } from "next-auth/react"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session?.user) {
    return res.status(401).json({ msg: "Unauthorized!" })
  }

  if (req.method === "GET") {
    // Connect to DB
    await connectDB()

    try {
      const jobs = await Job.find({ user: session.user.id })
        .sort({
          createdAt: -1,
        })
        .populate({ path: "proposals.user", model: User, select: "name" })

      return res.status(200).json(jobs)
    } catch (e: any) {
      console.log(e.message)
      return res.status(500).json(null)
    }
  }

  if (req.method === "POST") {
    const { schedule, title, budget } = req.body

    if (!schedule || !title || !budget) {
      return res.status(400).json({ msg: "Please, add all fields!" })
    }
    // Connect to DB
    await connectDB()

    try {
      const job = await new Job({ ...req.body, user: session.user.id })
      await job.save()
      return res
        .status(201)
        .json({ id: job.id, msg: "Job created successfully!" })
    } catch (e) {
      console.log(e)

      return res
        .status(500)
        .json({ msg: "Error creating job, Something went wrong." })
    }
  }
}

export default handler
