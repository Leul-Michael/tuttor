import Head from "next/head"
import TutorStyles from "../styles/Tutor.module.css"
import TutorExcerpt from "../components/TutorExcerpt"
import TutorSearch from "../components/Search/TutorSearch"

export default function tutors() {
  return (
    <>
      <Head>
        <title>Find Tutors</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TutorSearch />
      <div className={`container ${TutorStyles.tuttors}`}>
        <p className={TutorStyles.results}>200 results found</p>
        <div className={`${TutorStyles["tutor-grid"]}`}>
          <TutorExcerpt />
        </div>
      </div>
    </>
  )
}
