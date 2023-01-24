import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import { useSession } from "next-auth/react"
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  FormEvent,
  Dispatch,
  SetStateAction,
} from "react"
import { RiSendPlaneFill } from "react-icons/ri"
import { TiAttachmentOutline } from "react-icons/ti"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"
import { db } from "../configs/firebase"
import useDm, { MsgType } from "../context/DMContext"
import ConversationStyles from "../styles/Conversation.module.css"
import TextExcerpt from "./TextExcerpt"
import { CHATS } from "../hooks/useCreateConversation"
import useToast from "../context/ToastContext"
import useSendTextMsg from "../hooks/useSendTextMsg"

export default function MobileChatMessages({
  showChat,
  setShowChat,
}: {
  showChat: boolean
  setShowChat: Dispatch<SetStateAction<boolean>>
}) {
  const session = useSession()
  const { selectedChatId } = useDm()
  const [textMsg, setTextMsg] = useState<string>("")
  const [chat, setChat] = useState<DocumentData | undefined>()
  const lastMsgRef = useRef<HTMLSpanElement>(null)
  const { addMessage } = useToast()
  const sendMessage = useSendTextMsg()

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (textMsg === "") return

    setTextMsg("")
    try {
      await sendMessage(textMsg)
      lastMsgRef.current?.scrollIntoView({ behavior: "smooth" })
    } catch (e) {
      addMessage(`Something went wrong, please refresh the page!`)
    }
  }

  useEffect(() => {
    if (selectedChatId) {
      const unsub = onSnapshot(doc(db, CHATS, selectedChatId), (doc) => {
        if (!doc?.exists()) return
        setChat(doc?.data())
      })

      return () => {
        unsub()
      }
    }
  }, [selectedChatId])

  useEffect(() => {
    showChat && lastMsgRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [showChat, chat?.messages])

  const conversationUser = useMemo(
    () => chat?.members.find((u: any) => u["userId"] !== session.data?.user.id),
    [session.data?.user.id, chat?.members]
  )

  return (
    <div
      className={`${ConversationStyles["mobile-chat"]} ${
        showChat ? ConversationStyles.show : ""
      }`}
    >
      <div className={ConversationStyles["user-messages__header"]}>
        <button
          onClick={() => setShowChat(false)}
          className={`${ConversationStyles["back-icon"]}`}
        >
          <MdOutlineKeyboardArrowLeft />
        </button>
        <div className="avatar">{conversationUser?.name.slice(0, 2)}</div>
        <div className={ConversationStyles["msg-preview"]}>
          <p>{conversationUser?.name}</p>
        </div>
      </div>
      <div className={`${ConversationStyles["user-messages__content"]}`}>
        {chat?.messages?.length > 0 ? (
          chat?.messages.map((msg: MsgType, i: number) => {
            if (chat?.messages.length - 1 === i) {
              return <TextExcerpt key={msg?.id} msg={msg} last={true} />
            }
            return <TextExcerpt key={msg?.id} msg={msg} last={false} />
          })
        ) : (
          <div
            className={`${ConversationStyles["user-messages__content"]} ${ConversationStyles["user-messages__no-chat"]}`}
          >
            <p>No messages here yet...</p>
          </div>
        )}
        <span ref={lastMsgRef}></span>
      </div>
      <form
        onSubmit={handleSendMessage}
        className={ConversationStyles["user-messages__input-box"]}
      >
        <input
          value={textMsg}
          onChange={(e) => setTextMsg(e.target.value)}
          type="text"
          placeholder="Write message"
        />
        <TiAttachmentOutline
          className={`${ConversationStyles["attach-icon"]} ${ConversationStyles.icon}`}
        />
        <button
          type="submit"
          className={`${ConversationStyles["send-icon"]} ${ConversationStyles.icon}`}
        >
          <RiSendPlaneFill />
        </button>
      </form>
    </div>
  )
}
