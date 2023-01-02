import FeedStyles from "../../styles/Feed.module.css"
// import { useRef, useState } from "react"
import JobExcerpt from "../JobExcerpt"
import JobDetails from "../JobDetails"
import { JobType } from "../../types"
import JobExcerptSkeleton from "../Skeleton/JobExcerptSkeleton"
import { JobContextProvider } from "../../context/JobContext"
import useWindowsWidth from "../../hooks/useWindowsWidth"

interface SearchFeedProps {
  data: any
  isLoading: boolean
}

export default function SearchFeed({ data, isLoading }: SearchFeedProps) {
  const [width] = useWindowsWidth()

  let content
  if (isLoading) {
    content = (
      <div className={FeedStyles["job-feed__list"]}>
        <JobExcerptSkeleton />
        <JobExcerptSkeleton />
        <JobExcerptSkeleton />
      </div>
    )
  }

  if (data?.length > 0) {
    content = (
      <>
        <div className={FeedStyles["job-feed__list"]}>
          {data?.map((job: JobType) => (
            <JobExcerpt key={job._id} job={job} />
          ))}
        </div>
        {width >= 1000 ? (
          <div className={FeedStyles["job-feed__description"]}>
            <JobDetails />
          </div>
        ) : null}
      </>
    )
  }

  return (
    <JobContextProvider>
      <section className={FeedStyles.feed}>
        <div className="container-md pd">
          <p className={FeedStyles["result-p"]}>
            Search results {data?.length}
          </p>
        </div>
        <div className="container">
          <div
            className={`${FeedStyles["job-feed"]} ${
              width < 1000
                ? FeedStyles["job-feed__md"]
                : FeedStyles["job-feed__lg"]
            }`}
          >
            {content}
          </div>
        </div>
      </section>
    </JobContextProvider>
  )
}
