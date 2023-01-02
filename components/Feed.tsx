import FeedStyles from "../styles/Feed.module.css"
import { useRef, useState } from "react"
import JobExcerpt from "./JobExcerpt"
import RecentSearch from "./RecentSearch"
import JobDetails from "./JobDetails"
import axiosInstance from "../axios/axios"
import { JobType } from "../types"
import JobExcerptSkeleton from "./Skeleton/JobExcerptSkeleton"
import { useQuery } from "@tanstack/react-query"
import { JobContextProvider } from "../context/JobContext"
import useWindowsWidth from "../hooks/useWindowsWidth"

export default function Feed() {
  const [width] = useWindowsWidth()
  const feedRef = useRef<HTMLDivElement>(null)
  const [tabIndex, setTabIndex] = useState(0)

  const changeTabIndex = (x: number) => {
    setTabIndex(x)
    feedRef.current?.style.setProperty("--indicator", x.toString())
  }

  const { data, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/jobs/feed")
      return res.data
    },
  })

  let content
  if (tabIndex === 0) {
    content = (
      <div
        className={`${FeedStyles["job-feed"]} ${
          width < 1000 ? FeedStyles["job-feed__md"] : FeedStyles["job-feed__lg"]
        }`}
      >
        <div className={FeedStyles["job-feed__list"]}>
          {isLoading ? (
            <>
              <JobExcerptSkeleton />
              <JobExcerptSkeleton />
              <JobExcerptSkeleton />
            </>
          ) : (
            data?.map((job: JobType) => <JobExcerpt key={job._id} job={job} />)
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
        <RecentSearch />
        <RecentSearch />
      </div>
    )
  }

  return (
    <JobContextProvider>
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
    </JobContextProvider>
  )
}
