import { GetServerSideProps } from "next"
import Link from "next/link"
import React from "react"
import { HiOutlineHeart } from "react-icons/hi"
import { TbPoint } from "react-icons/tb"
import axiosInstance from "../../../axios/axios"
import TimeAgo from "../../../components/TimeAgo"
import ViewJobStyles from "../../../styles/Job.module.css"
import { JobType } from "../../../types"

export default function index({ job }: { job: JobType }) {
  return (
    <section className={ViewJobStyles["view-job"]}>
      <div className="container-md">
        <article className={`${ViewJobStyles["no-p"]}`}>
          <div className={ViewJobStyles["job-details__header"]}>
            <h1 className="font-serif">{job.title}</h1>
            <p className={ViewJobStyles.location}>{job.location}</p>
            <p className={ViewJobStyles.type}>
              {job.tutorType === "Both"
                ? "Both In Person and Online"
                : job.tutorType}
            </p>
            <div className={ViewJobStyles["flex-btns"]}>
              <Link
                href={`/jobs/[id]/apply`}
                as={`/jobs/${job._id}/apply`}
                className={`btn  ${ViewJobStyles.btn} ${ViewJobStyles["btn-primary"]}`}
              >
                Apply
              </Link>
              <HiOutlineHeart className={ViewJobStyles["save-icon"]} />
            </div>
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
            <p className={ViewJobStyles.type}>Description</p>
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
              <p className={ViewJobStyles.type}>Requirements</p>
              {job.requirements.map((req, idx) => (
                <div key={idx} className={ViewJobStyles.requirement}>
                  <TbPoint className={ViewJobStyles.icon} />
                  <p>{req}</p>
                </div>
              ))}
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
