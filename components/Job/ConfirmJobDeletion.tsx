import {
  Dispatch,
  FormEventHandler,
  SetStateAction,
  useState,
  MouseEvent,
} from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { MdOutlineClose } from "react-icons/md"
import axiosInstance from "../../axios/axios"
import { signOut } from "next-auth/react"
import useToast from "../../context/ToastContext"
import Spinner from "../Spinner"

export default function ConfirmDelete({
  setOpenModal,
  removeSelected,
  jobId,
}: {
  setOpenModal: Dispatch<SetStateAction<boolean>>
  removeSelected: (
    e: MouseEvent<HTMLButtonElement>,
    jobId: string
  ) => Promise<void>
  jobId: string
}) {
  const [loading, setLoading] = useState(false)

  const removeAction = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      setLoading(true)
      await removeSelected(e, jobId)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={ProfileStyles.resume}>
      <div className={ProfileStyles["resume-header"]}>
        <h1 className="font-serif">Delete Job Selected</h1>
        <MdOutlineClose
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setOpenModal(false)
          }}
          className={ProfileStyles.icon}
        />
      </div>
      <p className={`text-light text-sm ${ProfileStyles["p-top"]}`}>
        Are you sure you want to DELETE this job, submitted proposals will be
        lost.
      </p>
      <div
        className={`p-relative ${ProfileStyles["buttons-flex"]} ${ProfileStyles["buttons-sm"]}`}
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            <button
              onClick={(e) => removeAction(e)}
              type="submit"
              className={`${ProfileStyles.btn} ${ProfileStyles["btn-danger"]}`}
            >
              DELETE
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setOpenModal(false)
              }}
              type="button"
              className={ProfileStyles.btn}
            >
              cancel
            </button>
          </>
        )}
      </div>
    </div>
  )
}
