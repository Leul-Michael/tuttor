import { useRouter } from "next/router"
import { useState, MouseEvent } from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { MdLocationOn } from "react-icons/md"
import SearchStyles from "../../styles/Search.module.css"

export default function HomeSearch() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    router.push({
      pathname: "/search",
      query: {
        title,
        location,
      },
    })
  }

  return (
    <section className={SearchStyles.container}>
      <div className="container">
        <h1 className="font-serif main-title">
          Find the best Tutoring Job for you.
        </h1>
        <div className={SearchStyles["search-container"]}>
          <div className={SearchStyles["input-box"]}>
            <label htmlFor="title">What</label>
            <input
              type="text"
              placeholder="title, keywords"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <AiOutlineSearch className={SearchStyles.icon} />
          </div>
          <div className={SearchStyles["input-box"]}>
            <label htmlFor="title">Where</label>
            <input
              type="text"
              placeholder="location"
              id="location"
              name="location"
              autoComplete="off"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <MdLocationOn className={SearchStyles.icon} />
          </div>
          <button onClick={handleSearch} className={`btn btn-primary`}>
            Find job
          </button>
        </div>
      </div>
    </section>
  )
}
