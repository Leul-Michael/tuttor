import { Dispatch, FormEvent, SetStateAction, useState } from "react"
import { MdOutlineClose } from "react-icons/md"
import axiosInstance from "../../axios/axios"
import useToast from "../../context/ToastContext"
import ProfileStyles from "../../styles/Profile.module.css"
import { msgType } from "../../types"
import Message from "../Messages/Message"
import Spinner from "../Spinner"

export default function ResetPasswordForm({
  setOpenModal,
}: {
  setOpenModal: Dispatch<SetStateAction<boolean>>
}) {
  const { addMessage } = useToast()
  const [errorMsg, setErrorMsg] = useState({
    type: msgType.ERROR,
    msg: "",
  })

  const [loading, setLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const canSave = [currentPassword, newPassword, confirmPassword].every(Boolean)

  const resetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setErrorMsg({
      type: msgType.INFO,
      msg: "",
    })

    if (!canSave) {
      return setErrorMsg({
        type: msgType.INFO,
        msg: "Fill in required fields!",
      })
    }

    if (newPassword.length < 6) {
      return setErrorMsg({
        type: msgType.ERROR,
        msg: "Password must be greater than 6 chrs.",
      })
    }

    if (newPassword !== confirmPassword) {
      return setErrorMsg({
        type: msgType.ERROR,
        msg: "Passwords do not match!",
      })
    }

    try {
      setLoading(true)
      const res = await axiosInstance.post("/profile/change-password", {
        currentPassword,
        newPassword,
      })
      if (res.status === 200) {
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        addMessage(res.data?.msg)
        setOpenModal(false)
      }
    } catch (e: any) {
      return setErrorMsg({
        type: msgType.ERROR,
        msg: e.response.data.msg || e.message,
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className={ProfileStyles["change-password-modal"]}>
      <div className={ProfileStyles["resume-header"]}>
        <h1 className="font-serif">Reset Password</h1>
        <MdOutlineClose
          onClick={() => setOpenModal(false)}
          className={ProfileStyles.icon}
        />
      </div>
      {errorMsg.msg ? (
        <Message type={errorMsg.type} msg={errorMsg.msg} />
      ) : null}
      <form
        onSubmit={resetPassword}
        className={`${ProfileStyles["add-form"]} ${ProfileStyles["reset-pwd-form"]}`}
      >
        <div className={ProfileStyles["input-box-flex"]}>
          <label htmlFor="currentPwd">Current Password</label>
          <input
            type="password"
            name=""
            id="currentPwd"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className={ProfileStyles["input-box-flex"]}>
          <label htmlFor="newPwd">New Password</label>
          <input
            type="password"
            name=""
            id="newPwd"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className={ProfileStyles["input-box-flex"]}>
          <label htmlFor="confirmPwd">Confirm Password</label>
          <input
            type="password"
            name=""
            id="confirmPwd"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className={`p-relative ${ProfileStyles.btn}`}
        >
          {loading ? <Spinner /> : "Reset"}
        </button>
      </form>
    </div>
  )
}
