import { useState, Dispatch, SetStateAction } from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { MdOutlineClose } from "react-icons/md"
import axiosInstance from "../../axios/axios"
import useToast from "../../context/ToastContext"
import { useQueryClient } from "@tanstack/react-query"
import Spinner from "../Spinner"

export default function JobStatus({
  setOpenModal,
  status,
  jobId,
}: {
  setOpenModal: Dispatch<SetStateAction<boolean>>
  status: string
  jobId: string
}) {
  const queryClient = useQueryClient()
  const { addMessage } = useToast()
  const [loading, setLoading] = useState(false)

  const changeStatus = async (status: string) => {
    if (loading) return
    try {
      setLoading(true)
      const res = await axiosInstance.patch(`/jobs`, { jobId, status })
      addMessage(res.data.msg)
      await queryClient.refetchQueries(["MyJobs"])
      setOpenModal(false)
    } catch (e: any) {
      addMessage(`Error: ${e.response.data.msg || e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      className={`${ProfileStyles.resume} ${ProfileStyles.proposals}`}
    >
      <div className={ProfileStyles["resume-header"]}>
        <h1 className="font-serif">Update your job status</h1>
        <MdOutlineClose
          onClick={(e) => {
            if (loading) return
            e.preventDefault()
            e.stopPropagation()
            setOpenModal(false)
          }}
          className={ProfileStyles.icon}
        />
      </div>
      <ul className={ProfileStyles["proposals-list"]}>
        {loading ? (
          <li
            className={`p-relative ${ProfileStyles["p-relative"]} ${ProfileStyles["status-item"]}`}
          >
            <Spinner />
          </li>
        ) : (
          <>
            <li
              onClick={() => status !== "Active" && changeStatus("Active")}
              className={`${ProfileStyles["status-item"]} ${
                status === "Active" ? ProfileStyles.active : null
              }`}
            >
              <p>Active</p>
            </li>
            <li
              onClick={() => status !== "Closed" && changeStatus("Closed")}
              className={`${ProfileStyles["status-item"]} ${
                status === "Closed" ? ProfileStyles.active : null
              }`}
            >
              <p>Closed</p>
            </li>
            <li
              onClick={() => status !== "Hired" && changeStatus("Hired")}
              className={`${ProfileStyles["status-item"]} ${
                status === "Hired" ? ProfileStyles.active : null
              }`}
            >
              <p>Hired</p>
            </li>
          </>
        )}
      </ul>
    </div>
  )
}
