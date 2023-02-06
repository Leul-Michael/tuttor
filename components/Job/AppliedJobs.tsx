import { JobType } from "../../types"
import axiosInstance from "../../axios/axios"
import { useQuery } from "@tanstack/react-query"
import MyJobSkeleton from "../Skeleton/MyJobSkeleton"
import AppliedJobExcerpt from "./AppliedJobExcerpt"

export default function AppliedJobs() {
  const { data, isLoading } = useQuery({
    queryKey: ["AppliedJobs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/jobs/applied")
      return res.data
    },
  })

  return (
    <div>
      {isLoading ? (
        [...Array(2).keys()].map((i) => <MyJobSkeleton key={i} />)
      ) : data?.length ? (
        data?.map((job: JobType) => (
          <AppliedJobExcerpt key={job._id} job={job} />
        ))
      ) : (
        <p className="text-light">No Applied jobs to show here!</p>
      )}
    </div>
  )
}
