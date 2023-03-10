import Link from "next/link"
import { useState, ChangeEvent, FormEvent, useEffect } from "react"
import AuthStyles from "../../styles/Auth.module.css"
import { BiHide, BiShowAlt } from "react-icons/bi"
import Spinner from "../../components/Spinner"
import useRegister from "../../hooks/useRegister"
import Message from "../../components/Messages/Message"
import { ACCOUNT_TYPE, msgType } from "../../types"
import { useRouter } from "next/router"
import useToast from "../../context/ToastContext"
import AccoutType from "../../components/Register/AccoutType"
import Head from "next/head"
import { useSession } from "next-auth/react"

export const validateEmail = (inputEmail: string) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(inputEmail)) {
    return true
  }
  return false
}

export default function Register() {
  const session = useSession()
  const router = useRouter()
  const [accountType, setAccountType] = useState<ACCOUNT_TYPE>()
  const { addMessage } = useToast()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [formData, setFromData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
  })
  const [errorMsg, setErrorMsg] = useState({
    type: msgType.ERROR,
    msg: "",
  })
  const [register, isLoading] = useRegister()

  const { name, email, password, location } = formData

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    setFromData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg({ type: msgType.ERROR, msg: "" })

    if (!accountType)
      return setErrorMsg({
        type: msgType.ERROR,
        msg: "Select account type first.",
      })

    if (!validateEmail(email)) {
      return setErrorMsg({
        type: msgType.ERROR,
        msg: "Please input valid email.",
      })
    }

    if (password.length < 6) {
      return setErrorMsg({
        type: msgType.ERROR,
        msg: "Password must be greater than 6 chrs.",
      })
    }

    try {
      const data: any = await register({ ...formData, role: accountType! })
      if (data.name) {
        addMessage(`Registered successfully as ${data?.name}, Login please!`)

        router.push("/auth/login")
        setFromData({
          name: "",
          email: "",
          password: "",
          location: "",
        })
      }
    } catch (e: any) {
      setErrorMsg({ type: msgType.ERROR, msg: e.message })
    }
  }

  useEffect(() => {
    if (session.data?.user) {
      router.push("/")
    }
  }, [session.data?.user, router])

  return (
    <>
      <Head>
        <title>Register a tuttor account</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className={AuthStyles.container}>
        {!accountType ? (
          <AccoutType setAccountType={setAccountType} />
        ) : (
          <>
            <div className={AuthStyles.header}>
              <div className={AuthStyles.logo}>
                <h1 className="font-serif">Tuttor.</h1>
              </div>
            </div>
            <form onSubmit={handleSubmit} className={AuthStyles.form}>
              {errorMsg.msg ? (
                <Message type={errorMsg.type} msg={errorMsg.msg} />
              ) : null}
              <p className={AuthStyles["account-type"]}>
                Create new account as <span>{accountType}</span> --{" "}
                <span onClick={() => setAccountType(undefined)}>change</span>
              </p>
              <div className={AuthStyles["input-box"]}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={handleChange}
                  value={name}
                  required
                />
                <label htmlFor="name">full name</label>
              </div>
              <div className={AuthStyles["input-box"]}>
                <input
                  type="text"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  value={email}
                  required
                />
                <label htmlFor="email">email</label>
              </div>
              <div className={AuthStyles["input-box"]}>
                <input
                  type="text"
                  id="location"
                  name="location"
                  onChange={handleChange}
                  value={location}
                  required
                />
                <label htmlFor="email">location</label>
              </div>
              <div className={AuthStyles["input-box"]}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  onChange={handleChange}
                  value={password}
                  required
                />
                <label htmlFor="password">password</label>
                {password.length > 0 ? (
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={AuthStyles.show}
                  >
                    {showPassword ? <BiShowAlt /> : <BiHide />}
                  </span>
                ) : null}
              </div>
              <button
                disabled={isLoading}
                className={`btn btn-primary p-relative ${
                  isLoading ? "loading-btn" : ""
                } ${AuthStyles.btn}`}
              >
                {isLoading ? <Spinner /> : "Sign in"}
              </button>
              <div className={AuthStyles.footer}>
                <p>
                  Already have an account?{" "}
                  <Link href="/auth/login">Sign in</Link>{" "}
                </p>
              </div>
            </form>
          </>
        )}
      </section>
    </>
  )
}
