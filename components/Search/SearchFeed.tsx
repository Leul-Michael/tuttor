import FeedStyles from "../../styles/Feed.module.css"
import JobExcerpt from "../JobExcerpt"
import JobDetails from "../JobDetails"
import { JobType } from "../../types"
import JobExcerptSkeleton from "../Skeleton/JobExcerptSkeleton"
import { JobContextProvider } from "../../context/JobContext"
import useWindowsWidth from "../../hooks/useWindowsWidth"

interface SearchFeedProps {
  data: any
  isLoading: boolean
  lastPostRef: (node: HTMLDivElement) => void
  isFetchingNextPage: boolean
}

export default function SearchFeed({
  data,
  isLoading,
  lastPostRef,
  isFetchingNextPage,
}: SearchFeedProps) {
  const [width] = useWindowsWidth()

  let content
  if (isLoading) {
    content = (
      <div className={FeedStyles["job-feed__list"]}>
        {[...Array(5).keys()].map((i) => (
          <JobExcerptSkeleton key={i} />
        ))}
      </div>
    )
  } else if (data?.pages?.length > 0) {
    content = (
      <>
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
          {isFetchingNextPage &&
            [...Array(2).keys()].map((i) => <JobExcerptSkeleton key={i} />)}
        </div>
        {width >= 1000 ? (
          <div className={FeedStyles["job-feed__description"]}>
            <JobDetails />
          </div>
        ) : null}
      </>
    )
  } else {
    content = (
      <div className={FeedStyles["job-feed__list"]}>
        <p>No results found!!!</p>
      </div>
    )
  }

  return (
    <JobContextProvider>
      <section className={FeedStyles.feed}>
        <div className="container-md pd">
          <p className={FeedStyles["result-p"]}>
            Search results {data?.pages[0].total}
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
