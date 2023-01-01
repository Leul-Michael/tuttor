import { useState, MouseEventHandler, Dispatch, SetStateAction } from "react"
import Styles from "../../styles/Job.module.css"
import { FiPlusCircle } from "react-icons/fi"
import { TbPoint } from "react-icons/tb"
import { MdDeleteForever } from "react-icons/md"

export default function Requirement({
  requirements,
  setRequirements,
}: {
  requirements: string[]
  setRequirements: Dispatch<SetStateAction<string[]>>
}) {
  const [openForm, setOpenForm] = useState(false)
  const [requirement, setRequirement] = useState("")

  const addRequirement: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    if (!requirement) return
    setRequirements((prev) => [...prev, requirement])
    setRequirement("")
  }

  const removeRequirement = (idx: number) => {
    setRequirements((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <div className={Styles.portion}>
      <button
        onClick={(e) => {
          e.preventDefault()
          setOpenForm((prev) => !prev)
        }}
        className={Styles[`btn-profile`]}
      >
        <FiPlusCircle className={Styles["plus-icon"]} /> Add requirement
      </button>
      {openForm ? (
        <div className={Styles["add-form"]}>
          <input
            type="text"
            placeholder="Must be..."
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
          />
          <div className={Styles["buttons-flex"]}>
            <button
              onClick={addRequirement}
              type="submit"
              className={`p-relative ${Styles.btn} ${Styles["btn-primary"]}`}
            >
              Save
            </button>
            <button
              onClick={() => setOpenForm(false)}
              type="button"
              className={Styles.btn}
            >
              cancel
            </button>
          </div>
        </div>
      ) : null}
      <ul className={Styles["requirement-items"]}>
        {requirements.map((req: string, idx: number) => (
          <li key={idx} className={Styles["requirement-item"]}>
            <TbPoint />
            <p>{req}</p>
            <MdDeleteForever
              onClick={() => removeRequirement(idx)}
              className={Styles["requirement-btn"]}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
