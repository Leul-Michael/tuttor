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
  const [members, setMembers] = useState<MembersType[]>([])
  const [selectedChatId, setSelectedChatId] = useState("")
  const [isDrafted, setisDrafted] = useState(false)

  useEffect(() => {
    if (selectedChatId) {
      const unsub = onSnapshot(doc(db, CHATS, selectedChatId), (doc) => {
        if (!doc?.exists()) return
        setisDrafted(doc.data()?.drafted)
        setMembers(doc.data()?.members)
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
      }}
    >
      {children}
    </DMContext.Provider>
  )
}
