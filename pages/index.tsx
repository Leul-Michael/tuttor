import Head from "next/head"
import Feed from "../components/Feed"
// import { Inter } from "@next/font/google"
import HomeSearch from "../components/Search/HomeSearch"
import { JobContextProvider } from "../context/JobContext"

// const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Find Tutoring Jobs</title>
        <meta
          name="description"
          content="Find the best tuttoring jobs that suits you."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeSearch />
      <JobContextProvider>
        <Feed />
      </JobContextProvider>
    </>
  )
}
