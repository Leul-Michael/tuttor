import { useState } from "react"
import axiosInstance from "../axios/axios"

export default function useGetMe(): [() => Promise<void>, boolean] {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const getMe = async () => {
    try {
      setIsLoading(true)
      const result = await axiosInstance.get("/getMe")
      return result.data
    } catch (e: any) {
      throw new Error(e?.response?.data.msg || e?.response?.data || e.message)
    } finally {
      setIsLoading(false)
    }
  }

  return [getMe, isLoading]
}
