import { useState } from "react"
import axiosInstance from "../axios/axios"

export default function useGetRecommendedFeed(): [
  () => Promise<void>,
  boolean
] {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const getRecommendedFeed = async () => {
    try {
      setIsLoading(true)
      const result = await axiosInstance.get("/jobs/feed")
      return result.data
    } catch (e: any) {
      throw new Error(e?.response?.data.msg || e?.response?.data || e.message)
    } finally {
      setIsLoading(false)
    }
  }

  return [getRecommendedFeed, isLoading]
}
