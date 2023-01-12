import { MouseEvent } from "react"
import Styles from "../../styles/Job.module.css"
import { JobType } from "../../types"
import { BiCommentMinus } from "react-icons/bi"
import { TbPoint } from "react-icons/tb"
import TimeAgo from "../TimeAgo"
import axiosInstance from "../../axios/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import MyJobSkeleton from "../Skeleton/MyJobSkeleton"
import useToast from "../../context/ToastContext"
import { useSession } from "next-auth/react"

export default function AppliedJobs() {
  const session = useSession()
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
            <div
              className={`${Styles["my-job__header"]} ${Styles["n-flex-row"]}`}
            >
              <h2 className="font-serif">
                {job?.title}{" "}
                <span className="job-status job-status-good">Applied</span>
              </h2>
              <div className={Styles["flex-buttons"]}>
                <div className={Styles["icon-buttons"]}>
                  <button
                    title="Withdraw your proposal"
                    disabled={mutation?.isLoading}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      removeSelected(e, job._id)
                    }}
                    className={`${Styles.btn} ${Styles["icon-btn"]} ${Styles.delete}`}
                  >
                    <BiCommentMinus />
                  </button>
                </div>
              </div>
            </div>
            <p className={Styles.location}>{job?.location}</p>
            <p className={Styles.type}>{job?.tutorType}</p>
            {job.proposals.map((prop: any) => {
              if (prop?.user === session.data?.user.id) {
                return (
                  <div key={prop?._id} className={Styles.price}>
                    <div className={Styles.header}>
                      <TbPoint className={Styles.icon} />
                      <p className={Styles.type}>Your Proposal</p>
                    </div>
                    <p
                      className={`${Styles["price-tag"]} ${Styles["edu-tag"]}`}
                    >
                      {prop?.desc}
                    </p>
                  </div>
                )
              }
            })}
            <TimeAgo timestamp={job?.createdAt} />
          </div>
        ))
      ) : (
        <p className="text-light">No Applied jobs to show here!</p>
      )}
    </div>
  )
}
