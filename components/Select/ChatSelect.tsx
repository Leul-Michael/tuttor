import { useRouter } from "next/router"
import {
  MouseEventHandler,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react"
import { MdOutlineDelete } from "react-icons/md"
import axiosInstance from "../../axios/axios"
import useDm from "../../context/DMContext"
import useToast from "../../context/ToastContext"
import useConversation from "../../hooks/useConversation"
import ConversationStyles from "../../styles/Conversation.module.css"

export default function ChatSelect({
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
  const router = useRouter()
  const { addMessage } = useToast()
  const { selectedChatId, setSelectedChatId } = useDm()
  const selectMsgRef = useRef<HTMLDivElement>(null)
  const [_, refetch] = useConversation()

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
    try {
      await axiosInstance.delete("/profile/chat", {
        data: { deleteId },
      })
      refetch()
      if (selectedChatId === deleteId) {
        setSelectedChatId("")
      }
      router.replace(router.asPath)
    } catch (e) {
      addMessage(`Something went wrong, please refresh the page!`)
    }
  }

  return (
    <div ref={selectMsgRef} className={`${ConversationStyles["msg__options"]}`}>
      <span onClick={deleteText}>
        <MdOutlineDelete /> delete
      </span>
    </div>
  )
}
