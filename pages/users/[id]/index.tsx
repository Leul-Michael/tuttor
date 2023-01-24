import { MouseEvent } from "react"
import { GetServerSideProps } from "next"
import Image from "next/image"
// import { AiFillContainer } from "react-icons/ai"
import React from "react"
import { TbPoint } from "react-icons/tb"
import axiosInstance from "../../../axios/axios"
import { IUser } from "../../../models/User"
import ViewJobStyles from "../../../styles/Job.module.css"
import useCreateConversation from "../../../hooks/useCreateConversation"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import useDm from "../../../context/DMContext"
import Head from "next/head"

export default function User({ user }: { user: IUser }) {
  const session = useSession()
  const router = useRouter()
  const { createConversation } = useCreateConversation()
  const { setSelectedChatId } = useDm()

  const handleConversation = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!session.data?.user) return
    const res = await createConversation(
      { _id: session.data.user.id, name: session.data.user.name! },
      user
    )

    if (res) {
      setSelectedChatId(res)
      router.push(`/users/${user._id}/conversation`)
    }
  }
  return (
    <>
      <Head>
        <title>User profile</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className={ViewJobStyles["view-job"]}>
        <div className="container-md">
          <article className={`${ViewJobStyles["no-p"]}`}>
            <div className={ViewJobStyles["job-details__header"]}>
              <h1 className="font-serif">{user.name}</h1>
              <p className={ViewJobStyles.location}>
                {user.location ? user.location : "Location not specified"}
              </p>
              <div className={ViewJobStyles["flex-btns"]}>
                <button
                  className={`btn  ${ViewJobStyles.btn} ${ViewJobStyles["btn-primary"]}`}
                  onClick={(e) => handleConversation(e)}
                >
                  Contact
                </button>
                {user?.resume ? (
                  <a
                    target="_blank"
                    title="Resume"
                    href={user?.resume}
                    rel="noopener noreferrer"
                  >
                    <Image
                      className={ViewJobStyles["resume-icon"]}
                      src="/resume.png"
                      alt="resume icon"
                      width={25}
                      height={25}
                    />
                    {/* <AiFillContainer className={ViewJobStyles["save-icon"]} /> */}
                  </a>
                ) : null}
              </div>
            </div>
            <div className={ViewJobStyles["job-details__body"]}>
              <div className={ViewJobStyles.price}>
                <div className={ViewJobStyles.header}>
                  <TbPoint className={ViewJobStyles.icon} />
                  <p className={ViewJobStyles.type}>Price per hour</p>
                </div>
                <div className={ViewJobStyles["price-tag"]}>
                  {user.price} / hr
                </div>
              </div>
              {user.subjects?.length ? (
                <div className={ViewJobStyles.price}>
                  <div className={ViewJobStyles.header}>
                    <TbPoint className={ViewJobStyles.icon} />
                    <p className={ViewJobStyles.type}>Subject priorities</p>
                  </div>
                  <div className={ViewJobStyles["schedule-btns"]}>
                    {user.subjects?.map((subject, idx) => (
                      <div key={idx} className={ViewJobStyles["price-tag"]}>
                        {subject}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {user.education?.length ? (
                <div className={ViewJobStyles.price}>
                  <div className={ViewJobStyles.header}>
                    <TbPoint className={ViewJobStyles.icon} />
                    <p className={ViewJobStyles.type}>Education</p>
                  </div>
                  {user.education?.map((edu: any) => (
                    <div
                      key={edu._id}
                      className={`${ViewJobStyles["price-tag"]} ${ViewJobStyles["edu-tag"]}`}
                    >
                      {edu?.level} in {edu?.field} from {edu?.school}
                    </div>
                  ))}
                </div>
              ) : null}
              <p className={ViewJobStyles.type}>Bio</p>
              <p className={ViewJobStyles.desc}>
                {user.bio ? user.bio : "no description"}
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query

  try {
    const res = await axiosInstance.get(`/users/${id}`, {
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
