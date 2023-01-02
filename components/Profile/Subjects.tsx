import { useState, FormEvent, MouseEvent } from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { FiPlusCircle } from "react-icons/fi"
import { MdDeleteForever } from "react-icons/md"
import axiosInstance from "../../axios/axios"
import Spinner from "../Spinner"
import { useQuery } from "@tanstack/react-query"

export default function Subjects() {
  const [loading, setLoading] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [subject, setSubject] = useState("")

  const { data, isFetching, isRefetching, isLoading, refetch } = useQuery({
    queryKey: ["subjs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/profile/subject")
      return res.data
    },
  })

  const checkLoading = isLoading || isRefetching || isFetching || loading

  const removeSubject = async (
    e: MouseEvent<HTMLDivElement>,
    subject: string
  ) => {
    e.preventDefault()

    try {
      setLoading(true)
      await axiosInstance.delete("/profile/subject", {
        data: { subject: subject.toLowerCase() },
      })
      refetch()
    } finally {
      setLoading(false)
    }
  }

  const addSubject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setLoading(true)
      await axiosInstance.post("/profile/subject", {
        subject: subject.toLowerCase(),
      })

      setSubject("")
      refetch()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={ProfileStyles.portion}>
      <p className={`font-serif ${ProfileStyles.title}`}>
        Subjects you prioritize.
      </p>
      <div
        className={`p-relative n-left ${ProfileStyles["subjects-list"]} ${
          checkLoading ? ProfileStyles.loading : ""
        }`}
      >
        {checkLoading ? (
          <Spinner />
        ) : (
          data?.map((subject: string, idx: number) => (
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
              disabled={checkLoading}
              type="submit"
              className={`${ProfileStyles.btn} ${ProfileStyles["btn-primary"]}`}
            >
              {checkLoading ? "loading..." : "Save"}
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
