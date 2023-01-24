import Link from "next/link"
import React from "react"
import styles from "../styles/Header.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles["footer-container"]}>
        <ul className={styles["footer-links"]}>
          <li>
            <Link href="/search">Browse Jobs</Link>
          </li>
          <li>
            <Link href="/tutors">Find tutors</Link>
          </li>
          <li>
            <Link href="/jobs/create">Post a Job</Link>
          </li>
          <li>
            <Link href="/">About</Link>
          </li>
          <li>
            <Link href="/">Privacy</Link>
          </li>
          <li>
            <Link href="/">Terms</Link>
          </li>
        </ul>
        <div className={styles.logo}>
          <Link href="/" className="font-serif">
            Tuttor.
          </Link>
          <p>Copyright © 2023 Tuttor Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
