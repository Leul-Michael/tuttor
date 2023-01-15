import FeedStyles from "../styles/Feed.module.css"
import { useRef, useState, useEffect } from "react"
import JobExcerpt from "./JobExcerpt"
import RecentSearch from "./RecentSearch"
import JobDetails from "./JobDetails"
import axiosInstance from "../axios/axios"
import { JobType } from "../types"
import JobExcerptSkeleton from "./Skeleton/JobExcerptSkeleton"
import { useInfiniteQuery } from "@tanstack/react-query"
import useJobContext, { JobContextProvider } from "../context/JobContext"
import useWindowsWidth from "../hooks/useWindowsWidth"
import useLastPostRef from "../hooks/useLastPostRef"

export default function Feed() {
  const { viewJob, jobId } = useJobContext()
  const [width] = useWindowsWidth()

  const feedRef = useRef<HTMLDivElement>(null)
  const [tabIndex, setTabIndex] = useState(0)

  const changeTabIndex = (x: number) => {
    setTabIndex(x)
    feedRef.current?.style.setProperty("--indicator", x.toString())
  }

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["jobs"],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await axiosInstance.get("/jobs/feed", {
          params: { pageParam },
        })
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

  useEffect(() => {
    if (!jobId && width >= 1000) {
      viewJob(data?.pages[0]?.jobs[0]?._id)
    }
  }, [jobId, data?.pages, viewJob, width])

  let content
  if (tabIndex === 0) {
    content = (
      <div
        className={`${FeedStyles["job-feed"]} ${
          width < 1000 ? FeedStyles["job-feed__md"] : FeedStyles["job-feed__lg"]
        }`}
      >
        <div className={FeedStyles["job-feed__list"]}>
          {data?.pages?.map((pg: any) => {
            return pg?.jobs?.map((job: JobType, idx: number) => {
              if (pg?.jobs?.length === idx + 1) {
                return (
                  <div ref={lastPostRef} key={job._id}>
                    <JobExcerpt job={job} />
                  </div>
                )
              }
              return <JobExcerpt key={job._id} job={job} />
            })
          })}
          {(isLoading || isFetchingNextPage) && (
            <>
              <JobExcerptSkeleton />
              <JobExcerptSkeleton />
            </>
          )}
        </div>
        {width >= 1000 ? (
          <div className={FeedStyles["job-feed__description"]}>
            <JobDetails />
          </div>
        ) : null}
      </div>
    )
  } else {
    content = (
      <div className={FeedStyles["recent-searches"]}>
        <RecentSearch />
      </div>
    )
  }

  return (
    <section className={FeedStyles.feed}>
      <header>
        <div ref={feedRef} className={`${FeedStyles["flex-btns"]} container`}>
          <button
            onClick={() => changeTabIndex(0)}
            className={FeedStyles.active}
          >
            your feed
          </button>
          <button onClick={() => changeTabIndex(1)}>recent searches</button>
        </div>
      </header>
      <div className="container">{content}</div>
    </section>
  )
}
