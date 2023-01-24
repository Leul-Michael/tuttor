import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { useEffect, useState, useMemo } from "react"
import ConversationStyles from "../../../styles/Conversation.module.css"
import { CgSearchLoading } from "react-icons/cg"
import { BsFilterRight } from "react-icons/bs"
import axiosInstance from "../../../axios/axios"
import { IUser } from "../../../models/User"
import { onSnapshot, DocumentData, collection } from "firebase/firestore"
import { db } from "../../../configs/firebase"
import { CHATS } from "../../../hooks/useCreateConversation"
import Chat from "../../../components/Chat"
import useWindowsWidth from "../../../hooks/useWindowsWidth"
import dynamic from "next/dynamic"

const ChatMessages = dynamic(() => import("../../../components/ChatMessages"))
const MobileChatMessages = dynamic(
  () => import("../../../components/MobileChatMessages")
)

export default function Conversation({ user }: { user: IUser }) {
  const [width] = useWindowsWidth()
  const [showChat, setShowChat] = useState(false)
  const [chats, setChats] = useState<(DocumentData | undefined)[]>([])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, CHATS),
      { includeMetadataChanges: true },
      (snapshot) => {
        setChats([])
        snapshot.docs.map((doc) => {
          if (!doc?.data()) return
          if (user.chats?.includes(doc.id)) {
            setChats((prev) => {
              if (prev.find((v) => v?.id === doc.id)) {
                return prev
              } else {
                return [...prev, { id: doc.id, ...doc.data() }]
              }
            })
          }
        })
      }
    )

    return () => {
      unsubscribe()
    }
  }, [user.chats])

  const orderdChats = useMemo(
    () => chats.sort((a, b) => b?.updatedAt - a?.updatedAt),
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
        {width <= 600 ? (
          <MobileChatMessages setShowChat={setShowChat} showChat={showChat} />
        ) : (
          <div className={ConversationStyles["user-messages"]}>
            <ChatMessages />
          </div>
        )}
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
