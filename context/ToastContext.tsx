import { createContext, ReactElement, useContext, useState } from "react"

interface ToastContextProps {
  message: string
  addMessage: (msg: string, link?: string) => void
  redirectLink?: string
}

const ToastContext = createContext({} as ToastContextProps)

export default function useToast() {
  return useContext(ToastContext)
}

export function ToastContextProvider({ children }: { children: ReactElement }) {
  const [message, setMessage] = useState("")
  const [redirectLink, setRedirectLink] = useState("")

  function addMessage(msg: string, link?: string) {
    setMessage(msg)
    link ? setRedirectLink(link) : setRedirectLink("")
  }

  return (
    <ToastContext.Provider value={{ message, addMessage, redirectLink }}>
      {children}
    </ToastContext.Provider>
  )
}
