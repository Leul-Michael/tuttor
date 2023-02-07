import { useEffect, useState, useCallback, MouseEvent } from "react"
import ToastStyles from "../../styles/Toast.module.css"
import { AiOutlineClose } from "react-icons/ai"
import useToast from "../../context/ToastContext"
import { useRouter } from "next/router"

export default function Toast() {
  const router = useRouter()
  const { message, addMessage, redirectLink } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const resetToastState = useCallback(() => {
    setIsOpen(false)
    addMessage("")
  }, [addMessage])

  useEffect(() => {
    if (message) {
      setIsOpen(true)
    }
  }, [message])

  useEffect(() => {
    const handleChange = () => {
      resetToastState()
    }

    router.events.on("routeChangeStart", handleChange)
    return () => {
      router.events.off("routeChangeStart", handleChange)
    }
  }, [router.events, resetToastState])

  const onRedirect = () => {
    if (redirectLink) router.push(redirectLink)
    resetToastState()
  }

  const closeToast = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    resetToastState()
  }

  return (
    <div className={ToastStyles.toast}>
      <div
        className={`${ToastStyles["toast-msg"]} ${
          isOpen ? ToastStyles.show : ""
        }`}
      >
        <div className={`container ${ToastStyles.container}`}>
          <p>
            {message} {redirectLink && <span onClick={onRedirect}>--view</span>}
          </p>
          <button onClick={closeToast} className={ToastStyles.btn}>
            <AiOutlineClose />
          </button>
        </div>
      </div>
    </div>
  )
}
