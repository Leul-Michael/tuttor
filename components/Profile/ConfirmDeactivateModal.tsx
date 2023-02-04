import { Dispatch, FormEventHandler, SetStateAction, useState } from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { MdOutlineClose } from "react-icons/md"
import axiosInstance from "../../axios/axios"
import { signOut } from "next-auth/react"
import useToast from "../../context/ToastContext"
import Spinner from "../Spinner"

export default function ConfirmDeactivateModal({
  setOpenModal,
}: {
  setOpenModal: Dispatch<SetStateAction<boolean>>
}) {
  const { addMessage } = useToast()

  const [loading, setLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const removeAccount: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axiosInstance.delete("/profile/delete-account", {
        data: { currentPassword },
      })
      if (res.status === 200) {
        setCurrentPassword("")
        addMessage(res.data?.msg)
        signOut()
      }
    } catch (e: any) {
      addMessage(`Error: ${e.response.data.msg || e.message}`)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className={ProfileStyles.resume}>
      <div className={ProfileStyles["resume-header"]}>
        <h1 className="font-serif">Delete Your Account</h1>
        <MdOutlineClose
          onClick={() => {
            !loading && setOpenModal(false)
          }}
          className={ProfileStyles.icon}
        />
      </div>
      <p className={`text-light text-sm ${ProfileStyles["p-top"]}`}>
        Are you sure you want to DELETE your account? Deleting your account is
        an IRREVERSIBLE action!
      </p>
      <form
        onSubmit={removeAccount}
        className={`${ProfileStyles["add-form"]} ${ProfileStyles["delete-acc-form"]}`}
      >
        <div className={ProfileStyles["input-box-flex"]}>
          <label htmlFor="currentPwd">Current Password</label>
          <input
            type="password"
            name=""
            id="currentPwd"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div
          className={`p-relative ${ProfileStyles["buttons-flex"]} ${ProfileStyles["buttons-sm"]}`}
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              {" "}
              <button
                disabled={loading}
                type="submit"
                className={`${ProfileStyles.btn} ${ProfileStyles["btn-danger"]}`}
              >
                DELETE
              </button>
              <button
                onClick={() => {
                  !loading && setOpenModal(false)
                }}
                type="button"
                className={ProfileStyles.btn}
              >
                cancel
              </button>{" "}
            </>
          )}
        </div>
      </form>
    </div>
  )
}
