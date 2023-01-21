import { useRef, useEffect, useState, FormEvent } from "react"
import useDm from "../context/DMContext"
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore"
import { db } from "../configs/firebase"
import { CHATS } from "../hooks/useCreateConversation"
import { useSession } from "next-auth/react"
import { v4 as uuidv4 } from "uuid"
import { TiAttachmentOutline } from "react-icons/ti"
import { RiSendPlaneFill } from "react-icons/ri"
import ConversationStyles from "../styles/Conversation.module.css"
import TextExcerpt from "./TextExcerpt"

export default function ChatMessages() {
  const session = useSession()
  const { messages, selectedChatId } = useDm()
  const [textMsg, setTextMsg] = useState<string>("")
  const lastMsgRef = useRef<HTMLSpanElement>(null)

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (textMsg === "") return

    setTextMsg("")
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

  useEffect(() => {
    lastMsgRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <>
      {selectedChatId ? (
        <>
          <div className={ConversationStyles["user-messages__content"]}>
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
        </>
      ) : (
        <div
          className={`${ConversationStyles["user-messages__content"]} ${ConversationStyles["user-messages__no-chat"]}`}
        >
          <p>Select a conversation to start messaging</p>
        </div>
      )}
    </>
  )
}
