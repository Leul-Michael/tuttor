import { useState } from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import ConfirmDeactivateModal from "./ConfirmDeactivateModal"

export default function Deactivate() {
  const [openModal, setOpenModal] = useState(false)

  return (
    <div className={ProfileStyles.portion}>
      <p className={`font-serif ${ProfileStyles.title}`}>Deactivate Account.</p>
      {openModal && <ConfirmDeactivateModal setOpenModal={setOpenModal} />}
      <button
        onClick={() => setOpenModal((prev) => !prev)}
        className={`${ProfileStyles[`btn-profile`]} ${
          ProfileStyles["btn-danger"]
        }`}
      >
        Deactivate
      </button>
    </div>
  )
}
