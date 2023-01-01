import { MouseEvent, useState, Dispatch, SetStateAction } from "react"
import SelectStyles from "../../styles/Select.module.css"

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

interface ScheduleProps {
  days: string[]
  setDays: Dispatch<SetStateAction<string[]>>
}

export default function Schedule({ days, setDays }: ScheduleProps) {
  const [isOpen, setIsOpen] = useState(false)

  const isSelected = (val: string) => {
    return days.includes(val)
  }

  const addValue = (d: string) => {
    if (days.includes(d)) return
    setDays((prev) => [...prev, d])
  }

  const removeValue = (e: MouseEvent<HTMLButtonElement>, passedVal: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDays((prev) => {
      return prev.filter((val) => val !== passedVal)
    })
  }

  return (
    <div
      tabIndex={0}
      onClick={() => setIsOpen((prev) => !prev)}
      onBlur={() => setIsOpen(false)}
      className={`${SelectStyles.container} ${SelectStyles["schedule"]}`}
    >
      <div className={SelectStyles["schedule-display"]}>
        {days.length
          ? days.map((v) => (
              <button
                onClick={(e) => removeValue(e, v)}
                key={v}
                className={SelectStyles.btn}
              >
                {v} <span>&#10006;</span>
              </button>
            ))
          : "Not selected"}
      </div>
      <div className={SelectStyles["arrow-down"]}></div>
      <ul
        className={`${SelectStyles.options} ${isOpen ? SelectStyles.show : ""}`}
      >
        {DAYS.map((d) => (
          <li
            onClick={() => addValue(d)}
            key={d}
            className={isSelected(d) ? SelectStyles.selected : ""}
          >
            {d}
          </li>
        ))}
      </ul>
    </div>
  )
}
