import type { NextApiRequest, NextApiResponse } from "next"
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

    //

    try {
      const jobs: any = await Job.find().populate("proposals")

      const invitedJobs = jobs
        .filter((job: any) => {
          return job?.invites.includes(session.user.id)
        })
        .sort((a: any, b: any) => b?.createdAt - a?.createdAt)

      return res.status(200).json(invitedJobs)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ msg: "Job not found!" })
    }
  }
}

export default handler
