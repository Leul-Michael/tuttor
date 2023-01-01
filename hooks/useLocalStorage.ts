import { useEffect, useState } from "react"

function getLocalValue<LocalT>(
  key: string,
  initialValue: LocalT | (() => LocalT)
) {
  if (typeof window === "undefined") return initialValue

  const jsonValue = localStorage.getItem(key)

  if (jsonValue != null) return JSON.parse(jsonValue)

  if (initialValue instanceof Function) return (initialValue as () => LocalT)()
  return initialValue
}

export default function useLocalStorage<LocalT>(
  key: string,
  initialValue: LocalT | (() => LocalT)
) {
  const [value, setValue] = useState<LocalT>(() => {
    return getLocalValue(key, initialValue)
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as [typeof value, typeof setValue]
}
