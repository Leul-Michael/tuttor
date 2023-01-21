import { doc, updateDoc } from "firebase/firestore"
import {
  MouseEventHandler,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react"
import { MdOutlineDelete } from "react-icons/md"
import { db } from "../../configs/firebase"
import useDm from "../../context/DMContext"
import { CHATS } from "../../hooks/useCreateConversation"
import ConversationStyles from "../../styles/Conversation.module.css"

export default function TextSelect({
  deleteId,
  setShowSelect,
}: {
  deleteId: string
  setShowSelect: Dispatch<
    SetStateAction<{
      show: boolean
      id: string
    }>
  >
}) {
  const { messages, selectedChatId } = useDm()
  const selectMsgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (selectMsgRef.current?.contains(e?.target as HTMLElement)) return
      setShowSelect({ id: "", show: false })
    }

    document.addEventListener("mousedown", handler)

    return () => {
      document.removeEventListener("mousedown", handler)
    }
  }, [setShowSelect])

  const deleteText: MouseEventHandler<HTMLSpanElement> = async (e) => {
    e.preventDefault()
    if (!deleteId) return
    await updateDoc(doc(db, CHATS, selectedChatId), {
      messages: messages.filter((msg: any) => msg?.id !== deleteId),
      lastMsg:
        messages[messages.length - 1]?.id === deleteId
          ? messages[messages.length - 2]?.text || ""
          : messages[messages.length - 1]?.text || "",
    })
  }

  return (
    <div ref={selectMsgRef} className={`${ConversationStyles["msg__options"]}`}>
      <span onClick={deleteText}>
        <MdOutlineDelete /> delete
      </span>
    </div>
  )
}
