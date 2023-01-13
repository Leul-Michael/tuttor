import { GetServerSideProps } from "next"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useMemo, MouseEvent } from "react"
import { HiOutlineHeart } from "react-icons/hi"
import { MdOutlineModeEdit } from "react-icons/md"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import { TbPoint } from "react-icons/tb"
import axiosInstance from "../../../axios/axios"
import TimeAgo from "../../../components/TimeAgo"
import ViewJobStyles from "../../../styles/Job.module.css"
import { ACCOUNT_TYPE, JobType } from "../../../types"
import { useRouter } from "next/router"

export default function Index({ job }: { job: JobType }) {
  const session = useSession()
  const router = useRouter()

  const isApplied = useMemo(() => {
    if (!session.data?.user.id) return
    return job?.proposals.some((job: any) => {
      return job.user.toString() === session.data?.user.id
    })
  }, [job?.proposals, session.data?.user.id])

  const addSavedJob = async (e: MouseEvent<SVGElement>) => {
    e.preventDefault()
    await axiosInstance.post(`/jobs/saved`, { jobId: job._id })
    router.replace(router.asPath)
  }

  const isSaved = useMemo(() => {
    if (!session.data?.user.id) return false
    return job?.saves.includes(session?.data?.user.id)
  }, [job?.saves, session?.data?.user.id])

  return (
    <section className={ViewJobStyles["view-job"]}>
      <div className="container-md">
        <article className={`${ViewJobStyles["no-p"]}`}>
          <div className={ViewJobStyles["job-details__header"]}>
            <h1 className="font-serif">
              {job.title}
              {isApplied ? (
                <span className="job-status job-status-good">Applied</span>
              ) : session.data?.user.id === job.user ? (
                <span className="job-status job-status-good">Author</span>
              ) : null}
            </h1>
            <p className={ViewJobStyles.location}>{job.location}</p>
            <p className={ViewJobStyles.type}>
              {job.tutorType === "Both"
                ? "Both In Person and Online"
                : job.tutorType}
            </p>
            {session.data?.user.role === ACCOUNT_TYPE.TUTTOR ? (
              <div className={ViewJobStyles["flex-btns"]}>
                <Link
                  href={`/jobs/[id]/apply`}
                  as={`/jobs/${job._id}/apply`}
                  className={`btn  ${ViewJobStyles.btn} ${ViewJobStyles["btn-primary"]}`}
                >
                  Apply
                </Link>
                <HiOutlineHeart
                  onClick={(e) => addSavedJob(e)}
                  className={`${ViewJobStyles["save-icon"]} ${
                    isSaved ? ViewJobStyles.saved : ""
                  }`}
                />
              </div>
            ) : null}
          </div>
          <div className={ViewJobStyles["job-details__body"]}>
            <div className={ViewJobStyles.price}>
              <div className={ViewJobStyles.header}>
                <TbPoint className={ViewJobStyles.icon} />
                <p className={ViewJobStyles.type}>Salary</p>
              </div>
              <div className={ViewJobStyles["price-tag"]}>
                {job.budget} / hr
              </div>
            </div>
            <div className={ViewJobStyles.price}>
              <div className={ViewJobStyles.header}>
                <TbPoint className={ViewJobStyles.icon} />
                <p className={ViewJobStyles.type}>Schedule</p>
              </div>
              <div className={ViewJobStyles["schedule-btns"]}>
                {job.schedule.map((d) => (
                  <div key={d} className={ViewJobStyles["price-tag"]}>
                    {d}
                  </div>
                ))}
              </div>
            </div>
            <p className={`j-desc ${ViewJobStyles.type}`}>
              <MdOutlineModeEdit className="desc-icon" /> Description
            </p>
            <p className={ViewJobStyles.desc}>{job.desc}</p>
            <div className={ViewJobStyles.price}>
              <div className={ViewJobStyles.requirement}>
                <TbPoint className={ViewJobStyles.icon} />
                <p className={ViewJobStyles.type}>
                  Number of Students
                  <span className={ViewJobStyles.ptxt}>
                    {job.numberOfStudents}
                  </span>
                </p>
              </div>
            </div>
            <div className={ViewJobStyles.requirements}>
              <p className={`j-desc ${ViewJobStyles.type}`}>
                <IoMdCheckmarkCircleOutline className="desc-icon" />{" "}
                Requirements
              </p>
              {job.requirements?.length ? (
                job.requirements.map((req, idx) => (
                  <div key={idx} className={ViewJobStyles.requirement}>
                    <TbPoint className={ViewJobStyles.icon} />
                    <p>{req}</p>
                  </div>
                ))
              ) : (
                <div className={ViewJobStyles.requirement}>
                  <TbPoint className={ViewJobStyles.icon} />
                  <p>No requirement</p>
                </div>
              )}
            </div>
          </div>
          <TimeAgo timestamp={job.createdAt} />
        </article>
      </div>
    </section>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query

  try {
    const res = await axiosInstance.get(`/jobs/${id}`, {
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
        job: res.data,
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
