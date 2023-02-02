import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
} from "@tanstack/react-query"
import {
  collection,
  doc,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore"
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

  const orderdChats = useMemo(() => {
    return chats.sort((a, b) => b?.updatedAt - a?.updatedAt)
  }, [chats])

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
    // const convRef = collection(db, CHATS)
    // const q = query(convRef, orderBy("updatedAt"))
    // const unsub = onSnapshot(q, (snapshot) => {
    //   if (snapshot.empty) return
    //   snapshot.docs.map((doc) => {
    //     if (doc.exists() && data?.chats.includes(doc.id)) {
    //       setChats((prev) => {
    //         if (prev.find((v) => v?.id === doc.id)) {
    //           return prev
    //         } else {
    //           return [...prev, { id: doc.id, ...doc.data() }]
    //         }
    //       })
    //     }
    //   })
    // })

    // return () => {
    //   unsub()
    // }
  }, [data?.chats])

  return [orderdChats, refetch, isLoading]
}
