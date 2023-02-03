import type { NextApiRequest, NextApiResponse } from "next"
import connectDB from "../../../../middleware/connectDB"
import { getSession } from "next-auth/react"
import Proposal from "../../../../models/Proposal"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session?.user) {
    return res.status(401).json({ msg: "Unauthorized!" })
  }

  if (req.method === "GET") {
    const { proposalId } = req.query

    if (!proposalId) {
      return res.status(400).json({ msg: "Proposal id is required!" })
    }

    // Connect to DB
    await connectDB()

    try {
      const proposal = await Proposal.findById(proposalId)
        .populate({
          path: "user",
          select: "name location",
        })
        .sort({ createdAt: -1 })

      return res.status(200).json(proposal)
    } catch {
      return res.status(500).json({ msg: "Something went wrong!" })
    }
  }
}

export default handler
