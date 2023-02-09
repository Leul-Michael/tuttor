import Link from "next/link"
import { useState, MouseEvent } from "react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md"
import { TbPoint } from "react-icons/tb"
import useToast from "../context/ToastContext"
import { JobType } from "../types"
import ConfirmDelete from "./Job/ConfirmJobDeletion"
import JobProposals from "./Job/JobProposals"
import TimeAgo from "./TimeAgo"
import Styles from "../styles/Job.module.css"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../axios/axios"
import JobStatus from "./Job/JobStatus"

export default function UserJobExcerpt({ job }: { job: JobType }) {
  const queryClient = useQueryClient()
  const { addMessage } = useToast()

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [jobProposalsModal, setJobProposalsModal] = useState(false)
  const [jobStatusModal, setJobStatusModal] = useState(false)
  const [jobProposals, setJobProposals] = useState<string[]>([])
  const [deleteJobId, setDeleteJobId] = useState("")

  const mutation = useMutation({
    mutationFn: (deleteJob: { id: string }) => {
      return axiosInstance.delete(`/jobs/${deleteJob.id}`)
    },
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: ["MyJobs"] })
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
    } finally {
      setConfirmDelete(false)
      setDeleteJobId("")
    }
  }
  return (
    <Link
      href={`/jobs/[id]`}
      as={`/jobs/${job._id}`}
      className={Styles["my-job"]}
    >
      {confirmDelete && (
        <ConfirmDelete
          setOpenModal={setConfirmDelete}
          removeSelected={removeSelected}
          jobId={deleteJobId}
        />
      )}
      {jobProposalsModal && (
        <JobProposals
          setOpenModal={setJobProposalsModal}
          proposals={jobProposals}
          jobId={job?._id}
        />
      )}
      {jobStatusModal && (
        <JobStatus
          setOpenModal={setJobStatusModal}
          status={job.status}
          jobId={job?._id}
        />
      )}
      <div className={Styles["my-job__header"]}>
        <h2 className="font-serif">
          {job.title}{" "}
          <span
            className={`job-status ${
              job.status === "Active" ? "job-status-good" : "job-status-fail"
            } `}
          >
            {job.status}
          </span>
        </h2>
        <div className={Styles["flex-buttons"]}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setJobProposals(job?.proposals)
              setJobProposalsModal(true)
            }}
            className={`btn  ${Styles.btn} ${Styles["btn-sm"]}`}
          >
            Proposals <span className="count">({job.proposals.length})</span>
          </button>
          <div className={Styles["icon-buttons"]}>
            <button
              disabled={mutation.isLoading}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
              className={`${Styles.btn} ${Styles["icon-btn"]}`}
            >
              <MdOutlineEdit />
            </button>
            <button
              disabled={mutation.isLoading}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setDeleteJobId(job._id)
                setJobStatusModal(false)
                setConfirmDelete(true)
              }}
              className={`${Styles.btn} ${Styles["icon-btn"]} ${Styles.delete}`}
            >
              <MdOutlineDelete />
            </button>
            <button
              disabled={mutation.isLoading}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setConfirmDelete(false)
                setJobStatusModal(true)
              }}
              className={`${Styles.btn} ${Styles["icon-btn"]}`}
            >
              <BsThreeDotsVertical />
            </button>
          </div>
        </div>
      </div>
      <p className={Styles.location}>{job.location}</p>
      <p className={Styles.type}>{job.tutorType}</p>
      <div className={Styles.price}>
        <div className={Styles.header}>
          <TbPoint className={Styles.icon} />
          <p className={Styles.type}>Salary</p>
        </div>
        <div className={Styles["price-tag"]}>
          {" "}
          {job?.budgetMin}
          {job?.budgetMax ? " - " + job?.budgetMax : null} / hr
        </div>
      </div>
      <TimeAgo timestamp={job.createdAt} />
    </Link>
  )
}
