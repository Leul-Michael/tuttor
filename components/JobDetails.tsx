import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import React from "react"
import { HiOutlineHeart } from "react-icons/hi"
import { TbPoint } from "react-icons/tb"
import axiosInstance from "../axios/axios"
import useJobContext from "../context/JobContext"
import JobDetailStyles from "../styles/Job.module.css"
import { JobType } from "../types"
import JobDetailSkeleton from "./Skeleton/JobDetailSkeleton"
import TimeAgo from "./TimeAgo"

export default function JobDetails() {
  const { jobId } = useJobContext()

  const { data, isLoading } = useQuery({
    queryKey: ["jobs", jobId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/jobs/${jobId}`)
      return res.data
    },
    enabled: !!jobId,
  })

  if (!jobId) {
    return null
  }

  if (isLoading) {
    return <JobDetailSkeleton />
  }

  return (
    <article className={JobDetailStyles["job-details"]}>
      <div className={JobDetailStyles["job-details__header"]}>
        <h1 className="font-serif">{data?.title}</h1>
        <p className={JobDetailStyles.location}>{data?.location}</p>
        <p className={JobDetailStyles.type}>
          {data?.tutorType === "Both"
            ? "Both In Person and Online"
            : data?.tutorType}
        </p>
        <div className={JobDetailStyles.price}>
          <div className={JobDetailStyles.header}>
            <TbPoint className={JobDetailStyles.icon} />
            <p className={JobDetailStyles.type}>Salary</p>
          </div>
          <div className={JobDetailStyles["price-tag"]}>
            {data?.budget} / hr
          </div>
        </div>
        <div className={JobDetailStyles.price}>
          <div className={JobDetailStyles.header}>
            <TbPoint className={JobDetailStyles.icon} />
            <p className={JobDetailStyles.type}>Schedule</p>
          </div>
          <div className={JobDetailStyles["schedule-btns"]}>
            {data.schedule.map((d: string) => (
              <div key={d} className={JobDetailStyles["price-tag"]}>
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={JobDetailStyles["job-details__body"]}>
        <p className={JobDetailStyles.type}>Description</p>
        <p className={JobDetailStyles.desc}>{data?.desc}</p>
        <div className={JobDetailStyles.price}>
          <div className={JobDetailStyles.requirement}>
            <TbPoint className={JobDetailStyles.icon} />
            <p className={JobDetailStyles.type}>
              Number of Students
              <span className={JobDetailStyles.ptxt}>
                {data?.numberOfStudents}
              </span>
            </p>
          </div>
        </div>
        <div className={JobDetailStyles.requirements}>
          <p className={JobDetailStyles.type}>Requirements</p>
          {data?.requirements.map((req: string, idx: number) => {
            return (
              <div key={idx} className={JobDetailStyles.requirement}>
                <TbPoint className={JobDetailStyles.icon} />
                <p>{req}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className={JobDetailStyles["job-details__footer"]}>
        <div className={JobDetailStyles["flex-btns"]}>
          <Link
            href={`/jobs/[id]/apply`}
            as={`/jobs/${data._id}/apply`}
            className={`btn  ${JobDetailStyles.btn} ${JobDetailStyles["btn-primary"]}`}
          >
            Apply
          </Link>
          <HiOutlineHeart className={JobDetailStyles["save-icon"]} />
        </div>
        <TimeAgo timestamp={data.createdAt} />
      </div>
    </article>
  )
}