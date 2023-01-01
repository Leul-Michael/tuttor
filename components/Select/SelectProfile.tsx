import { signOut } from "next-auth/react"
import { useRouter } from "next/router"
import styles from "../../styles/Header.module.css"

export default function SelectProfile({
  isOpen,
  setIsOpen,
  username,
}: {
  isOpen: boolean
  setIsOpen: (s: boolean) => void
  username: string
}) {
  const router = useRouter()

  return (
    <div className={`${styles["profile-ul"]} ${isOpen ? styles.show : ""}`}>
      <div className={styles["ul-header"]}>
        <p>
          Signed in as <span>{username}</span>
        </p>
      </div>
      <ul>
        <li
          onClick={() => {
            router.push("/profile")
            setIsOpen(false)
          }}
          className={styles["ul-link"]}
        >
          Profile
        </li>
        <li onClick={() => signOut()} className={styles["ul-link"]}>
          Sign out
        </li>
      </ul>
    </div>
  )
}
