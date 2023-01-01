import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "https://tuttor.vercel.app/api/",
  withCredentials: true,
})

export default axiosInstance
