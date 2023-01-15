import Head from "next/head"
import TutorStyles from "../styles/Tutor.module.css"
import TutorExcerpt from "../components/TutorExcerpt"
import TutorSearch from "../components/Search/TutorSearch"
import { useInfiniteQuery } from "@tanstack/react-query"
import axiosInstance from "../axios/axios"
import { IUser } from "../models/User"
import TutorExcerptSkeleton from "../components/Skeleton/TutorExcerptSkeleton"
import { useState, FormEventHandler } from "react"
import useLastPostRef from "../hooks/useLastPostRef"

export default function Tutors() {
  const [searchData, setSearchData] = useState({
    name: "",
    location: "",
  })

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isRefetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["tutors"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get("/tutor", {
        params: {
          pageParam,
          name: searchData.name,
          location: searchData.location,
        },
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

  const findTutor: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    refetch()
  }

  const Loading = () => {
    return (
      <>
        <TutorExcerptSkeleton /> <TutorExcerptSkeleton />
        <TutorExcerptSkeleton />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Find Tutors</title>
        <meta name="description" content="Find the best tutors near you." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TutorSearch
        searchData={searchData}
        setSearchData={setSearchData}
        findTutor={findTutor}
      />
      <div className={`container ${TutorStyles.tuttors}`}>
        <p className={TutorStyles.results}>
          {/* {data?.pages.reduce((total, pg) => {
            total = total + pg?.tutors?.length
            return total
          }, 0)}{" "} */}
          {data?.pages[0].total} results found
        </p>
        <div className={`${TutorStyles["tutor-grid"]}`}>
          {isLoading || isRefetching ? (
            <Loading />
          ) : data?.pages[0].tutors.length === 0 ? (
            <p className="text-light">No tutor found!</p>
          ) : (
            data?.pages?.map((pg) =>
              pg?.tutors?.map((user: IUser, idx: number) => {
                if (pg?.tutors?.length === idx + 1) {
                  return (
                    <div
                      className={TutorStyles["last-ref"]}
                      ref={lastPostRef}
                      key={user._id}
                    >
                      <TutorExcerpt user={user} />
                    </div>
                  )
                }
                return <TutorExcerpt key={user._id} user={user} />
              })
            )
          )}
          {isFetchingNextPage && <Loading />}
        </div>
      </div>
    </>
  )
}
