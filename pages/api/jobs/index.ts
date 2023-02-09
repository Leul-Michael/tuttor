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

  if (req.method === "GET") {
    const { pageParam } = req.query

    let limit = 5
    // Connect to DB
    await connectDB()

    try {
      const jobs = await Job.find({ user: session.user.id })
        .sort({ createdAt: -1 })
        .skip(Number(pageParam) > 0 ? limit * (Number(pageParam) - 1) : 0)
        .limit(limit)

      const total = await Job.countDocuments({ user: session.user.id }).exec()

      const response = {
        hasMore: Number(pageParam) * limit < total,
        jobs,
        pageParam,
      }

      return res.status(200).json(response)
    } catch (e: any) {
      console.log(e.message)
      return res.status(500).json(null)
    }
  }

  if (req.method === "POST") {
    const { schedule, title, budgetMin } = req.body

    if (session?.user.role !== ACCOUNT_TYPE.EMPLOYER) {
      return res
        .status(401)
        .json({ msg: "You need to be Employer to create Jobs!" })
    }

    if (!schedule || !title || !budgetMin) {
      return res.status(400).json({ msg: "Please, add all fields!" })
    }

    if (budgetMin < 50) {
      return res
        .status(400)
        .json({ msg: "Budget must be greater or equal to 50 birr!" })
    }
    // Connect to DB
    await connectDB()

    try {
      const userJobs = await Job.find({
        user: session.user.id,
        status: "Active",
      })

      if (userJobs.length >= 5) {
        return res.status(400).json({
          msg: "You have maximum active jobs, please close one before creating new!",
        })
      }

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

  if (req.method === "PATCH") {
    const { status, jobId } = req.body

    if (!status || !jobId) {
      return res.status(400).json({ msg: "Required fields are missing!" })
    }

    // Connect to DB
    await connectDB()

    try {
      const userJobs = await Job.find({
        user: session.user.id,
        status: "Active",
      })

      if (status === "Active" && userJobs.length >= 5) {
        return res.status(400).json({
          msg: "You have reached maximum active jobs allowed per user, please close one before updating!",
        })
      }

      const job = await Job.findById(jobId)

      if (!job) {
        return res.status(400).json({ msg: "Job not found!" })
      }

      if (job.user.toString() !== session.user.id) {
        return res.status(401).json({ msg: "Unauthorized!" })
      }

      job.status = status
      await job.save()

      return res.status(200).json({ msg: "Job status updated!" })
    } catch (e) {
      console.log(e)

      return res
        .status(500)
        .json({ msg: "Error creating job, Something went wrong." })
    }
  }
}

export default handler
