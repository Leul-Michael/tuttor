import { AiOutlineSearch } from "react-icons/ai"
import { MdLocationOn } from "react-icons/md"
import SearchStyles from "../../styles/Search.module.css"

export default function HomeSearch() {
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
            />
            <MdLocationOn className={SearchStyles.icon} />
          </div>
          <button className={`btn btn-primary`}>Find job</button>
        </div>
      </div>
    </section>
  )
}
