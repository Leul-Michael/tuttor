import { useQuery } from "@tanstack/react-query"
import React from "react"
import axiosInstance from "../../axios/axios"
import { JobType } from "../../types"
import MyJobSkeleton from "../Skeleton/MyJobSkeleton"
import AppliedJobExcerpt from "./AppliedJobExcerpt"

export default function InvitedJobs() {
  const { data, isLoading } = useQuery({
    queryKey: ["InvitedJobs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/jobs/invited")
      return res.data
    },
  })

  return (
    <div>
      {isLoading ? (
        [...Array(2).keys()].map((i) => <MyJobSkeleton key={i} />)
      ) : data?.length ? (
        data?.map((job: JobType) => (
          <AppliedJobExcerpt key={job._id} job={job} invite />
        ))
      ) : (
        <p className="text-light">No Invites to show here!</p>
      )}
    </div>
  )
}
