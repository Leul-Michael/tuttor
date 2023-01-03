import { useState } from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { FiPlusCircle } from "react-icons/fi"
import UploadPdf from "./UploadPdf"

export default function Resume() {
  const [openUpload, setOpenUpload] = useState(false)
  return (
    <div className={`${ProfileStyles.portion}`}>
      {openUpload && <UploadPdf setOpenUpload={setOpenUpload} />}
      <p className={`font-serif ${ProfileStyles.title}`}>Resume</p>
      <button
        onClick={() => setOpenUpload((prev) => !prev)}
        className={ProfileStyles[`btn-profile`]}
      >
        <FiPlusCircle className={ProfileStyles.icon} /> Attach Resume
      </button>
    </div>
  )
}
