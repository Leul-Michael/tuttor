import { MouseEvent, useState, Dispatch, SetStateAction } from "react"
import { DaysProps } from "../../pages/jobs/create"
import SelectStyles from "../../styles/Select.module.css"

const DAYS = [
  { i: 1, v: "Monday" },
  { i: 2, v: "Tuesday" },
  { i: 3, v: "Wednesday" },
  { i: 4, v: "Thursday" },
  { i: 5, v: "Friday" },
  { i: 6, v: "Saturday" },
  { i: 7, v: "Sunday" },
]

interface ScheduleProps {
  days: DaysProps[]
  setDays: Dispatch<SetStateAction<DaysProps[]>>
}

export default function Schedule({ days, setDays }: ScheduleProps) {
  const [isOpen, setIsOpen] = useState(false)

  const isSelected = (val: DaysProps) => {
    return days.includes(val)
  }

  const addValue = (d: DaysProps) => {
    if (days.includes(d)) return
    setDays((prev) => [...prev, d])
  }

  const removeValue = (
    e: MouseEvent<HTMLButtonElement>,
    passedVal: DaysProps
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setDays((prev) => {
      return prev.filter((val) => val.i !== passedVal.i)
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
          ? days
              .sort((a: any, b: any) => a.i - b.i)
              .map((v) => (
                <button
                  onClick={(e) => removeValue(e, v)}
                  key={v.i}
                  className={SelectStyles.btn}
                >
                  {v.v} <span>&#10006;</span>
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
            key={d.i}
            className={isSelected(d) ? SelectStyles.selected : ""}
          >
            {d.v}
          </li>
        ))}
      </ul>
    </div>
  )
}
