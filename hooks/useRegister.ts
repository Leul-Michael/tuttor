import { useState } from "react"
import axiosInstance from "../axios/axios"
import { RegisterFormData } from "../types"

export default function useRegister(): [
  (formData: RegisterFormData) => Promise<any>,
  boolean
] {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const register = async (formData: RegisterFormData) => {
    try {
      setIsLoading(true)
      const result = await axiosInstance.post("/register", {
        ...formData,
      })
      return result.data
    } catch (e: any) {
      throw new Error(e?.response?.data.msg || e?.response?.data || e.message)
    } finally {
      setIsLoading(false)
    }
  }

  return [register, isLoading]
}
