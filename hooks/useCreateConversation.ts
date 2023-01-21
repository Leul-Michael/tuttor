import { db } from "../configs/firebase"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { IUser } from "../models/User"
import axiosInstance from "../axios/axios"
import { useRouter } from "next/router"

const CONVERSATION = "conversations"
export const CHATS = "chats"

export default function useCreateConversation() {
  const router = useRouter()

  const createConversation = async (
    sender: Pick<IUser, "_id" | "name">,
    receiver: Pick<IUser, "_id" | "name">
  ) => {
    if (sender?._id === receiver?._id) {
      router.push(`/users/${sender._id}/conversation`)
      return null
    }
    const conversationId =
      sender?._id > receiver?._id
        ? sender?._id + receiver?._id
        : receiver?._id + sender?._id

    try {
      const res = await getDoc(doc(db, CHATS, conversationId))

      if (!res?.exists()) {
        //create a chat in conversation collection
        await setDoc(doc(db, CHATS, conversationId), {
          messages: [],
          members: [
            { userId: sender._id, name: sender.name },
            { userId: receiver._id, name: receiver.name },
          ],
          updatedAt: serverTimestamp(),
          lastMsg: "",
        })

        await axiosInstance.post("/profile/chat", {
          chatId: conversationId,
          recieverId: receiver?._id,
        })
      }

      return conversationId
    } catch (e) {
      console.log(e)
      return null
    }
  }

  return { createConversation } as {
    createConversation: (
      sender: Pick<IUser, "_id" | "name">,
      receiver: Pick<IUser, "_id" | "name">
    ) => Promise<string | null>
  }
}
