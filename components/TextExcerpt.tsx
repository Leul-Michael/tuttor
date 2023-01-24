import { useSession } from "next-auth/react"
import { useCallback, useRef, useState } from "react"
import { HiOutlineDotsVertical } from "react-icons/hi"
import TextSelect from "./Select/TextSelect"
import ConversationStyles from "../styles/Conversation.module.css"
import { Timestamp, doc, updateDoc, getDoc } from "firebase/firestore"
import useDm, { MsgType } from "../context/DMContext"
import { db } from "../configs/firebase"
import { CHATS } from "../hooks/useCreateConversation"
import { format } from "date-fns"

export default function TextExcerpt({ msg }: { msg: MsgType }) {
  const session = useSession()
  const userId = session.data?.user.id
  const intObserver = useRef<IntersectionObserver | null>(null)
  const { selectedChatId } = useDm()
  const [showSelect, setShowSelect] = useState({ show: false, id: "" })

  const date = new Timestamp(msg?.date?.seconds, 0).toDate()
  const sentTime = format(date, "hh:mm")
  const sentDate = format(date, "dd-MM-yyyy")

  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (
        userId === undefined ||
        msg.seenBy.includes(userId) ||
        msg.sentBy === userId
      )
        return
      if (intObserver.current) intObserver.current.disconnect()

      intObserver.current = new IntersectionObserver(async (elems) => {
        if (elems[0].isIntersecting) {
          try {
            const textRef = doc(db, CHATS, selectedChatId)
            const docSnap = await getDoc(textRef)

            if (docSnap.exists()) {
              if (!docSnap.data().messages) return
              const currentMsg = docSnap
                .data()
                .messages.find((message: MsgType) => message.id === msg.id)
              if (!currentMsg) return
              currentMsg.seenBy.unshift(userId)
              const updtedMsgs = docSnap
                .data()
                .messages.map((message: MsgType) => {
                  if (message.id === currentMsg.id) {
                    return currentMsg
                  } else {
                    return message
                  }
                })
              await updateDoc(textRef, { messages: updtedMsgs })
            } else {
              return
            }
          } catch (e) {
            console.log(e)
          }
        }
      })

      if (node) intObserver.current?.observe(node)
    },
    [userId, msg.seenBy, msg.sentBy, msg.id, selectedChatId]
  )

  return (
    <div
      ref={lastPostRef}
      className={`${ConversationStyles["user-messages__msg"]} ${
        msg?.sentBy === userId
          ? ConversationStyles["user-messages__my-msg"]
          : ConversationStyles["user-messages__user-msg"]
      }`}
    >
      <p>{msg?.text}</p>
      {/* <span>{date.toLocaleTimeString()}</span> */}
      <span>{sentTime}</span>
      {/* <span>
        {hour}:{second}
      </span> */}
      {msg.sentBy === userId ? (
        <button
          onClick={(e) =>
            setShowSelect({ id: msg?.id, show: !showSelect.show })
          }
          className={ConversationStyles["msg__options-btn"]}
        >
          <HiOutlineDotsVertical />
          {showSelect.show && showSelect.id === msg?.id && (
            <TextSelect
              setShowSelect={setShowSelect}
              deleteId={showSelect.id}
            />
          )}
        </button>
      ) : null}
      <span className={ConversationStyles["sent-date"]}>{sentDate}</span>
    </div>
  )
}
