import { useRef, useState, MouseEvent } from "react"
import { Option } from "./SelectCheckbox"
import SelectStyles from "../../styles/Select.module.css"

interface SelectDropdownProps {
  options: Option[]
  value: Option
  onChange: (value: Option) => void
}

export default function SelectDropdown({
  options,
  value,
  onChange,
}: SelectDropdownProps) {
  const optionsRef = useRef<HTMLUListElement>(null)
  const [isOpen, setIsOpen] = useState(false)
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
      <div className={SelectStyles["select-display"]}>{value.value}</div>
      <div className={SelectStyles["arrow-down"]}></div>

      <ul
        ref={optionsRef}
        className={`${SelectStyles["dropdown-options"]} ${
          isOpen ? SelectStyles.show : ""
        }`}
      >
        {options.map((o) => (
          <li
            key={o.key}
            onClick={() => {
              onChange(o)
              setIsOpen(false)
            }}
          >
            <span>{o.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
