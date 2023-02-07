import { doc, FieldValue, onSnapshot } from "firebase/firestore"
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
  setSelectedChatId: Dispatch<SetStateAction<string>>
  selectedChatId: string
  isDrafted: boolean
  members: MembersType[]
  updatedAt: FieldValue | null
  createdAt: FieldValue | null
}

const DMContext = createContext({} as DMContextProps)

export default function useDm() {
  return useContext(DMContext)
}

export function DMContextProvider({ children }: { children: ReactElement }) {
  const [members, setMembers] = useState<MembersType[]>([])
  const [selectedChatId, setSelectedChatId] = useState("")
  const [isDrafted, setisDrafted] = useState(false)
  const [updatedAt, setUpdatedAt] = useState<FieldValue | null>(null)
  const [createdAt, setCreatedAt] = useState<FieldValue | null>(null)

  useEffect(() => {
    if (selectedChatId) {
      const unsub = onSnapshot(doc(db, CHATS, selectedChatId), (doc) => {
        if (!doc?.exists()) return
        setisDrafted(doc.data()?.drafted)
        setMembers(doc.data()?.members)
        setUpdatedAt(doc.data()?.updatedAt)
        setCreatedAt(doc.data()?.createdAt)
      })

      return () => {
        unsub()
      }
    }
  }, [selectedChatId])

  return (
    <DMContext.Provider
      value={{
        setSelectedChatId,
        selectedChatId,
        isDrafted,
        members,
        updatedAt,
        createdAt,
      }}
    >
      {children}
    </DMContext.Provider>
  )
}
