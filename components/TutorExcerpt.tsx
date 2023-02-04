import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"
import { IUser } from "../models/User"
import TutorStyles from "../styles/Tutor.module.css"

const TutorExcerpt = ({ user }: { user: IUser }) => {
  const session = useSession()

  const isAuthor = useMemo(() => {
    return user._id === session.data?.user?.id
  }, [user._id, session.data?.user?.id])

  return (
    <Link
      href={`/users/${user._id}`}
      tabIndex={0}
      className={TutorStyles.tuttor}
    >
      <div className={TutorStyles.header}>
        <h1 className="font-serif">
          {user?.name}{" "}
          {isAuthor && (
            <span className="job-status job-status-good size-sm">You</span>
          )}
        </h1>
        <div className={TutorStyles.price}>{user?.price} / hr</div>
      </div>
      <p className={TutorStyles.location}>
        {user?.location ? user.location : "Unknown"}
      </p>
      <p className={TutorStyles.reviews}>
        <Image
          className={TutorStyles.icon}
          src="/review.png"
          alt="star"
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

export default TutorExcerpt
