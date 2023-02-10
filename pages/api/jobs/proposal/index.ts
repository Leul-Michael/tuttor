import type { NextApiRequest, NextApiResponse } from "next"
import connectDB from "../../../../middleware/connectDB"
import { getSession } from "next-auth/react"
import Proposal from "../../../../models/Proposal"
import User from "../../../../models/User"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session?.user) {
    return res.status(401).json({ msg: "Unauthorized!" })
  }

  if (req.method === "GET") {
    const { proposalIds } = req.query

    if (!proposalIds?.length) {
      return res.status(200).json([])
    }

    let jobproposals = [(proposalIds as string).split(",") || []].flat()

    // Connect to DB
    await connectDB()

    try {
      const proposals = await Proposal.find({ _id: { $in: jobproposals } })
        .populate({
          path: "user",
          model: User,
          select: "name location",
        })
        .sort({ createdAt: -1 })

      return res.status(200).json(proposals)
    } catch (e: any) {
      console.log(e.message)
      return res.status(500).json({ msg: "Something went wrong!" })
    }
  }
}

export default handler
