import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { HiOutlineHeart } from "react-icons/hi"
import { MdOutlineModeEdit } from "react-icons/md"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import { TbPoint } from "react-icons/tb"
import axiosInstance from "../axios/axios"
import useJobContext from "../context/JobContext"
import JobDetailStyles from "../styles/Job.module.css"
import JobDetailSkeleton from "./Skeleton/JobDetailSkeleton"
import TimeAgo from "./TimeAgo"
import { MouseEvent, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { ACCOUNT_TYPE } from "../types"

export default function JobDetails() {
  const session = useSession()
  const { jobId } = useJobContext()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["jobs", jobId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/jobs/${jobId}`)
      return res.data
    },
    enabled: !!jobId,
  })

  const addSavedJob = async (e: MouseEvent<SVGElement>) => {
    e.preventDefault()
    await axiosInstance.post(`/jobs/saved`, { jobId })
    refetch()
  }

  const isSaved = useMemo(() => {
    return data?.saves?.includes(session?.data?.user.id)
  }, [data?.saves, session?.data?.user.id])

  if (!jobId) {
    return null
  }

  if (isLoading) {
    return <JobDetailSkeleton />
  }

  if (!data) {
    return null
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
            {data?.budgetMin}
            {data?.budgetMax ? " - " + data?.budgetMax : null} / hr
          </div>
        </div>
        <div className={JobDetailStyles.price}>
          <div className={JobDetailStyles.header}>
            <TbPoint className={JobDetailStyles.icon} />
            <p className={JobDetailStyles.type}>Schedule</p>
          </div>
          <div className={JobDetailStyles["schedule-btns"]}>
            {data?.schedule?.map((d: string) => (
              <div key={d} className={JobDetailStyles["price-tag"]}>
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={JobDetailStyles["job-details__body"]}>
        <p className={`j-desc ${JobDetailStyles.type}`}>
          <MdOutlineModeEdit className="desc-icon" /> Description
        </p>
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
          <p className={`j-desc ${JobDetailStyles.type}`}>
            <IoMdCheckmarkCircleOutline className="desc-icon" /> Requirements
          </p>
          {data?.requirements?.length ? (
            data?.requirements.map((req: string, idx: number) => {
              return (
                <div key={idx} className={JobDetailStyles.requirement}>
                  <TbPoint className={JobDetailStyles.icon} />
                  <p>{req}</p>
                </div>
              )
            })
          ) : (
            <div className={JobDetailStyles.requirement}>
              <TbPoint className={JobDetailStyles.icon} />
              <p>No requirement</p>
            </div>
          )}
        </div>
      </div>
      <div className={JobDetailStyles["job-details__footer"]}>
        {session.data?.user.role !== ACCOUNT_TYPE.EMPLOYER ? (
          <div className={JobDetailStyles["flex-btns"]}>
            <Link
              href={`/jobs/[id]/apply`}
              as={`/jobs/${data?._id}/apply`}
              className={`btn  ${JobDetailStyles.btn} ${JobDetailStyles["btn-primary"]}`}
            >
              Apply
            </Link>
            <HiOutlineHeart
              onClick={(e) => session.data?.user && addSavedJob(e)}
              className={`${JobDetailStyles["save-icon"]} ${
                isSaved ? JobDetailStyles.saved : ""
              }`}
            />
          </div>
        ) : null}
        <TimeAgo timestamp={data.createdAt} />
      </div>
    </article>
  )
}
