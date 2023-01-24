import { useRef, useEffect, useState, FormEvent } from "react"
import useDm, { MsgType } from "../context/DMContext"
import { TiAttachmentOutline } from "react-icons/ti"
import { RiSendPlaneFill } from "react-icons/ri"
import ConversationStyles from "../styles/Conversation.module.css"
import TextExcerpt from "./TextExcerpt"
import useToast from "../context/ToastContext"
import useSendTextMsg from "../hooks/useSendTextMsg"
import { doc, onSnapshot } from "firebase/firestore"
import { CHATS } from "../hooks/useCreateConversation"
import { db } from "../configs/firebase"

export default function ChatMessages() {
  const { selectedChatId } = useDm()
  const [textMsg, setTextMsg] = useState<string>("")
  const [messages, setMessages] = useState<MsgType[]>([])
  const lastMsgRef = useRef<HTMLSpanElement>(null)
  const { addMessage } = useToast()
  const sendMessage = useSendTextMsg()

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (textMsg === "") return

    setTextMsg("")
    try {
      await sendMessage(textMsg)
    } catch (e) {
      addMessage(`Something went wrong, please refresh the page!`)
    }
  }

  useEffect(() => {
    if (selectedChatId) {
      const unsub = onSnapshot(doc(db, CHATS, selectedChatId), (doc) => {
        if (doc?.exists()) {
          setMessages(doc.data()?.messages)
        }
      })
      return () => {
        unsub()
      }
    }
  }, [selectedChatId])

  useEffect(() => {
    lastMsgRef.current?.scrollIntoView()
  }, [messages])

  return (
    <>
      {selectedChatId ? (
        <>
          <div className={ConversationStyles["user-messages__content"]}>
            {messages?.length > 0 ? (
              messages.map((msg, i: number) => {
                if (messages.length - 1 === i) {
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
