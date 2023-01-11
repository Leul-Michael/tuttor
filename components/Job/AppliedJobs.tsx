import { MouseEvent } from "react"
import Link from "next/link"
import Styles from "../../styles/Job.module.css"
import { JobType } from "../../types"
import { BsThreeDotsVertical } from "react-icons/bs"
import { TbPoint } from "react-icons/tb"
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md"
import TimeAgo from "../TimeAgo"
import axiosInstance from "../../axios/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import MyJobSkeleton from "../Skeleton/MyJobSkeleton"
import useToast from "../../context/ToastContext"

export default function AppliedJobs() {
  const { addMessage } = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["AppliedJobs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/jobs/applied")
      return res.data
    },
  })

  const mutation = useMutation({
    mutationFn: (deleteJob: { id: string }) => {
      return axiosInstance.delete(`/jobs/applied`, {
        data: { jobId: deleteJob.id },
      })
    },
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: ["AppliedJobs"] })
    },
  })

  const removeSelected = async (
    e: MouseEvent<HTMLButtonElement>,
    jobId: string
  ) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await mutation.mutateAsync({ id: jobId })
      addMessage(res.data?.msg)
    } catch (e: any) {
      addMessage(e.response.data.msg || e.message)
    }
  }

  return (
    <div>
      {isLoading ? (
        <>
          <MyJobSkeleton />
          <MyJobSkeleton />
        </>
      ) : data?.length ? (
        data?.map((job: JobType) => (
          <div key={job._id} className={Styles["my-job"]}>
            <div className={Styles["my-job__header"]}>
              <h2 className="font-serif">
                {job?.title}{" "}
                <span className="job-status job-status-good">Applied</span>
              </h2>
              <div className={Styles["flex-buttons"]}>
                <div className={Styles["icon-buttons"]}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                    }}
                    className={`${Styles.btn} ${Styles["icon-btn"]}`}
                  >
                    <MdOutlineEdit />
                  </button>
                  <button
                    disabled={mutation?.isLoading}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      removeSelected(e, job._id)
                    }}
                    className={`${Styles.btn} ${Styles["icon-btn"]} ${Styles.delete}`}
                  >
                    <MdOutlineDelete />
                  </button>
                  <button
                    disabled={mutation?.isLoading}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                    }}
                    className={`${Styles.btn} ${Styles["icon-btn"]}`}
                  >
                    <BsThreeDotsVertical />
                  </button>
                </div>
              </div>
            </div>
            <p className={Styles.location}>{job?.location}</p>
            <p className={Styles.type}>{job?.tutorType}</p>
            <div className={Styles.price}>
              <div className={Styles.header}>
                <TbPoint className={Styles.icon} />
                <p className={Styles.type}>Salary</p>
              </div>
              <div className={Styles["price-tag"]}>{job?.budget} / hr</div>
            </div>
            <TimeAgo timestamp={job?.createdAt} />
          </div>
        ))
      ) : (
        <p className="text-light">No Applied jobs to show here!</p>
      )}
    </div>
  )
}
