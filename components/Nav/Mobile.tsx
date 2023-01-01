import Link from "next/link"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import Styles from "../../styles/Header.module.css"
import { HiOutlineUserCircle, HiOutlineMenuAlt3 } from "react-icons/hi"
import { MdOutlineClose } from "react-icons/md"
import { signOut, useSession } from "next-auth/react"
import SelectProfile from "../Select/SelectProfile"
import { useState } from "react"
import { ACCOUNT_TYPE } from "../../types"

const Theme = dynamic(() => import("../Select/Theme"), {
  ssr: false,
})

export default function Mobile() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const session = useSession()

  return (
    <header className={Styles.header}>
      <nav className={Styles["mobile-nav"]}>
        <div className={Styles.logo}>
          <Link href="/" className="font-serif">
            Tuttor.
          </Link>
        </div>
        <div className={Styles.menu}>
          {session.status === "authenticated" ? (
            <div
              tabIndex={0}
              className={Styles.profile}
              onBlur={() => setIsOpen(false)}
            >
              <HiOutlineUserCircle
                onClick={() => setIsOpen((prev) => !prev)}
                className={Styles["profile-icon"]}
              />
              <SelectProfile
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                username={session.data.user.name!}
              />
            </div>
          ) : (
            <Link href="/auth/login" className={`${Styles.btn}`}>
              Sign in
            </Link>
          )}
          <div
            className={Styles["menu-icon"]}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <HiOutlineMenuAlt3 />
          </div>
        </div>
        <ul
          className={`${Styles["menu-links"]} ${isMenuOpen ? Styles.open : ""}`}
        >
          <MdOutlineClose
            className={Styles["menu-close-icon"]}
            onClick={() => setIsMenuOpen(false)}
          />
          <div className={Styles.theme}>
            <p className="font-serif">Theme</p>
            <Theme />
          </div>
          <div className={Styles.links}>
            <p className="font-serif">Links</p>
            <li
              className={`${Styles.link} ${
                router.pathname === "/" ? Styles.active : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Link href="/">Find jobs</Link>
            </li>
            <li
              className={`${Styles.link} ${
                router.pathname === "/tutors" ? Styles.active : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Link href="/tutors">Tutors</Link>
            </li>
            {session.data?.user.role === ACCOUNT_TYPE.EMPLOYER && (
              <li
                className={`${Styles.link} ${
                  router.pathname === "/jobs/all" ? Styles.active : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/jobs/all">My jobs</Link>
              </li>
            )}
            {session.status === "authenticated" ? (
              <li className={`${Styles["link-btn"]}`} onClick={() => signOut()}>
                Sign out
              </li>
            ) : (
              <>
                <li
                  className={`${Styles.link} ${
                    router.pathname === "/auth/login" ? Styles.active : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/auth/login">Sign in</Link>
                </li>
                <li
                  className={`${Styles["link-btn"]} ${
                    router.pathname === "/auth/register" ? Styles.active : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/auth/register">Sign up</Link>
                </li>
              </>
            )}
          </div>
        </ul>
      </nav>
    </header>
  )
}
