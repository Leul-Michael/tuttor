import { useInfiniteQuery } from "@tanstack/react-query"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Link from "next/link"
import { FiPlusCircle } from "react-icons/fi"
import axiosInstance from "../../axios/axios"
import MyJobSkeleton from "../../components/Skeleton/MyJobSkeleton"
import UserJobExcerpt from "../../components/UserJobExcerpt"
import useLastPostRef from "../../hooks/useLastPostRef"
import Styles from "../../styles/Job.module.css"
import { ACCOUNT_TYPE, JobType } from "../../types"

export default function All() {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["MyJobs"],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await axiosInstance.get("/jobs", { params: { pageParam } })
        return res.data
      },
      getNextPageParam: (lastPage, allPages) => {
        return lastPage?.hasMore ? parseInt(lastPage?.pageParam) + 1 : undefined
      },
    })

  const lastPostRef = useLastPostRef(
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    hasNextPage
  )

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
          {data?.pages.length ? (
            data?.pages.map((pg) => {
              return pg?.jobs?.map((job: JobType, idx: number) => {
                if (pg?.jobs?.length === idx + 1) {
                  return (
                    <div ref={lastPostRef} key={job._id}>
                      <UserJobExcerpt job={job} />
                    </div>
                  )
                }
                return <UserJobExcerpt key={job._id} job={job} />
              })
            })
          ) : (
            <p className="text-light">No available jobs to show here!</p>
          )}
          {(isLoading || isFetchingNextPage) && (
            <>
              <MyJobSkeleton />
              <MyJobSkeleton />
            </>
          )}
        </ul>
      </div>
    </section>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session || session.user.role !== ACCOUNT_TYPE.EMPLOYER) {
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
