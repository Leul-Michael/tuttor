import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
} from "@tanstack/react-query"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import { useEffect, useMemo, useState } from "react"
import axiosInstance from "../axios/axios"
import { db } from "../configs/firebase"
import { CHATS } from "./useCreateConversation"

export default function useConversation(): [
  (DocumentData | undefined)[],
  <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<any, unknown>>,
  boolean
] {
  const [chats, setChats] = useState<(DocumentData | undefined)[]>([])

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/profile/chat")
      return res.data
    },
  })

  useEffect(() => {
    setChats([])
    data?.chats.map((chat: string) => {
      onSnapshot(doc(db, CHATS, chat), (doc) => {
        if (doc?.exists()) {
          setChats((prev) => {
            if (prev.find((v) => v?.id === doc.id)) {
              return prev
            } else {
              return [...prev, { id: doc.id, ...doc.data() }]
            }
          })
        }
      })
    })
  }, [data?.chats])

  const orderdChats = useMemo(
    () => chats.sort((a, b) => b?.updatedAt - a?.updatedAt),
    [chats]
  )

  return [orderdChats, refetch, isLoading]
}
