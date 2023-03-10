import type { NextApiRequest, NextApiResponse } from "next"
import User, { IUser } from "../../../models/User"
import connectDB from "../../../middleware/connectDB"
import { getSession } from "next-auth/react"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session?.user) {
    return res.status(401).json({ msg: "Unauthorized!" })
  }

  if (req.method === "GET") {
    const id = session?.user.id

    // Connect to DB
    await connectDB()

    const user = await User.findById(id).select("chats")

    if (!user) {
      return res.status(400).json({ msg: "User not found!" })
    }

    return res.status(200).json(user)
  }

  if (req.method === "POST") {
    const { chatId, recieverId }: { chatId: string; recieverId: string } =
      req.body

    if (!chatId) {
      return res.status(400).json({ msg: "Chat not found!" })
    }

    // Connect to DB
    await connectDB()

    try {
      const currentUser = await User.findById(session.user.id)
      const receiver = await User.findById(recieverId)

      if (!currentUser?.chats?.includes(chatId)) {
        currentUser?.chats?.unshift(chatId)
        await currentUser?.save()
      }

      if (recieverId && !receiver?.chats?.includes(chatId)) {
        receiver?.chats?.unshift(chatId)
        await receiver?.save()
      }

      return res.status(200).json({ msg: "Chat created!" })
    } catch (e: any) {
      console.log(e.message)
      return res.status(500).json({ msg: "Something went wrong!" })
    }
  }

  if (req.method === "DELETE") {
    const { deleteId }: { deleteId: string } = req.body

    if (!deleteId) {
      return res.status(400).json({ msg: "Chat id is required!" })
    }

    // Connect to DB
    await connectDB()

    try {
      const currentUser = await User.findById(session.user.id)
      if (currentUser?.chats?.includes(deleteId)) {
        const likeIndex = currentUser?.chats?.indexOf(deleteId)
        currentUser?.chats?.splice(likeIndex, 1)
        await currentUser?.save()
        return res.status(200).json({ msg: "Chat removed!" })
      } else {
        return res.status(400).json({ msg: "Chat not found!" })
      }
    } catch (e: any) {
      console.log(e.message)
      return res.status(500).json({ msg: "Something went wrong!" })
    }
  }
}

export default handler
