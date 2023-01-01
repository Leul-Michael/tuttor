import { useRef, useState, FormEvent, MouseEvent, useEffect } from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { FiPlusCircle } from "react-icons/fi"
import { MdDeleteForever } from "react-icons/md"
import axiosInstance from "../../axios/axios"
import { Option } from "../Select/SelectCheckbox"
import SelectDropdown from "../Select/SelectDropdown"
import Spinner from "../Spinner"

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
  const efffectRun = useRef(false)
  const [openForm, setOpenForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [educations, setEducations] = useState([])
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

  useEffect(() => {
    const controller = new AbortController()

    if (efffectRun.current === true) {
      const getUserEducations = async () => {
        try {
          setLoading(true)
          const res = await axiosInstance.get("/profile/education", {
            signal: controller.signal,
          })
          setEducations(res.data)
        } finally {
          setLoading(false)
        }
      }
      getUserEducations()
    }

    return () => {
      efffectRun.current = true
      controller.abort()
    }
  }, [])

  const addEducation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!level.value || !educationForm.field || !educationForm.school) return

    try {
      setLoading(true)
      const res = await axiosInstance.post("/profile/education", {
        level: level.value,
        field: educationForm.field,
        school: educationForm.school,
      })

      setEducations(res.data)
      setEducationForm({
        field: "",
        school: "",
        sDate: "",
        eDate: "",
      })
    } finally {
      setLoading(false)
    }
  }

  const removeEducation = async (e: MouseEvent<HTMLDivElement>, id: string) => {
    e.preventDefault()

    try {
      setLoading(true)
      const res = await axiosInstance.delete("/profile/education", {
        data: { eduId: id },
      })
      setEducations(res.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={ProfileStyles.portion}>
      <p className={`font-serif ${ProfileStyles.title}`}>Education</p>
      {educations.length ? (
        <div
          className={`p-relative n-left ${ProfileStyles["subjects-list"]} ${
            loading ? ProfileStyles.loading : ""
          }`}
        >
          {loading ? (
            <Spinner />
          ) : (
            educations.map((edu: EduProps) => (
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
      ) : null}
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
              disabled={loading}
              type="submit"
              className={`p-relative ${ProfileStyles.btn} ${ProfileStyles["btn-primary"]}`}
            >
              {loading ? "loading..." : "Add education"}
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
