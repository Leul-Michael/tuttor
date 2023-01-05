import { useEffect, useState, useRef, MouseEvent } from "react"
import ToastStyles from "../../styles/Toast.module.css"
import { AiOutlineClose } from "react-icons/ai"
import useToast from "../../context/ToastContext"
import Link from "next/link"
import { useRouter } from "next/router"

export default function Toast() {
  const router = useRouter()
  const { message, addMessage, redirectLink } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (message) {
      setIsOpen(true)
    }
  }, [message])

  const resetTostState = () => {
    setIsOpen(false)
    addMessage("")
  }

  const onRedirect = () => {
    if (redirectLink) router.push(redirectLink)
    resetTostState()
  }

  const closeToast = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    resetTostState()
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
