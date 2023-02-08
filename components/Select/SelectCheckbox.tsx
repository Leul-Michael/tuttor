import { MouseEvent, useRef, useState } from "react"
import SelectStyles from "../../styles/Select.module.css"

export type Option = {
  key: number
  value: string
  actualV?: string
}

export type SelectProps = {
  options: Option[]
  values: Option[]
  onChange: (value: Option) => void
  name: string
}

export default function SelectCheckbox({
  options,
  values,
  onChange,
  name,
}: SelectProps) {
  const optionsRef = useRef<HTMLUListElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const areAllSelected = () => {
    return options.every((o) => {
      return values.includes(o)
    })
  }

  const displaySelected = () => {
    const selectedString = options.filter((o) => {
      return values.includes(o)
    })

    if (selectedString.length === 1) {
      return `${selectedString[0].value}`
    } else if (selectedString.length <= 0) {
      return `Not selected`
    } else {
      return `${selectedString[0].value} +${selectedString.length - 1} `
    }
  }

  const handleToggle = (e: MouseEvent<HTMLDivElement>) => {
    if (
      e.target === optionsRef.current ||
      optionsRef.current?.contains(e.target as any)
    )
      return
    setIsOpen((prev) => !prev)
  }

  return (
    <div
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
      className={SelectStyles.container}
      onClick={(e) => handleToggle(e)}
    >
      <div className={SelectStyles["select-display"]}>
        {areAllSelected() ? name : displaySelected()}
      </div>
      <div className={SelectStyles["arrow-down"]}></div>

      <ul
        ref={optionsRef}
        className={`${SelectStyles.options} ${isOpen ? SelectStyles.show : ""}`}
      >
        {options.map((o) => (
          <li key={o.key} onClick={() => onChange(o)}>
            <input
              checked={values.includes(o)}
              type="checkbox"
              id={o.value}
              onChange={(e) => {
                e.preventDefault()
              }}
            />
            <label htmlFor={o.value}>{o.value}</label>
          </li>
        ))}
      </ul>
    </div>
  )
}
