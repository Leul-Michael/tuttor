import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { db } from "../configs/firebase"
import useDm from "../context/DMContext"
import { CHATS } from "../hooks/useCreateConversation"
import { IUser } from "../models/User"
import ConversationStyles from "../styles/Conversation.module.css"

export default function Chat({
  chatId,
  user,
  setShowChat,
}: {
  chatId: string
  user: Pick<IUser, "_id">
  setShowChat: Dispatch<SetStateAction<boolean>>
}) {
  const [chat, setChat] = useState<DocumentData | undefined>()
  const { setSelectedChatId, selectedChatId } = useDm()

  useEffect(() => {
    const unsub = onSnapshot(doc(db, CHATS, chatId), (doc) => {
      if (!doc?.data()) return
      setChat(doc?.data())
    })

    return () => {
      unsub()
    }
  }, [chatId, setChat])

  if (!chat) return null

  const conversationUser = chat?.members.find(
    (u: any) => u["userId"] !== user._id
  )

  if (!conversationUser) return null

  return (
    <div
      onClick={() => {
        setSelectedChatId(chatId)
        setShowChat((prev) => !prev)
      }}
      className={`${ConversationStyles["users-list__user"]} ${
        chatId === selectedChatId ? ConversationStyles.active : ""
      }`}
    >
      <div className="avatar">{conversationUser?.name.slice(0, 2)}</div>
      <div className={ConversationStyles["msg-preview"]}>
        <p>{conversationUser?.name}</p>
        <span>{chat?.lastMsg || ""}</span>
      </div>
    </div>
  )
}
