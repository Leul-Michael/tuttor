import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { useState } from "react"
import ConversationStyles from "../../../styles/Conversation.module.css"
import { CgSearchLoading } from "react-icons/cg"
import { BsFilterRight } from "react-icons/bs"
import axiosInstance from "../../../axios/axios"
import { IUser } from "../../../models/User"
import Chat from "../../../components/Chat"
import useWindowsWidth from "../../../hooks/useWindowsWidth"
import dynamic from "next/dynamic"
import useConversation from "../../../hooks/useConversation"
import Spinner from "../../../components/Spinner"
import Head from "next/head"

const ChatMessages = dynamic(() => import("../../../components/ChatMessages"))
const MobileChatMessages = dynamic(
  () => import("../../../components/MobileChatMessages")
)

export default function Conversation({ user }: { user: IUser }) {
  const [width] = useWindowsWidth()
  const [showChat, setShowChat] = useState(false)
  const [orderdChats, _, loading] = useConversation()

  return (
    <>
      <Head>
        <title>Your Chats</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className={ConversationStyles.conversation}>
        <div
          className={`${ConversationStyles["user-conversations"]} container`}
        >
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
              {loading ? (
                <div
                  className={`p-relative ${ConversationStyles["chat-loading"]}`}
                >
                  <Spinner />
                </div>
              ) : orderdChats?.length > 0 ? (
                orderdChats.map((chat) => (
                  <Chat
                    key={chat?.id}
                    chatId={chat?.id}
                    user={user}
                    setShowChat={setShowChat}
                    inChatPage
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
          {!loading ? (
            width <= 600 ? (
              <MobileChatMessages
                setShowChat={setShowChat}
                showChat={showChat}
              />
            ) : (
              <div className={ConversationStyles["user-messages"]}>
                <ChatMessages />
              </div>
            )
          ) : null}
        </div>
      </section>
    </>
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
