import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { MouseEvent } from "react"
import axiosInstance from "../../axios/axios"
import { JobType } from "../../types"
import MyJobSkeleton from "../Skeleton/MyJobSkeleton"
import TimeAgo from "../TimeAgo"
import Styles from "../../styles/Job.module.css"
import { MdOutlineDelete } from "react-icons/md"
import { TbPoint } from "react-icons/tb"
import { useRouter } from "next/router"

export default function SavedJobs() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["SavedJobs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/jobs/saved")
      return res.data
    },
  })

  const mutation = useMutation({
    mutationFn: (deleteJob: { id: string }) => {
      return axiosInstance.delete(`/jobs/saved`, {
        data: { jobId: deleteJob.id },
      })
    },
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: ["SavedJobs"] })
    },
  })

  const removeSelected = async (
    e: MouseEvent<HTMLButtonElement>,
    jobId: string
  ) => {
    e.preventDefault()
    e.stopPropagation()
    await mutation.mutateAsync({ id: jobId })
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
          <div
            onClick={(e) => {
              e.preventDefault()
              router.push(`/jobs/${job._id}`)
            }}
            key={job._id}
            className={Styles["my-job"]}
          >
            <div className={`${Styles["my-job__header"]}`}>
              <h2 className="font-serif">{job?.title}</h2>
              <div className={Styles["flex-buttons"]}>
                <button
                  title="Apply for the job"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    router.push(`/jobs/${job._id}/apply`)
                  }}
                  className={`btn  ${Styles.btn} ${Styles["btn-sm"]}`}
                >
                  Apply
                </button>
                <div className={Styles["icon-buttons"]}>
                  <button
                    title="Remove job from saved"
                    disabled={mutation?.isLoading}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeSelected(e, job._id)
                    }}
                    className={`${Styles.btn} ${Styles["icon-btn"]} ${Styles.delete}`}
                  >
                    <MdOutlineDelete />
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
        <p className="text-light">No Saved jobs to show here!</p>
      )}
    </div>
  )
}
