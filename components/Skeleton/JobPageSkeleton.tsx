import React from "react"
import { TbPoint } from "react-icons/tb"
import styles from "../../styles/Skeleton.module.css"

export default function JobPageSkeleton() {
  return (
    <div className="container-md">
      <article className={`${styles.job} ${styles.page}`}>
        <h1></h1>
        <p className={styles.location}></p>
        <p className={styles.type}></p>
        <div className={`${styles.price}`}>
          <div className={styles.header}>
            <TbPoint className={styles.icon} />
            <p className={styles["text-lg"]}>Salary</p>
          </div>
          <div className={styles["price-tag"]}></div>
        </div>
        <div className={`${styles.price} ${styles["border-bottom"]}`}>
          <div className={styles.header}>
            <TbPoint className={styles.icon} />
            <p className={styles["text-lg"]}>Schedule</p>
          </div>
          <div className={styles["price-tag"]}></div>
        </div>
        <p className={styles.text}>Description</p>
        <div className={styles.descs}>
          <p className={styles.desc}></p>
          <p className={styles.desc}></p>
          <p className={styles.desc}></p>
          <p className={styles.desc}></p>
          <p className={styles.desc}></p>
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
    </div>
  )
}
