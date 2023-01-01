import React from "react"
import { MdOutlineClose } from "react-icons/md"
import styles from "../styles/Job.module.css"

export default function RecentSearch() {
  return (
    <article className={styles.recent}>
      <p>Grade 9 tutor</p>
      <MdOutlineClose className={styles.icon} />
    </article>
  )
}
