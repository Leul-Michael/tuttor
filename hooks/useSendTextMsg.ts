import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore"
import React from "react"
import axiosInstance from "../axios/axios"
import { db } from "../configs/firebase"
import useDm from "../context/DMContext"
import { CHATS } from "./useCreateConversation"
import { v4 as uuidv4 } from "uuid"
import { useSession } from "next-auth/react"

export default function useSendTextMsg() {
  const session = useSession()
  const { isDrafted, members, selectedChatId } = useDm()
  const sendMessage = async (textMsg: string) => {
    if (isDrafted) {
      await axiosInstance.post("/profile/chat", {
        chatId: selectedChatId,
        recieverId: members.find(
          (member) => member.userId !== session.data?.user.id
        )?.userId,
      })

      await updateDoc(doc(db, CHATS, selectedChatId), {
        messages: arrayUnion({
          id: uuidv4(),
          text: textMsg,
          sentBy: session.data?.user.id,
          date: Timestamp.now(),
        }),
        updatedAt: serverTimestamp(),
        lastMsg: textMsg,
        drafted: false,
      })
    } else {
      await updateDoc(doc(db, CHATS, selectedChatId), {
        messages: arrayUnion({
          id: uuidv4(),
          text: textMsg,
          sentBy: session.data?.user.id,
          date: Timestamp.now(),
        }),
        updatedAt: serverTimestamp(),
        lastMsg: textMsg,
      })
    }
  }

  return sendMessage
}
