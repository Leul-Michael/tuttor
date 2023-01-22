import {
  arrayUnion,
  doc,
  DocumentData,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore"
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
import useDm from "../context/DMContext"
import ConversationStyles from "../styles/Conversation.module.css"
import TextExcerpt from "./TextExcerpt"
import { v4 as uuidv4 } from "uuid"
import { CHATS } from "../hooks/useCreateConversation"
import axiosInstance from "../axios/axios"
import useToast from "../context/ToastContext"

export default function MobileChatMessages({
  showChat,
  setShowChat,
}: {
  showChat: boolean
  setShowChat: Dispatch<SetStateAction<boolean>>
}) {
  const session = useSession()
  const { messages, selectedChatId, isDrafted, members } = useDm()
  const [textMsg, setTextMsg] = useState<string>("")
  const [chat, setChat] = useState<DocumentData | undefined>()
  const lastMsgRef = useRef<HTMLSpanElement>(null)
  const { addMessage } = useToast()

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (textMsg === "") return

    setTextMsg("")

    try {
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
      lastMsgRef.current?.scrollIntoView({ behavior: "smooth" })
    } catch (e) {
      addMessage(`Something went wrong, please refresh the page!`)
    }
  }

  useEffect(() => {
    if (selectedChatId) {
      const unsub = onSnapshot(doc(db, CHATS, selectedChatId), (doc) => {
        if (!doc?.data()) return
        setChat(doc?.data())
      })

      return () => {
        unsub()
      }
    }
  }, [selectedChatId])

  useEffect(() => {
    showChat && lastMsgRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [showChat, messages])

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
        {messages?.length > 0 ? (
          messages.map((msg) => <TextExcerpt key={msg?.id} msg={msg} />)
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
        onSubmit={sendMessage}
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
