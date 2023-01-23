import { doc, onSnapshot } from "firebase/firestore"
import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react"
import { db } from "../configs/firebase"
import { CHATS } from "../hooks/useCreateConversation"

export type MsgType = {
  sentBy: string
  text: string
  date: { seconds: number; nanoseconds: number }
  id: string
  seenBy: string[]
}

export type MembersType = { userId: string; name: string }

type DMContextProps = {
  messages: MsgType[]
  setSelectedChatId: Dispatch<SetStateAction<string>>
  selectedChatId: string
  isDrafted: boolean
  members: MembersType[]
}

const DMContext = createContext({} as DMContextProps)

export default function useDm() {
  return useContext(DMContext)
}

export function DMContextProvider({ children }: { children: ReactElement }) {
  const [messages, setMessages] = useState<MsgType[]>([])
  const [members, setMembers] = useState<MembersType[]>([])
  const [selectedChatId, setSelectedChatId] = useState("")
  const [isDrafted, setisDrafted] = useState(false)

  useEffect(() => {
    const getMessges = async () => {
      const unsub = onSnapshot(doc(db, CHATS, selectedChatId), (doc) => {
        if (!doc?.data()) return
        setisDrafted(doc.data()?.drafted)
        setMembers(doc.data()?.members)
        setMessages(doc.data()?.messages)
      })

      return () => {
        unsub()
      }
    }

    selectedChatId && getMessges()
  }, [selectedChatId])

  return (
    <DMContext.Provider
      value={{
        messages,
        setSelectedChatId,
        selectedChatId,
        isDrafted,
        members,
      }}
    >
      {children}
    </DMContext.Provider>
  )
}
