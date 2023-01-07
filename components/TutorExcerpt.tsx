import Image from "next/image"
import Link from "next/link"
import { IUser } from "../models/User"
import TutorStyles from "../styles/Tutor.module.css"

export default function TutorExcerpt({ user }: { user: IUser }) {
  return (
    <Link
      href={`users/${user._id}`}
      tabIndex={0}
      className={TutorStyles.tuttor}
    >
      <div className={TutorStyles.header}>
        <h1 className="font-serif">{user?.name}</h1>
        <div className={TutorStyles.price}>{user?.price} / hr</div>
      </div>
      <p className={TutorStyles.location}>
        {user?.location ? user.location : "Unknown"}
      </p>
      <p className={TutorStyles.reviews}>
        <Image
          className={TutorStyles.icon}
          src="/review.png"
          alt="review icon"
          width={16}
          height={14}
        />{" "}
        N/A
      </p>
      <p className={TutorStyles.type}>
        {user?.bio ? user.bio : "No description"}
      </p>
    </Link>
  )
}
