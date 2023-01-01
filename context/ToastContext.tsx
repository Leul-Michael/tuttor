import { createContext, ReactElement, useContext, useState } from "react"

interface ToastContextProps {
  message: string
  addMessage: (msg: string) => void
  redirectLink?: string
  addRedirectLink: (link: string) => void
}

const ToastContext = createContext({} as ToastContextProps)

export default function useToast() {
  return useContext(ToastContext)
}

export function ToastContextProvider({ children }: { children: ReactElement }) {
  const [message, setMessage] = useState("")
  const [redirectLink, setRedirectLink] = useState("")

  function addMessage(msg: string) {
    setMessage(msg)
  }
  function addRedirectLink(link: string) {
    setRedirectLink(link)
  }

  return (
    <ToastContext.Provider
      value={{ message, addMessage, redirectLink, addRedirectLink }}
    >
      {children}
    </ToastContext.Provider>
  )
}
