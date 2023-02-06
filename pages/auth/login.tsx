import Link from "next/link"
import AuthStyles from "../../styles/Auth.module.css"
import { useState, FormEvent, useEffect } from "react"
import { BiHide, BiShowAlt } from "react-icons/bi"
import Spinner from "../../components/Spinner"
import Message from "../../components/Messages/Message"
import { msgType } from "../../types"
import { useRouter } from "next/router"
import { signIn, useSession } from "next-auth/react"
import Head from "next/head"

const Login = () => {
  const session = useSession()
  const router = useRouter()
  const from = router.query?.from?.toString() || "/"

  const [email, setEmail] = useState("")
  const [errorMsg, setErrorMsg] = useState({
    type: msgType.ERROR,
    msg: "",
  })
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg({ type: msgType.ERROR, msg: "" })
    try {
      setIsLoading(true)
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      if (res?.error) {
        setErrorMsg({ type: msgType.ERROR, msg: res.error })
      }

      if (!res?.error && res?.status === 200 && res.ok) {
        setEmail("")
        setPassword("")
        router.push(from)
      }
    } catch (e: any) {
      setErrorMsg({ type: msgType.ERROR, msg: e.message })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session.data?.user) {
      router.push(from)
    }
  }, [session.data?.user, from, router])

  return (
    <>
      <Head>
        <title>Login to your tuttor account</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className={AuthStyles.container}>
        <div className={AuthStyles.header}>
          <div className={AuthStyles.logo}>
            <h1 className="font-serif">Tuttor.</h1>
          </div>
        </div>
        <form onSubmit={handleLogin} className={AuthStyles.form}>
          {errorMsg.msg ? (
            <Message type={errorMsg.type} msg={errorMsg.msg} />
          ) : null}
          <div className={AuthStyles["input-box"]}>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">email</label>
          </div>
          <div className={AuthStyles["input-box"]}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              Don&#39;t have an account?{" "}
              <Link href="/auth/register">Sign up</Link>
            </p>
          </div>
        </form>
      </section>
    </>
  )
}

export default Login
