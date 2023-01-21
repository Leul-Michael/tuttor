import Link from "next/link"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import styles from "../../styles/Header.module.css"
import { HiOutlineUserCircle } from "react-icons/hi"
import { useSession } from "next-auth/react"
import SelectProfile from "../Select/SelectProfile"
import { useState } from "react"
import { ACCOUNT_TYPE } from "../../types"
import { SiGooglemessages } from "react-icons/si"

const Theme = dynamic(() => import("../Select/Theme"), {
  ssr: false,
})

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const session = useSession()

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles["nav-item"]}>
          <div className={styles.logo}>
            <Link href="/" className="font-serif">
              Tuttor.
            </Link>
          </div>
          <ul className={styles.ul}>
            <li
              className={`${styles.link} ${
                router.pathname === "/" ? styles.active : ""
              }`}
            >
              <Link href="/">Find jobs</Link>
            </li>
            <li
              className={`${styles.link} ${
                router.pathname === "/tutors" ? styles.active : ""
              }`}
            >
              <Link href="/tutors">Tutors</Link>
            </li>
            {session.data?.user.role === ACCOUNT_TYPE.EMPLOYER && (
              <li
                className={`${styles.link} ${
                  router.pathname === "/jobs/all" ? styles.active : ""
                }`}
              >
                <Link href="/jobs/all">My jobs</Link>
              </li>
            )}
            {session.data?.user.role === ACCOUNT_TYPE.TUTTOR && (
              <li
                className={`${styles.link} ${
                  router.pathname === "/jobs/user-jobs" ? styles.active : ""
                }`}
              >
                <Link href="/jobs/user-jobs">My jobs</Link>
              </li>
            )}
          </ul>
        </div>
        <div className={styles["nav-item"]}>
          <ul className={`${styles.ul} ${styles.auth}`}>
            <Theme />
            {session.status === "authenticated" ? (
              <>
                <li
                  className={`${styles.link} ${styles["msg-icon"]} ${
                    router.asPath ===
                    `/users/${session.data.user.id}/conversation`
                      ? styles.active
                      : ""
                  }`}
                >
                  <Link href={`/users/${session.data.user.id}/conversation`}>
                    <SiGooglemessages />
                  </Link>
                </li>
                <div
                  tabIndex={0}
                  className={styles.profile}
                  onBlur={() => setIsOpen(false)}
                >
                  <HiOutlineUserCircle
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={styles["profile-icon"]}
                  />
                  <SelectProfile
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    username={session.data.user.name!}
                  />
                </div>
              </>
            ) : (
              <>
                <li
                  className={`${styles.link} ${
                    router.pathname === "/auth/login" ? styles.active : ""
                  }`}
                >
                  <Link href="/auth/login">Sign in</Link>
                </li>
                <li
                  className={`${styles.link} ${
                    router.pathname === "/auth/register" ? styles.active : ""
                  }`}
                >
                  <Link href="/auth/register">Sign up</Link>
                </li>{" "}
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  )
}
