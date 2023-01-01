import { useState, useEffect } from "react"

export default function useWindowsWidth() {
  const [width, setWidth] = useState<number>()

  useEffect(() => {
    setWidth(window?.innerWidth)

    function getWindowsWidth() {
      setWidth(window.innerWidth)
    }

    window.addEventListener("resize", getWindowsWidth)

    return () => {
      window.removeEventListener("resize", getWindowsWidth)
    }
  }, [width])

  return [width] as [width: number]
}
