import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { useCallback, useEffect, useState, useMemo } from "react"
import ConversationStyles from "../../../styles/Conversation.module.css"
import { CgSearchLoading } from "react-icons/cg"
import { BsFilterRight } from "react-icons/bs"
import axiosInstance from "../../../axios/axios"
import { IUser } from "../../../models/User"
import { onSnapshot, doc, DocumentData } from "firebase/firestore"
import { db } from "../../../configs/firebase"
import { CHATS } from "../../../hooks/useCreateConversation"
import ChatMessages from "../../../components/ChatMessages"
import Chat from "../../../components/Chat"
import useWindowsWidth from "../../../hooks/useWindowsWidth"
import MobileChatMessages from "../../../components/MobileChatMessages"

export default function Conversation({ user }: { user: IUser }) {
  const [width] = useWindowsWidth()
  const [showChat, setShowChat] = useState(false)
  const [chats, setChats] = useState<(DocumentData | undefined)[]>([])

  const getUserChats = useCallback(() => {
    if (!user?.chats || user.chats?.length <= 0) return
    user.chats.map((chat: string) => {
      const unsub = onSnapshot(doc(db, CHATS, chat), (doc) => {
        if (!doc?.data()) return
        setChats((prev) => {
          if (prev.find((v) => v?.id === chat)) {
            return prev
          } else {
            return [...prev, { id: chat, ...doc.data() }]
          }
        })
      })

      return () => {
        unsub()
      }
    })
  }, [user?.chats])

  useEffect(() => {
    getUserChats()
  }, [getUserChats])

  const orderdChats = useMemo(
    () => [...chats].sort((a, b) => b?.updatedAt - a?.updatedAt),
    [chats]
  )

  return (
    <section className={ConversationStyles.conversation}>
      <div className={`${ConversationStyles["user-conversations"]} container`}>
        <div className={ConversationStyles["users-list"]}>
          <div className={ConversationStyles["users-list__search"]}>
            <div className={ConversationStyles["input-box"]}>
              <CgSearchLoading
                className={`${ConversationStyles["search-icon"]} ${ConversationStyles.icon}`}
              />
              <input type="search" placeholder="Search" />
            </div>
            <BsFilterRight className={ConversationStyles["filter-icon"]} />
          </div>
          <div className={ConversationStyles["users-list__users"]}>
            {orderdChats?.length > 0 ? (
              orderdChats.map((chat) => (
                <Chat
                  key={chat?.id}
                  chatId={chat?.id}
                  user={user}
                  setShowChat={setShowChat}
                />
              ))
            ) : (
              <div className={ConversationStyles["users-list__user"]}>
                <div className={ConversationStyles["msg-preview"]}>
                  <span>No Conversation to show</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={ConversationStyles["user-messages"]}>
          {width <= 600 ? (
            <MobileChatMessages setShowChat={setShowChat} showChat={showChat} />
          ) : (
            <ChatMessages />
          )}
        </div>
      </div>
    </section>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  try {
    const res = await axiosInstance.get(`/users/${session.user.id}`, {
      headers: {
        cookie: context.req.headers.cookie || "",
      },
    })

    if (!res.data) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      }
    }

    return {
      props: {
        user: res.data,
      },
    }
  } catch {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }
}