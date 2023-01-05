import { useState, FormEvent, MouseEvent } from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { RiExchangeLine } from "react-icons/ri"
import axiosInstance from "../../axios/axios"
import Spinner from "../Spinner"
import ResetPasswordForm from "./ResetPasswordForm"

export default function ChangePassword() {
  const [openModal, setOpenModal] = useState(false)

  //   const addSubject = async (e: FormEvent<HTMLFormElement>) => {
  //     e.preventDefault()

  //     try {
  //       setLoading(true)
  //       await axiosInstance.post("/profile/subject", {
  //         subject: subject.toLowerCase(),
  //       })

  //       setSubject("")
  //       refetch()
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  return (
    <div className={ProfileStyles.portion}>
      <p className={`font-serif ${ProfileStyles.title}`}>Change password.</p>
      {openModal && <ResetPasswordForm setOpenModal={setOpenModal} />}
      <button
        onClick={() => setOpenModal((prev) => !prev)}
        className={ProfileStyles[`btn-profile`]}
      >
        <RiExchangeLine className={ProfileStyles.icon} /> Change Password
      </button>
    </div>
  )
}
