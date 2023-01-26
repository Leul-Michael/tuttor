import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
} from "@tanstack/react-query"
import { collection, DocumentData, onSnapshot } from "firebase/firestore"
import { Dispatch, SetStateAction } from "react"
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
  const [loading, setLoading] = useState(false)
  const [chats, setChats] = useState<(DocumentData | undefined)[]>([])

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/profile/chat")
      return res.data
    },
  })

  useEffect(() => {
    try {
      setLoading(true)
      const unsubscribe = onSnapshot(collection(db, CHATS), (snapshot) => {
        setChats([])
        snapshot.docs.map((doc) => {
          if (!doc?.data()) return
          if (data?.chats?.includes(doc.id)) {
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

      return () => {
        unsubscribe()
      }
    } finally {
      setLoading(false)
    }
  }, [data?.chats])

  const orderdChats = useMemo(
    () => chats.sort((a, b) => b?.updatedAt - a?.updatedAt),
    [chats]
  )

  return [orderdChats, refetch, loading || isLoading || isRefetching]
}
