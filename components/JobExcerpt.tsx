import { useRouter } from "next/router"
import { TbPoint } from "react-icons/tb"
import useJobContext from "../context/JobContext"
import useWindowsWidth from "../hooks/useWindowsWidth"
import styles from "../styles/Job.module.css"
import { JobType } from "../types"
import TimeAgo from "./TimeAgo"

export default function JobExcerpt({ job }: { job: JobType }) {
  const router = useRouter()
  const [width] = useWindowsWidth()
  const { viewJob } = useJobContext()

  return (
    <article
      onClick={() =>
        width >= 1000 ? viewJob(job._id) : router.push(`/jobs/${job._id}`)
      }
      tabIndex={0}
      className={styles.job}
    >
      <h1 className="font-serif">{job.title}</h1>
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
      <div className={styles.requirements}>
        <p className={styles.type}>Requirements</p>
        {job.requirements.map((req, idx) => (
          <div key={idx} className={styles.requirement}>
            <TbPoint className={styles.icon} />
            <p>{req}</p>
          </div>
        ))}
      </div>
      <TimeAgo timestamp={job.createdAt} />
    </article>
  )
}
