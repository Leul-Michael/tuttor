import { useEffect, useState } from "react"
import { HiMoon, HiSun } from "react-icons/hi"
import useLocalStorage from "../../hooks/useLocalStorage"

const Theme = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [darkTheme, setDarkTheme] = useLocalStorage("dark", false)

  useEffect(() => {
    !darkTheme
      ? document.body.classList.add("light-theme")
      : document.body.classList.remove("light-theme")
  }, [darkTheme])

  return (
    <li
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      className="theme"
    >
      <span className="icon">{!darkTheme ? <HiSun /> : <HiMoon />}</span> Theme
      <div className={`${isOpen ? "show" : ""} list`}>
        <div
          onClick={() => setDarkTheme(false)}
          className="list-item"
          aria-label="toggle light theme"
        >
          <HiSun /> Light
        </div>
        <div
          onClick={() => setDarkTheme(true)}
          className="list-item"
          aria-label="toggle dark theme"
        >
          <HiMoon /> Dark
        </div>
      </div>
    </li>
  )
}

export default Theme
