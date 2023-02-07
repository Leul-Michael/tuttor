import { Dispatch, SetStateAction, useState, MouseEventHandler } from "react"
import { MdOutlineClose } from "react-icons/md"
import { IUser } from "../../models/User"
import ProfileStyles from "../../styles/Profile.module.css"
import ViewJobStyles from "../../styles/Job.module.css"
import SelectAsyncDropdown, { AsyncOption } from "../Select/SelectAsyncDropdown"
import axiosInstance from "../../axios/axios"
import useToast from "../../context/ToastContext"

export default function JobInviteModal({
  setOpenInviteModal,
  user,
}: {
  setOpenInviteModal: Dispatch<SetStateAction<boolean>>
  user: IUser
}) {
  const { addMessage } = useToast()
  const [loading, setLoading] = useState(false)
  const [jobId, setJobId] = useState<AsyncOption>({
    _id: 0,
    title: "Not selected",
  })

  const onChange = (o: AsyncOption) => {
    setJobId(o)
  }

  const inviteUser: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()
    if (!jobId._id || typeof jobId._id !== "string" || !user._id) return
    try {
      setLoading(true)
      const res = await axiosInstance.patch("/jobs/invite", {
        jobId: jobId,
        userId: user._id,
      })
      addMessage(res.data?.msg)
      setOpenInviteModal(false)
    } catch {
      addMessage("Something went wrong, try again.")
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
        <h1 className="font-serif">Invite user</h1>
        <MdOutlineClose
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setOpenInviteModal(false)
          }}
          className={ProfileStyles.icon}
        />
      </div>
      <div className={ProfileStyles["invite-body"]}>
        <p className={`font-serif ${ProfileStyles["invite-title"]}`}>User</p>
        <div className={ProfileStyles["invite-user"]}>
          <div className="avatar">{user.name.slice(0, 2)}</div>
          <p>{user.name}</p>
        </div>
        <div className="jobs">
          <p className={`font-serif ${ProfileStyles["invite-title"]}`}>Job</p>
          <p className={ProfileStyles["invite-text"]}>Select a job</p>
          <SelectAsyncDropdown
            value={jobId}
            userId={user._id}
            onChange={onChange}
          />
        </div>
      </div>
      <div className={ProfileStyles["invite-footer"]}>
        <button
          disabled={loading}
          onClick={inviteUser}
          className={`btn  ${ViewJobStyles.btn} ${ViewJobStyles["btn-primary"]}`}
        >
          Send Invite
        </button>
      </div>
    </div>
  )
}
