import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Link from "next/link"
import { MouseEvent, useState } from "react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { FiPlusCircle } from "react-icons/fi"
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md"
import { TbPoint } from "react-icons/tb"
import axiosInstance from "../../axios/axios"
import ConfirmDelete from "../../components/Job/ConfirmJobDeletion"
import JobProposals from "../../components/Job/JobProposals"
import MyJobSkeleton from "../../components/Skeleton/MyJobSkeleton"
import TimeAgo from "../../components/TimeAgo"
import useToast from "../../context/ToastContext"
import Styles from "../../styles/Job.module.css"
import { JobType } from "../../types"

export default function All() {
  const { addMessage } = useToast()

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [jobProposalsModal, setJobProposalsModal] = useState(false)
  const [deleteJobId, setDeleteJobId] = useState("")
  const [jobProposals, setJobProposals] = useState<string[]>([])

  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["MyJobs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/jobs")
      return res.data
    },
  })

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
    <section className={Styles["all-jobs"]}>
      <div className={`container ${Styles["all-jobs__container"]}`}>
        <div className={Styles["all-jobs__header"]}>
          <h1 className={`font-serif ${Styles["create-job__title"]}`}>
            All Jobs
          </h1>
          <Link href={"/jobs/create"} className={Styles[`btn-profile`]}>
            <FiPlusCircle className={Styles.icon} /> Create new Job
          </Link>
        </div>

        <ul className={Styles["all-jobs__list"]}>
          {isLoading ? (
            <>
              <MyJobSkeleton />
              <MyJobSkeleton />
            </>
          ) : data?.length ? (
            data?.map((job: JobType) => (
              <Link
                href={`/jobs/[id]`}
                as={`/jobs/${job._id}`}
                key={job._id}
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
                    jobId={deleteJobId}
                  />
                )}
                <div className={Styles["my-job__header"]}>
                  <h2 className="font-serif">
                    {job.title}{" "}
                    <span className="job-status job-status-good">Active</span>
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
                      Proposals{" "}
                      <span className="count">({job.proposals.length})</span>
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
                  <div className={Styles["price-tag"]}>{job.budget} / hr</div>
                </div>
                <TimeAgo timestamp={job.createdAt} />
              </Link>
            ))
          ) : (
            <p className="text-light">No available jobs to show here!</p>
          )}
        </ul>
      </div>
    </section>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
