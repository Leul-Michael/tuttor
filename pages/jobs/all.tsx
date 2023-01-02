import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Link from "next/link"
import { MouseEvent } from "react"
import { FiPlusCircle } from "react-icons/fi"
import { TbPoint } from "react-icons/tb"
import axiosInstance from "../../axios/axios"
import MyJobSkeleton from "../../components/Skeleton/MyJobSkeleton"
import TimeAgo from "../../components/TimeAgo"
import useToast from "../../context/ToastContext"
import Styles from "../../styles/Job.module.css"
import { JobType } from "../../types"

export default function All() {
  const { addMessage } = useToast()
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
      console.log(e)
      addMessage(e.response.data.msg || e.message)
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
          ) : (
            data?.map((job: JobType) => (
              <Link
                href={`/jobs/[id]`}
                as={`/jobs/${job._id}`}
                key={job._id}
                className={Styles["my-job"]}
              >
                <div className={Styles["my-job__header"]}>
                  <h2 className="font-serif">{job.title}</h2>
                  <div className={Styles["flex-buttons"]}>
                    <button
                      className={`btn  ${Styles.btn} ${Styles["btn-sm"]}`}
                    >
                      Proposals
                    </button>
                    <button
                      disabled={mutation.isLoading}
                      onClick={(e) => removeSelected(e, job._id)}
                      className={`btn  ${Styles.btn} ${Styles["btn-sm"]} ${Styles.delete}`}
                    >
                      Remove
                    </button>
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
