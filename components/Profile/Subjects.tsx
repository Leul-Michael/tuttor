import { useState, FormEvent, useEffect, MouseEvent, useRef } from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { FiPlusCircle } from "react-icons/fi"
import { MdDeleteForever } from "react-icons/md"
import axiosInstance from "../../axios/axios"
import Spinner from "../Spinner"

export default function Subjects() {
  const efffectRun = useRef(false)
  const [openForm, setOpenForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState([])
  const [subject, setSubject] = useState("")

  useEffect(() => {
    const controller = new AbortController()

    if (efffectRun.current === true) {
      const getUserSubjects = async () => {
        try {
          setLoading(true)
          const res = await axiosInstance.get("/profile/subject", {
            signal: controller.signal,
          })
          setSubjects(res.data)
        } finally {
          setLoading(false)
        }
      }
      getUserSubjects()
    }

    return () => {
      efffectRun.current = true
      controller.abort()
    }
  }, [])

  const removeSubject = async (
    e: MouseEvent<HTMLDivElement>,
    subject: string
  ) => {
    e.preventDefault()

    try {
      setLoading(true)
      const res = await axiosInstance.delete("/profile/subject", {
        data: { subject: subject.toLowerCase() },
      })
      setSubjects(res.data)
    } finally {
      setLoading(false)
    }
  }

  const addSubject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!subject) return

    try {
      setLoading(true)
      const res = await axiosInstance.post("/profile/subject", {
        subject: subject.toLowerCase(),
      })

      setSubject("")
      setSubjects(res.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={ProfileStyles.portion}>
      <p className={`font-serif ${ProfileStyles.title}`}>
        Subjects you prioritize.
      </p>
      {subjects.length ? (
        <div
          className={`p-relative n-left ${ProfileStyles["subjects-list"]} ${
            loading ? ProfileStyles.loading : ""
          }`}
        >
          {loading ? (
            <Spinner />
          ) : (
            subjects.map((subject, idx) => (
              <div
                key={idx}
                onClick={(e) => removeSubject(e, subject)}
                className={ProfileStyles.subject}
              >
                {subject} <MdDeleteForever className={ProfileStyles.delete} />
              </div>
            ))
          )}
        </div>
      ) : null}
      <button
        onClick={() => setOpenForm((prev) => !prev)}
        className={ProfileStyles[`btn-profile`]}
      >
        <FiPlusCircle className={ProfileStyles.icon} /> Add Subject
      </button>
      {openForm ? (
        <form onSubmit={addSubject} className={ProfileStyles["add-form"]}>
          <div className={ProfileStyles["input-box-flex"]}>
            <input
              type="text"
              name=""
              id=""
              placeholder="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className={ProfileStyles["buttons-flex"]}>
            <button
              disabled={loading}
              type="submit"
              className={`${ProfileStyles.btn} ${ProfileStyles["btn-primary"]}`}
            >
              {loading ? "loading..." : "Save"}
            </button>
            <button
              onClick={() => setOpenForm(false)}
              type="button"
              className={ProfileStyles.btn}
            >
              cancel
            </button>
          </div>
        </form>
      ) : null}
    </div>
  )
}
