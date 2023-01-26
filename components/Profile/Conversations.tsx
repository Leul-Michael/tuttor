import { useState, Dispatch, SetStateAction } from "react"
import ConversationStyles from "../../styles/Conversation.module.css"
import Chat from "../Chat"
import useConversation from "../../hooks/useConversation"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useRef } from "react"
import { useEffect } from "react"
import Spinner from "../Spinner"

export default function Conversations({
  openModal,
  setOpenModal,
}: {
  openModal: boolean
  setOpenModal: Dispatch<SetStateAction<boolean>>
}) {
  const session = useSession()
  const router = useRouter()
  const conversationRef = useRef<HTMLDivElement>(null)
  const [_, setShowChat] = useState(false)
  const [orderdChats, __, loading] = useConversation()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (conversationRef.current?.contains(e?.target as HTMLElement)) return
      setOpenModal(false)
    }

    document.addEventListener("mousedown", handler)

    return () => {
      document.removeEventListener("mousedown", handler)
    }
  }, [setOpenModal])

  if (!session.data?.user.id) return null

  return (
    <div
      ref={conversationRef}
      className={`${openModal ? ConversationStyles.show : ""} ${
        ConversationStyles["conversation-peek"]
      }`}
    >
      <div className={ConversationStyles["conversation-header"]}>
        <h1 className="font-serif">Conversations</h1>
      </div>
      <div className={ConversationStyles["users-list__users"]}>
        {loading ? (
          <div className={`p-relative ${ConversationStyles["chat-loading"]}`}>
            <Spinner />
          </div>
        ) : orderdChats?.length > 0 ? (
          orderdChats.slice(0, 5).map((chat) => (
            <span
              key={chat?.id}
              onClick={() =>
                router.push(`/users/${session.data.user.id}/conversation`)
              }
            >
              <Chat
                chatId={chat?.id}
                user={{ _id: session.data?.user.id }}
                setShowChat={setShowChat}
              />
            </span>
          ))
        ) : (
          <div className={ConversationStyles["users-list__user"]}>
            <div className={ConversationStyles["msg-preview"]}>
              <span>No Conversation to show</span>
            </div>
          </div>
        )}
        <button
          className={`btn ${ConversationStyles["btn-view-all"]}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setOpenModal(false)
            router.push(`/users/${session.data.user.id}/conversation`)
          }}
        >
          View all
        </button>
      </div>
    </div>
  )
}
