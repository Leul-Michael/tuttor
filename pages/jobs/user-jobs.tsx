import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Head from "next/head"
import { useState } from "react"
import AppliedJobs from "../../components/Job/AppliedJobs"
import InvitedJobs from "../../components/Job/InvitedJobs"
import SavedJobs from "../../components/Job/SavedJobs"
import Styles from "../../styles/Job.module.css"
import { ACCOUNT_TYPE } from "../../types"

export default function UserJobs() {
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <>
      <Head>
        <title>My Jobs</title>
        <meta name="description" content="Your Jobs filted by categories." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className={Styles["user-jobs"]}>
        <div className={`container-md`}>
          <div className={Styles["job-details__header"]}>
            <h1 className={`font-serif ${Styles["create-job__title"]}`}>
              My Jobs
            </h1>
            <div className={Styles["jobs-tab"]}>
              <div className={Styles["tab-indicator"]}></div>
              <button
                onClick={() => setTabIndex(0)}
                className={`btn ${Styles["btn-tab"]} ${
                  tabIndex === 0 ? Styles.active : ""
                }`}
              >
                Applied
              </button>
              <button
                onClick={() => setTabIndex(1)}
                className={`btn ${Styles["btn-tab"]} ${
                  tabIndex === 1 ? Styles.active : ""
                }`}
              >
                Saved
              </button>
              <button
                onClick={() => setTabIndex(2)}
                className={`btn ${Styles["btn-tab"]} ${
                  tabIndex === 2 ? Styles.active : ""
                }`}
              >
                Invited
              </button>
            </div>
          </div>
          <div className={Styles["user-job__outlet"]}>
            {tabIndex === 0 ? <AppliedJobs /> : null}
            {tabIndex === 1 ? <SavedJobs /> : null}
            {tabIndex === 2 ? <InvitedJobs /> : null}
          </div>
        </div>
      </section>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session || session.user.role !== ACCOUNT_TYPE.TUTTOR) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
