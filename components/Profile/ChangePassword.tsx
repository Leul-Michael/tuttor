import { useState } from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { RiExchangeLine } from "react-icons/ri"
import ResetPasswordForm from "./ResetPasswordForm"

export default function ChangePassword() {
  const [openModal, setOpenModal] = useState(false)

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
