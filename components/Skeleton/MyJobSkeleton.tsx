import React from "react"
import { TbPoint } from "react-icons/tb"
import Styles from "../../styles/Skeleton.module.css"

export default function MyJobSkeleton() {
  return (
    <div className={Styles["my-job"]}>
      <div className={Styles["my-job__header"]}>
        <h2 className="font-serif"></h2>
        <div className={Styles["flex-buttons"]}>
          <button className={`${Styles.btn}`}></button>
        </div>
      </div>
      <p className={Styles.location}></p>
      <p className={Styles.type}></p>
      <div className={Styles.price}>
        <div className={Styles.header}>
          <TbPoint className={Styles.icon} />
          <p className={Styles["text-lg"]}>Salary</p>
        </div>
        <div className={Styles["price-tag"]}></div>
      </div>
      <p className={Styles.location}></p>
    </div>
  )
}
