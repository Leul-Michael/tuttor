import Head from "next/head"
import TutorStyles from "../styles/Tutor.module.css"
import TutorExcerpt from "../components/TutorExcerpt"
import TutorSearch from "../components/Search/TutorSearch"
import { useInfiniteQuery } from "@tanstack/react-query"
import axiosInstance from "../axios/axios"
import { IUser } from "../models/User"
import TutorExcerptSkeleton from "../components/Skeleton/TutorExcerptSkeleton"
// import useLastPostRef from "../hooks/useLastPostRef"

export default function Tutors() {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["tutors"],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await axiosInstance.get("/tutor", { params: { pageParam } })
        return res.data
      },
    })

  // const lastPostRef = useLastPostRef(
  //   isFetchingNextPage,
  //   isLoading,
  //   fetchNextPage,
  //   hasNextPage
  // )

  return (
    <>
      <Head>
        <title>Find Tutors</title>
        <meta name="description" content="Find the best tutors near you." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TutorSearch />
      <div className={`container ${TutorStyles.tuttors}`}>
        <p className={TutorStyles.results}>
          {data?.pages[0]?.tutors?.length} results found
        </p>
        <div className={`${TutorStyles["tutor-grid"]}`}>
          {data?.pages?.map((pg) =>
            pg?.tutors?.map((user: IUser, idx: number) => {
              // if (pg?.tutors?.length === idx + 1) {
              //   return (
              //     <div ref={lastPostRef} key={user._id}>
              //       <TutorExcerpt user={user} />
              //     </div>
              //   )
              // }
              return <TutorExcerpt key={user._id} user={user} />
            })
          )}
          {(isLoading || isFetchingNextPage) && (
            <>
              <TutorExcerptSkeleton /> <TutorExcerptSkeleton />
              <TutorExcerptSkeleton /> <TutorExcerptSkeleton />
              <TutorExcerptSkeleton /> <TutorExcerptSkeleton />
            </>
          )}
          {data?.pages[0].tutors.length === 0 ? (
            <p className="text-light">No available jobs to show here!</p>
          ) : null}
        </div>
      </div>
    </>
  )
}
