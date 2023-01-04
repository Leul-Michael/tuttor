import {
  useRef,
  useState,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  MouseEvent,
} from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { BsFillFileEarmarkPdfFill } from "react-icons/bs"
import { MdOutlineClose } from "react-icons/md"
import {
  AiOutlinePauseCircle,
  AiOutlineCloseCircle,
  AiOutlinePlayCircle,
  AiOutlineCheckCircle,
} from "react-icons/ai"
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"
import app from "../../configs/firebase"
import axiosInstance from "../../axios/axios"
import useToast from "../../context/ToastContext"
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query"

export default function UploadPdf({
  setOpenUpload,
  refetch,
}: {
  setOpenUpload: Dispatch<SetStateAction<boolean>>
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<any, unknown>>
}) {
  const storage = getStorage(app)
  const { addMessage, addRedirectLink } = useToast()

  const progressRef = useRef<HTMLDivElement>(null)
  const [progessPercent, setProgressPercent] = useState(0)
  const [isUpload, setIsUpload] = useState(false)
  const pdfFileRef = useRef<HTMLInputElement>(null)
  const [resume, setResume] = useState<File | null>()

  const handleUpload = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (resume == null) return

    setIsUpload(true)
    const storageRef = ref(storage, `resumes/${resume?.name}`)

    const uploadTask = uploadBytesResumable(storageRef, resume, {
      contentType: resume.type,
    })

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        document.documentElement.style.setProperty(
          "--progess-width",
          `${progress}%`
        )
        setProgressPercent(progress)
        if (progress === 100) {
          if (pdfFileRef.current?.value != null) {
            pdfFileRef.current!.value = ""
          }
          setResume(null)
        }
      },
      (e) => {
        console.error(e)
        return
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            const res = await axiosInstance.post("/profile/resume", {
              resume: downloadURL,
            })
            addMessage(res.data.msg)
            addRedirectLink(downloadURL)
            refetch()
          } catch (e) {
            console.log(e)
            addMessage("Resume update failed, try again!")
          }
        })
      }
    )
  }

  const selectPdf: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files == null) return

    if (e.target.files[0].type !== "application/pdf")
      return addMessage("Please select a pdf file!")

    const fileSizeInKb = Math.round(e.target.files[0].size / 1024)

    if (fileSizeInKb > 1024) {
      console.log(fileSizeInKb)
      if (pdfFileRef.current?.value != null) {
        pdfFileRef.current!.value = ""
      }
      addMessage("PDF file too Big, Please select file less than 1MB!")
    } else {
      setResume(e.target.files[0])
    }
  }

  return (
    <article className={ProfileStyles.resume}>
      <div className={ProfileStyles["resume-header"]}>
        <p>Upload resume</p>
        <MdOutlineClose
          onClick={() => {
            setResume(null)
            setOpenUpload(false)
          }}
          className={ProfileStyles.icon}
        />
      </div>
      <div className={ProfileStyles["resume-input-box"]}>
        <label htmlFor="resume">
          <BsFillFileEarmarkPdfFill className={ProfileStyles["pdf-icon"]} />
          {resume != null ? (
            <button onClick={handleUpload}>Upload {resume?.name}</button>
          ) : null}
        </label>
        <input
          ref={pdfFileRef}
          onChange={selectPdf}
          type="file"
          name="resume"
          accept=".pdf"
          id="resume"
        />
      </div>
      <div
        className={`${ProfileStyles.progress} ${
          isUpload ? ProfileStyles.show : ""
        } ${progessPercent === 100 ? ProfileStyles.complete : ""}`}
      >
        {progessPercent < 100 ? (
          <>
            <p>Uploading...</p>
            <div className={ProfileStyles["progress-details"]}>
              <div
                ref={progressRef}
                className={ProfileStyles["progess-bar"]}
              ></div>
              <div className={ProfileStyles["progress-buttons"]}>
                {/* <AiOutlinePlayCircle title="Play" className={ProfileStyles.play} /> */}
                <AiOutlinePauseCircle
                  title="Pause"
                  className={ProfileStyles.play}
                />
                <AiOutlineCloseCircle
                  title="Cancle"
                  className={ProfileStyles.close}
                />
              </div>
            </div>
          </>
        ) : (
          <div className={ProfileStyles.completed}>
            <AiOutlineCheckCircle className={ProfileStyles.play} />{" "}
            <p>Completed</p>
          </div>
        )}
      </div>
    </article>
  )
}
