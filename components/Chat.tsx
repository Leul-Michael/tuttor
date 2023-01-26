import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { Dispatch, SetStateAction, useEffect, useState, useMemo } from "react"
import { HiOutlineDotsVertical } from "react-icons/hi"
import { db } from "../configs/firebase"
import useDm, { MsgType } from "../context/DMContext"
import { CHATS } from "../hooks/useCreateConversation"
import { IUser } from "../models/User"
import ConversationStyles from "../styles/Conversation.module.css"
import ChatSelect from "./Select/ChatSelect"

export default function Chat({
  chatId,
  user,
  setShowChat,
  inChatPage = false,
}: {
  chatId: string
  user: Pick<IUser, "_id">
  setShowChat: Dispatch<SetStateAction<boolean>>
  inChatPage?: boolean
}) {
  const session = useSession()
  const [chat, setChat] = useState<DocumentData | undefined>()
  const [showSelect, setShowSelect] = useState({ show: false, id: "" })
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

  const conversationUser = useMemo(
    () => chat?.members.find((u: any) => u["userId"] !== user._id),
    [user._id, chat?.members]
  )

  const hasNewMessage = useMemo(
    () =>
      chat?.messages.find((message: MsgType) => {
        if (
          session.data?.user.id !== undefined &&
          !message.seenBy.includes(session.data?.user.id)
        ) {
          return message
        }
      }),
    [chat?.messages, session.data?.user.id]
  )

  if (!chat || !conversationUser) return null

  return (
    <div
      onClick={() => {
        selectedChatId !== chatId && setSelectedChatId(chatId)
        setShowChat((prev) => !prev)
      }}
      className={`${ConversationStyles["users-list__user"]} ${
        chatId === selectedChatId ? ConversationStyles.active : ""
      }`}
    >
      <div className="avatar">{conversationUser?.name.slice(0, 2)}</div>
      <div className={ConversationStyles["msg-preview"]}>
        <p>{conversationUser?.name}</p>
        <span>
          {chat?.lastMsg?.length > 30
            ? chat?.lastMsg?.slice(0, 30) + "..."
            : chat?.lastMsg || ""}
        </span>
        {chat?.drafted && (
          <span className={ConversationStyles.drafted}>draft</span>
        )}
        {hasNewMessage ? (
          <span
            title="new message"
            className={ConversationStyles["new-msg"]}
          ></span>
        ) : null}
      </div>
      {inChatPage && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowSelect({ id: chatId, show: !showSelect.show })
          }}
          className={ConversationStyles["msg__options-btn"]}
        >
          <HiOutlineDotsVertical />
          {showSelect.show && showSelect.id === chatId && (
            <ChatSelect
              setShowSelect={setShowSelect}
              deleteId={showSelect.id}
            />
          )}
        </button>
      )}
    </div>
  )
}
