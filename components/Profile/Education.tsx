import { useState, FormEvent, MouseEvent } from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { FiPlusCircle } from "react-icons/fi"
import { MdDeleteForever } from "react-icons/md"
import axiosInstance from "../../axios/axios"
import { Option } from "../Select/SelectCheckbox"
import SelectDropdown from "../Select/SelectDropdown"
import Spinner from "../Spinner"
import { useQuery } from "@tanstack/react-query"

export interface EduProps {
  _id: string
  level: string
  field: string
  school: string
}

const LEVEL_OPTIONS = [
  { key: 1, value: "Bachelor of Science" },
  { key: 2, value: "Bachelor of Arts" },
  { key: 3, value: "Master of Arts" },
  { key: 4, value: "Master of Science." },
  { key: 5, value: "Doctor of Medicine" },
  { key: 6, value: "Doctor of Law" },
]

export default function Education() {
  const [loading, setLoading] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [educationForm, setEducationForm] = useState({
    field: "",
    school: "",
    sDate: "",
    eDate: "",
  })
  const [level, setlevel] = useState(LEVEL_OPTIONS[0])

  const onLevelChange = (o: Option) => {
    setlevel(o)
  }

  const { data, isFetching, isRefetching, isLoading, refetch } = useQuery({
    queryKey: ["educs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/profile/education")
      return res.data
    },
  })

  const checkLoading = isLoading || isRefetching || isFetching || loading

  const addEducation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (checkLoading) return

    if (!level.value || !educationForm.field || !educationForm.school) return

    try {
      setLoading(true)
      await axiosInstance.post("/profile/education", {
        level: level.value,
        field: educationForm.field,
        school: educationForm.school,
      })

      setEducationForm({
        field: "",
        school: "",
        sDate: "",
        eDate: "",
      })
      refetch()
    } finally {
      setLoading(false)
    }
  }

  const removeEducation = async (e: MouseEvent<HTMLDivElement>, id: string) => {
    e.preventDefault()

    try {
      setLoading(true)
      await axiosInstance.delete("/profile/education", {
        data: { eduId: id },
      })
      refetch()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={ProfileStyles.portion}>
      <p className={`font-serif ${ProfileStyles.title}`}>Education</p>
      <div
        className={`p-relative n-left ${ProfileStyles["subjects-list"]} ${
          checkLoading ? ProfileStyles.loading : ""
        }`}
      >
        {checkLoading ? (
          <Spinner />
        ) : (
          data?.map((edu: EduProps) => (
            <div
              key={edu?._id}
              onClick={(e) => removeEducation(e, edu._id)}
              className={ProfileStyles.subject}
            >
              <div className={ProfileStyles["subject-field"]}>
                <span>{edu.level}</span>
                <p>{edu.field}</p>
              </div>
              <MdDeleteForever className={ProfileStyles.delete} />
            </div>
          ))
        )}
      </div>
      <button
        onClick={() => setOpenForm((prev) => !prev)}
        className={ProfileStyles[`btn-profile`]}
      >
        <FiPlusCircle className={ProfileStyles.icon} /> Add Education
      </button>

      {openForm ? (
        <form onSubmit={addEducation} className={ProfileStyles["add-form"]}>
          <div className={ProfileStyles["add-form__flex"]}>
            <SelectDropdown
              options={LEVEL_OPTIONS}
              value={level}
              onChange={onLevelChange}
            />
            <div className={ProfileStyles["input-box-flex"]}>
              <input
                type="text"
                placeholder="Field of study"
                value={educationForm.field}
                onChange={(e) =>
                  setEducationForm((prev) => ({
                    ...prev,
                    field: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className={ProfileStyles["input-box-flex"]}>
            <input
              type="text"
              placeholder="School"
              value={educationForm.school}
              onChange={(e) =>
                setEducationForm((prev) => ({
                  ...prev,
                  school: e.target.value,
                }))
              }
            />
          </div>
          <div className={ProfileStyles["buttons-flex"]}>
            <button
              disabled={checkLoading}
              type="submit"
              className={`p-relative ${ProfileStyles.btn} ${ProfileStyles["btn-primary"]}`}
            >
              {checkLoading ? "loading..." : "Add education"}
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
