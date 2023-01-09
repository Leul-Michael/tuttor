import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { TbPoint } from "react-icons/tb"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import useJobContext from "../context/JobContext"
import useWindowsWidth from "../hooks/useWindowsWidth"
import styles from "../styles/Job.module.css"
import { JobType } from "../types"
import TimeAgo from "./TimeAgo"
import { useMemo } from "react"

export default function JobExcerpt({ job }: { job: JobType }) {
  const session = useSession()
  const router = useRouter()
  const [width] = useWindowsWidth()
  const { viewJob } = useJobContext()

  const isApplied = useMemo(() => {
    if (!session.data?.user.id) return
    return job?.proposals.some((job: any) => {
      return job.user.toString() === session.data?.user.id
    })
  }, [job?.proposals, session.data?.user.id])

  return (
    <article
      onClick={() =>
        width >= 1000 ? viewJob(job._id) : router.push(`/jobs/${job._id}`)
      }
      tabIndex={0}
      className={styles.job}
    >
      <h1 className="font-serif">
        {job.title}{" "}
        {isApplied ? (
          <span className="job-status job-status-good">Applied</span>
        ) : null}
      </h1>
      <p className={styles.location}>{job.location}</p>
      <p className={styles.type}>
        {job.tutorType === "Both" ? "Both In Person and Online" : job.tutorType}
      </p>
      <div className={styles.price}>
        <div className={styles.header}>
          <TbPoint className={styles.icon} />
          <p className={styles.type}>Salary</p>
        </div>
        <div className={styles["price-tag"]}>{job.budget} / hr</div>
      </div>
      {job.requirements?.length ? (
        <div className={styles.requirements}>
          <p className={`j-desc ${styles.type}`}>
            <IoMdCheckmarkCircleOutline className="desc-icon" /> Requirements
          </p>
          {job.requirements.slice(0, 5).map((req, idx) => (
            <div key={idx} className={styles.requirement}>
              <TbPoint className={styles.icon} />
              <p>{req}</p>
            </div>
          ))}
        </div>
      ) : null}
      <TimeAgo timestamp={job.createdAt} />
    </article>
  )
}
