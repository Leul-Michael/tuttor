import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Head from "next/head"
import {
  useState,
  FormEventHandler,
  ChangeEventHandler,
  useEffect,
} from "react"
import axiosInstance from "../../axios/axios"
import Requirement from "../../components/Job/Requirement"
import Schedule from "../../components/Select/Schedule"
import { Option } from "../../components/Select/SelectCheckbox"
import SelectDropdown from "../../components/Select/SelectDropdown"
import Spinner from "../../components/Spinner"
import useToast from "../../context/ToastContext"
import { IUser } from "../../models/User"
import Styles from "../../styles/Job.module.css"
import { ACCOUNT_TYPE } from "../../types"

const NUMBER_OF_STUDENTS = [
  { key: 1, value: "1" },
  { key: 2, value: "2" },
  { key: 3, value: "3" },
  { key: 4, value: "4" },
  { key: 5, value: "5+" },
]

const TUTTOR_TYPE = [
  { key: 1, value: "In Person" },
  { key: 2, value: "Online" },
  { key: 3, value: "Both" },
]

export type DaysProps = { i: number; v: string }

export default function Create({ user }: { user: IUser }) {
  const { addMessage } = useToast()
  const [loading, setLoading] = useState(false)
  const [numberOfStudents, setNumberOfStudents] = useState(
    NUMBER_OF_STUDENTS[0]
  )
  const [tuttorType, setTuttorType] = useState(TUTTOR_TYPE[0])
  const selectNumberOfStudents = (n: Option) => {
    setNumberOfStudents(n)
  }
  const selectTuttorType = (n: Option) => {
    setTuttorType(n)
  }
  const [days, setDays] = useState<DaysProps[]>([])

  const [startingPrice, setStartingPrice] = useState<string>("50")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [requirements, setRequirements] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    budget: `${startingPrice} ${maxPrice ? maxPrice : ""}`,
    location: "",
    desc: "",
  })

  const canSave = [
    formData.title,
    formData.budget,
    formData.location,
    formData.desc,
  ].every(Boolean)

  const updateFormFields: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const resetFormValues = () => {
    setFormData({
      title: "",
      budget: "",
      location: "",
      desc: "",
    })
    setRequirements([])
    setNumberOfStudents(NUMBER_OF_STUDENTS[0])
    setTuttorType(TUTTOR_TYPE[0])
    setStartingPrice("50")
    setMaxPrice("")
    setDays([])
  }

  useEffect(() => {
    if (maxPrice) {
      setFormData((prev) => {
        return { ...prev, budget: `${startingPrice} - ${maxPrice}` }
      })
    } else {
      setFormData((prev) => {
        return { ...prev, budget: startingPrice }
      })
    }
  }, [startingPrice, maxPrice])

  const addNewJob: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    if (days.length <= 0) {
      return addMessage("Please select schedule!")
    }

    if (!canSave) {
      return addMessage("Please add all fields!")
    }

    try {
      setLoading(true)
      const res = await axiosInstance.post("/jobs", {
        ...formData,
        tutorType: tuttorType.value,
        numberOfStudents: numberOfStudents.value,
        requirements,
        schedule: days.map((d) => d.v),
      })

      addMessage(res.data.msg, `/jobs/${res.data.id}`)
      resetFormValues()
    } catch (e: any) {
      addMessage(`Error: ${e.response.data.msg || e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Create a new job</title>
        <meta
          name="description"
          content="Create a job and find someone that fits your need."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className={Styles["create-job"]}>
        <form onSubmit={addNewJob} className={Styles["create-job__form"]}>
          <h1 className={`font-serif ${Styles["create-job__title"]}`}>
            Create new job
          </h1>
          <div>
            <p className={Styles["create-job__info"]}>
              What kind of tutor are you looking for? fill in the form below
              post your request.
            </p>
            <p className={Styles["create-job__email"]}>
              User <span className={Styles["clr-accent"]}>{user?.email}</span>
            </p>
          </div>

          <div
            className={`${Styles["create-job__input-box"]} ${Styles.border}`}
          >
            <label htmlFor="title">
              Title <span>*</span>
            </label>
            <span>
              Describe the person you&#39;re looking for, e.g. Grade 12 tutor
            </span>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="title"
              value={formData.title}
              onChange={updateFormFields}
              required
            />
          </div>
          <div className={Styles["create-job__input-box"]}>
            <label htmlFor="title">
              Schedule <span>*</span>
            </label>
            <span>Select one or more days from the week.</span>
            <Schedule days={days} setDays={setDays} />
          </div>
          <div
            className={`${Styles["create-job__input-box"]} ${Styles.border}`}
          >
            <label htmlFor="budget">
              Budget (per hour in Birr) <span>*</span>
            </label>
            <span>
              Price range you&#39;re looking to pay per hour, e.g. 150 - 300. if
              you&#39;re looking for fixed price set the first input only.
            </span>
            <div className={Styles["price-range"]}>
              <input
                type="number"
                name="budget"
                id="budget"
                min={50}
                max={10000}
                value={startingPrice || 50}
                onChange={(e) => setStartingPrice(e.target.value)}
                required
              />
              <span>-</span>
              <input
                type="number"
                name="budget"
                id="budget"
                min={startingPrice}
                max={10000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
          <div
            className={`${Styles["create-job__input-box-flex"]} ${Styles.border}`}
          >
            <div className={Styles["create-job__select"]}>
              <label htmlFor="numberOfStudents">
                Number of Students <span>*</span>
              </label>
              <span>Number of students that need tutoring.</span>
              <SelectDropdown
                options={NUMBER_OF_STUDENTS}
                value={numberOfStudents}
                onChange={selectNumberOfStudents}
              />
            </div>
            <div className={Styles["create-job__select"]}>
              <label htmlFor="tutorType">
                Type <span>*</span>
              </label>
              <span>Is the tutor online or in person.</span>
              <SelectDropdown
                options={TUTTOR_TYPE}
                value={tuttorType}
                onChange={selectTuttorType}
              />
            </div>
          </div>
          <div
            className={`${Styles["create-job__input-box"]} ${Styles.border}`}
          >
            <label htmlFor="location">
              Location <span>*</span>
            </label>
            <span>
              This will help tutors find this job based on location on search.
            </span>
            <input
              type="text"
              placeholder="e.g. Gerji, Addis Ababa"
              id="location"
              name="location"
              value={formData.location}
              onChange={updateFormFields}
              required
            />
          </div>
          <div
            className={`${Styles["create-job__input-box-lg"]} ${Styles["text-box-border"]}`}
          >
            <label htmlFor="desc">
              Description <span>*</span>
            </label>
            <span>
              Describe what you want in details. e.g. The subjects included, the
              time?
            </span>
            <textarea
              name="desc"
              id="desc"
              placeholder="description..."
              value={formData.desc}
              onChange={updateFormFields}
              maxLength={300}
              required
            ></textarea>
            <div className={Styles["max-chars-sm"]}>
              {formData.desc.length} / <span>250</span>
            </div>
          </div>
          <div className={Styles["create-job__input-box"]}>
            <label htmlFor="">Requirements</label>
            <span>e.g. Must have proficient skill in coding.</span>
            <Requirement
              requirements={requirements}
              setRequirements={setRequirements}
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className={`p-relative ${loading ? Styles["loading-btn"] : ""} ${
              Styles.btn
            } ${Styles["btn-primary"]}`}
          >
            {loading ? <Spinner /> : "Create Job"}
          </button>
        </form>
      </section>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session || session.user.role !== ACCOUNT_TYPE.EMPLOYER) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: session.user,
    },
  }
}
