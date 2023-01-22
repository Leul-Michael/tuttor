import { useState } from "react"
import { HiOutlineDotsVertical } from "react-icons/hi"
import TextSelect from "./Select/TextSelect"
import ConversationStyles from "../styles/Conversation.module.css"
import { Timestamp } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { MsgType } from "../context/DMContext"

export default function TextExcerpt({ msg }: { msg: MsgType }) {
  const session = useSession()
  const [showSelect, setShowSelect] = useState({ show: false, id: "" })

  const date = new Timestamp(msg?.date?.seconds, 0).toDate()

  return (
    <div
      className={`${ConversationStyles["user-messages__msg"]} ${
        msg?.sentBy === session.data?.user.id
          ? ConversationStyles["user-messages__my-msg"]
          : ConversationStyles["user-messages__user-msg"]
      }`}
    >
      <p>{msg?.text}</p>
      <span>{date.toLocaleTimeString()}</span>
      {msg.sentBy === session.data?.user.id ? (
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
    </div>
  )
}
