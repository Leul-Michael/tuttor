import { useRef, useState, Dispatch, SetStateAction } from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { BsFillFileEarmarkPdfFill } from "react-icons/bs"
import { MdOutlineClose } from "react-icons/md"
import {
  AiOutlinePauseCircle,
  AiOutlineCloseCircle,
  AiOutlinePlayCircle,
} from "react-icons/ai"

export default function UploadPdf({
  setOpenUpload,
}: {
  setOpenUpload: Dispatch<SetStateAction<boolean>>
}) {
  const pdfFileRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState("")

  return (
    <article className={ProfileStyles.resume}>
      <div className={ProfileStyles["resume-header"]}>
        <p>Upload resume</p>
        <MdOutlineClose
          onClick={() => setOpenUpload(false)}
          className={ProfileStyles.icon}
        />
      </div>
      <div className={ProfileStyles["resume-input-box"]}>
        <label htmlFor="resume">
          <BsFillFileEarmarkPdfFill className={ProfileStyles["pdf-icon"]} />
          <span>{fileName}</span>
        </label>
        <input
          ref={pdfFileRef}
          onChange={(e) =>
            setFileName(e.target.files != null ? e.target.files[0]?.name : "")
          }
          type="file"
          name="resume"
          accept=".pdf"
          id="resume"
        />
      </div>
      <div className={ProfileStyles.progress}>
        <p>uploading...</p>
        <div className={ProfileStyles["progress-details"]}>
          <div className={ProfileStyles["progess-bar"]}></div>
          <div className={ProfileStyles["progress-buttons"]}>
            <AiOutlinePlayCircle title="Play" />
            <AiOutlinePauseCircle title="Pause" />
            <AiOutlineCloseCircle title="Cancle" />
          </div>
        </div>
      </div>
    </article>
  )
}
