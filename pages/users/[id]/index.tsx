import { GetServerSideProps } from "next"
import Image from "next/image"
import { useMemo } from "react"
import { TbPoint } from "react-icons/tb"
import axiosInstance from "../../../axios/axios"
import { IUser } from "../../../models/User"
import ViewJobStyles from "../../../styles/Job.module.css"
import Head from "next/head"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function User({ user }: { user: IUser }) {
  const session = useSession()
  const isAuthor = useMemo(() => {
    return user._id === session.data?.user?.id
  }, [user._id, session.data?.user?.id])
  return (
    <>
      <Head>
        <title>User profile</title>
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
                {isAuthor ? (
                  <Link
                    href={"/profile"}
                    className={`btn  ${ViewJobStyles.btn} ${ViewJobStyles["btn-primary"]}`}
                  >
                    Profile
                  </Link>
                ) : (
                  <button
                    className={`btn  ${ViewJobStyles.btn} ${ViewJobStyles["btn-primary"]}`}
                  >
                    Invite
                  </button>
                )}
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
