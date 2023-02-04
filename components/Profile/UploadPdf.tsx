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
import { AiOutlineCloseCircle, AiOutlineCheckCircle } from "react-icons/ai"
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTask,
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
  const { addMessage } = useToast()

  const uploadTaskRef = useRef<UploadTask>()
  const progressRef = useRef<HTMLDivElement>(null)
  const [progessPercent, setProgressPercent] = useState(0)
  const [isUpload, setIsUpload] = useState(false)
  const [cancel, setCancel] = useState(false)
  const pdfFileRef = useRef<HTMLInputElement>(null)
  const [resume, setResume] = useState<File | null>()

  const handleUpload = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (resume == null) return

    setIsUpload(true)

    const storageRef = ref(
      storage,
      `resumes/${resume?.name.toLowerCase() + Date.now()}`
    )

    uploadTaskRef.current = uploadBytesResumable(storageRef, resume, {
      contentType: resume.type,
    })

    uploadTaskRef.current.on(
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

        switch (snapshot.state) {
          case "canceled":
            setCancel(true)
            break
          default:
            setCancel(false)
        }
      },
      (e) => {
        console.log(e.message)

        switch (e.code) {
          case "storage/canceled":
            setCancel(true)
            break
          default:
            setCancel(false)
        }
      },
      () => {
        if (uploadTaskRef.current?.snapshot?.ref === undefined) return
        getDownloadURL(uploadTaskRef.current.snapshot.ref).then(
          async (downloadURL) => {
            try {
              const res = await axiosInstance.post("/profile/resume", {
                resume: downloadURL,
              })
              addMessage(res.data.msg, downloadURL)
              refetch()
              setOpenUpload(false)
            } catch (e) {
              console.log(e)
              addMessage("Resume update failed, try again!")
            }
          }
        )
      }
    )
  }

  const onCancel = () => {
    uploadTaskRef.current?.cancel()
  }

  const selectPdf: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files == null) return

    if (e.target.files[0]?.type !== "application/pdf")
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
          isUpload && !cancel ? ProfileStyles.show : ""
        } ${progessPercent === 100 && !cancel ? ProfileStyles.complete : ""}`}
      >
        {progessPercent < 100 && !cancel ? (
          <>
            <p>Uploading...</p>
            <div className={ProfileStyles["progress-details"]}>
              <div
                ref={progressRef}
                className={ProfileStyles["progess-bar"]}
              ></div>
              <div className={ProfileStyles["progress-buttons"]}>
                <AiOutlineCloseCircle
                  onClick={onCancel}
                  title="Cancle"
                  className={ProfileStyles.close}
                />
              </div>
            </div>
          </>
        ) : progessPercent === 100 && !cancel ? (
          <div className={ProfileStyles.completed}>
            <AiOutlineCheckCircle className={ProfileStyles.play} />{" "}
            <p>Completed</p>
          </div>
        ) : null}
      </div>
    </article>
  )
}
