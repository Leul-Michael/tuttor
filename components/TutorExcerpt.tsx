import Image from "next/image"
import { FaStar } from "react-icons/fa"
import TutorStyles from "../styles/Tutor.module.css"

export default function TutorExcerpt() {
  return (
    <article tabIndex={0} className={TutorStyles.tuttor}>
      <div className={TutorStyles.header}>
        <h1 className="font-serif">Leul Michael</h1>
        <div className={TutorStyles.price}>300 / hr</div>
      </div>
      <p className={TutorStyles.location}>Gerji, Addis Ababa</p>
      <p className={TutorStyles.reviews}>
        <Image
          className={TutorStyles.icon}
          src="/review.png"
          alt="review icon"
          width={16}
          height={14}
        />{" "}
        9 reviews
      </p>
      <p className={TutorStyles.type}>
        Were looking for cannabis professionals (e.g. dispensary / cultivation
        staff) to create videos reviews of their favorite strains and products,
        and answer common questions. No video editing experience required.
      </p>
    </article>
  )
}
