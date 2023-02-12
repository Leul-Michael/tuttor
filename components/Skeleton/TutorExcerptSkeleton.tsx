import Image from "next/image"
import Styles from "../../styles/Skeleton.module.css"

export default function TutorExcerptSkeleton() {
  return (
    <article tabIndex={0} className={Styles.tuttor}>
      <div className={`${Styles.header} ${Styles["header-flex"]}`}>
        <h1 className="font-serif"></h1>
        <div className={Styles["price-tag"]}></div>
      </div>
      <p className={Styles.location}></p>
      <p className={Styles.reviews}>
        <Image
          className={Styles.icon}
          src="/review.png"
          alt="review icon"
          width={16}
          height={14}
        />{" "}
        n/a
      </p>
      <div className={Styles.descs}>
        <p className={Styles.desc}></p>
        <p className={Styles.desc}></p>
        <p className={Styles.desc}></p>
      </div>
    </article>
  )
}
