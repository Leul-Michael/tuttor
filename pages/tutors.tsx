import Head from "next/head"
import TutorStyles from "../styles/Tutor.module.css"
import TutorExcerpt from "../components/TutorExcerpt"
import TutorSearch from "../components/Search/TutorSearch"
import { useQuery } from "@tanstack/react-query"
import axiosInstance from "../axios/axios"
import { IUser } from "../models/User"
import TutorExcerptSkeleton from "../components/Skeleton/TutorExcerptSkeleton"

export default function Tutors() {
  const { data, isLoading } = useQuery({
    queryKey: ["tutors"],
    queryFn: async () => {
      const res = await axiosInstance.get("/tutor")
      return res.data
    },
  })
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
        <p className={TutorStyles.results}>{data?.length} results found</p>
        <div className={`${TutorStyles["tutor-grid"]}`}>
          {isLoading ? (
            <>
              <TutorExcerptSkeleton /> <TutorExcerptSkeleton />{" "}
              <TutorExcerptSkeleton /> <TutorExcerptSkeleton />{" "}
              <TutorExcerptSkeleton /> <TutorExcerptSkeleton />
            </>
          ) : (
            data?.map((user: IUser) => (
              <TutorExcerpt key={user._id} user={user} />
            ))
          )}
        </div>
      </div>
    </>
  )
}
