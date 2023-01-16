import { useRouter } from "next/router"
import { MouseEventHandler } from "react"
import { MdOutlineClose } from "react-icons/md"
import useRecentSearch from "../context/RecentSearchContext"
import styles from "../styles/Job.module.css"

export default function RecentSearch({
  id,
  title,
  location,
}: {
  id: string
  title: string
  location: string
}) {
  const router = useRouter()
  const { removeRecentSearch } = useRecentSearch()

  const searchItem: MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault()
    router.push({
      pathname: "/search",
      query: {
        title,
        location,
      },
    })
  }

  const handleRemove: MouseEventHandler<SVGElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    removeRecentSearch(id)
  }

  return (
    <article onClick={searchItem} className={styles.recents}>
      <div className={styles.recent}>
        <p>{title || ""}</p>
        <span>{location || ""}</span>
      </div>

      <MdOutlineClose onClick={handleRemove} className={styles.icon} />
    </article>
  )
}
