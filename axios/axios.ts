import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/",
  // baseURL: "https://tuttor.vercel.app/api/",

  withCredentials: true,
})

export default axiosInstance
