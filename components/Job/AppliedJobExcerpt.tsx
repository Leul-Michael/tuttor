import { MouseEvent, useMemo } from "react"
import { BiCommentMinus } from "react-icons/bi"
import { JobType } from "../../types"
import Styles from "../../styles/Job.module.css"
import useToast from "../../context/ToastContext"
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../../axios/axios"
import { TbPoint } from "react-icons/tb"
import TimeAgo from "../TimeAgo"

export default function AppliedJobExcerpt({ job }: { job: JobType }) {
  const session = useSession()
  const { addMessage } = useToast()
  const queryClient = useQueryClient()

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

  const proposalStatus = useMemo(() => {
    if (!session.data?.user.id) return
    const userProposal: any = job?.proposals.find((proposal: any) => {
      return proposal.user.toString() === session.data?.user.id
    })

    return userProposal?.status
  }, [job?.proposals, session.data?.user.id])

  return (
    <div key={job._id} className={Styles["my-job"]}>
      <div className={`${Styles["my-job__header"]} ${Styles["n-flex-row"]}`}>
        <h2 className="font-serif">
          {job?.title}{" "}
          <span
            className={`job-status  ${
              proposalStatus === "Not Selected"
                ? "job-status-fail"
                : "job-status-good"
            }`}
          >
            {proposalStatus}
          </span>
        </h2>
        {proposalStatus === "Not Selected" ? null : (
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
        )}
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
              <p className={`${Styles["price-tag"]} ${Styles["edu-tag"]}`}>
                {prop?.desc}
              </p>
            </div>
          )
        }
      })}
      <TimeAgo timestamp={job?.createdAt} />
    </div>
  )
}
