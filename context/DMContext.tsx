import { doc, getDoc, onSnapshot } from "firebase/firestore"
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
}

type DMContextProps = {
  messages: MsgType[]
  setSelectedChatId: Dispatch<SetStateAction<string>>
  selectedChatId: string
}

const DMContext = createContext({} as DMContextProps)

export default function useDm() {
  return useContext(DMContext)
}

export function DMContextProvider({ children }: { children: ReactElement }) {
  const [messages, setMessages] = useState<MsgType[]>([])
  const [selectedChatId, setSelectedChatId] = useState("")

  useEffect(() => {
    const getMessges = async () => {
      const unsub = onSnapshot(doc(db, CHATS, selectedChatId), (doc) => {
        if (!doc?.data()) return
        setMessages(doc.data()?.messages)
      })

      return () => {
        unsub()
      }
    }

    selectedChatId && getMessges()
  }, [selectedChatId])

  return (
    <DMContext.Provider value={{ messages, setSelectedChatId, selectedChatId }}>
      {children}
    </DMContext.Provider>
  )
}
