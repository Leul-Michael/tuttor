import { useState, MouseEventHandler } from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { FiPlusCircle } from "react-icons/fi"
import { MdDeleteForever } from "react-icons/md"
import { VscFilePdf } from "react-icons/vsc"
import UploadPdf from "./UploadPdf"
import { useQuery } from "@tanstack/react-query"
import axiosInstance from "../../axios/axios"
import useToast from "../../context/ToastContext"
import app from "../../configs/firebase"
import { deleteObject, getStorage, ref } from "firebase/storage"
import Spinner from "../Spinner"

export default function Resume() {
  const storage = getStorage(app)

  const { addMessage } = useToast()
  const [openUpload, setOpenUpload] = useState(false)
  const [loading, setLoading] = useState(false)

  const { data, isFetching, isRefetching, isLoading, refetch } = useQuery({
    queryKey: ["resume"],
    queryFn: async () => {
      const res = await axiosInstance.get("/profile/resume")
      return res.data
    },
  })

  const removeResume: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()

    if (!data) return

    try {
      setLoading(true)
      const pdfRef = ref(storage, data)

      await deleteObject(pdfRef)
      const res = await axiosInstance.delete("/profile/resume")
      addMessage(res.data.msg)
      refetch()
    } catch (e) {
      console.log(e)
      addMessage("Failed to remove pdf, try again!")
    } finally {
      setLoading(false)
    }
  }

  const checkLoading = isLoading || isRefetching || isFetching || loading

  return (
    <div className={`${ProfileStyles.portion}`}>
      {openUpload && (
        <UploadPdf
          refetch={refetch}
          setOpenUpload={setOpenUpload}
          data={data}
        />
      )}
      <p className={`font-serif ${ProfileStyles.title}`}>Resume</p>
      <div className={`p-relative n-left ${ProfileStyles["pdf-portion"]}`}>
        {checkLoading ? (
          <Spinner />
        ) : data ? (
          <>
            <a
              className={ProfileStyles["current-pdf"]}
              target="_blank"
              href={data}
              rel="noopener noreferrer"
            >
              <VscFilePdf
                title="your resume"
                className={ProfileStyles["pdf-icon"]}
              />
            </a>
            <div className={ProfileStyles["buttons-flex"]}>
              <button
                onClick={() => setOpenUpload((prev) => !prev)}
                className={`${ProfileStyles[`btn-profile`]} ${
                  ProfileStyles["btn-sm"]
                }`}
              >
                <FiPlusCircle className={ProfileStyles.icon} />
              </button>
              <button
                onClick={removeResume}
                className={`${ProfileStyles[`btn-profile`]} ${
                  ProfileStyles["btn-sm"]
                } ${ProfileStyles["btn-danger"]}`}
              >
                <MdDeleteForever className={ProfileStyles.icon} />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setOpenUpload((prev) => !prev)}
            className={ProfileStyles[`btn-profile`]}
          >
            <FiPlusCircle className={ProfileStyles.icon} /> Attach Resume
          </button>
        )}
      </div>
    </div>
  )
}
