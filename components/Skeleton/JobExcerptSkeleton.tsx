import React from "react"
import { TbPoint } from "react-icons/tb"
import styles from "../../styles/Skeleton.module.css"

export default function JobExcerptSkeleton() {
  return (
    <article tabIndex={0} className={styles.job}>
      <h1></h1>
      <p className={styles.location}></p>
      <p className={styles.type}></p>
      <div className={styles.price}>
        <div className={styles.header}>
          <TbPoint className={styles.icon} />
          <p className={styles["text-lg"]}>Salary</p>
        </div>
        <div className={styles["price-tag"]}></div>
      </div>
      <div className={styles.requirements}>
        <p className={styles.text}>Requirements</p>
        <div className={styles.requirement}>
          <TbPoint className={styles.icon} />
          <p></p>
        </div>
        <div className={styles.requirement}>
          <TbPoint className={styles.icon} />
          <p></p>
        </div>
        <div className={styles.requirement}>
          <TbPoint className={styles.icon} />
          <p></p>
        </div>
      </div>
      <p className={styles.posted}></p>
    </article>
  )
}
