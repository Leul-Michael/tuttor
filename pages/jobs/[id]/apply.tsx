import Link from "next/link"
import { useRouter } from "next/router"
import { FormEvent, useState, ChangeEventHandler } from "react"
import Spinner from "../../../components/Spinner"
import Tip from "../../../components/Messages/Tip"
import ApplyJobStyles from "../../../styles/Job.module.css"
import { useSession } from "next-auth/react"
import { ACCOUNT_TYPE } from "../../../types"
import Caution from "../../../components/Messages/Caution"
import { useMutation } from "@tanstack/react-query"
import axiosInstance from "../../../axios/axios"
import useToast from "../../../context/ToastContext"
import { GetServerSideProps } from "next"
import Head from "next/head"

export default function Apply({ resume }: { resume: string }) {
  const router = useRouter()
  const { addMessage } = useToast()
  const { query, asPath } = useRouter()
  const jobId = query?.id

  const session = useSession()

  const [desc, setDesc] = useState("")

  const mutation = useMutation({
    mutationFn: (addProposal: {
      jobId: string
      desc: string
      resume: string
    }) => {
      return axiosInstance.post(`/jobs/proposal/submit`, addProposal)
    },
  })

  const submitProposal = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await mutation.mutateAsync({
        jobId: jobId!.toString(),
        desc,
        resume,
      })

      addMessage(res.data?.msg)
      setDesc("")
      router.push(`/jobs/${jobId}`)
    } catch (e: any) {
      addMessage(`Error: ${e.response.data.msg || e.message}`)
    }
  }

  let content

  if (!session.data?.user) {
    content = (
      <>
        <Caution
          inside
          caution="You need to Sign in to apply for Jobs!"
          link={{ path: "/auth/login", to: "Sign in", from: asPath }}
        />
      </>
    )
  } else if (session.data?.user.role === ACCOUNT_TYPE.EMPLOYER) {
    content = (
      <>
        <Caution
          inside
          caution="You need to be a Tutor to apply for Jobs!"
          link={{ path: "/", to: "home" }}
        />
      </>
    )
  } else if (session.data?.user.role === ACCOUNT_TYPE.TUTTOR) {
    if (!resume) {
      content = (
        <>
          <Caution
            inside
            caution="You need to attach your resume before applying for Jobs!"
            link={{ path: "/profile", to: "profile" }}
          />
        </>
      )
    } else {
      content = (
        <>
          <p className={ApplyJobStyles["desc-text"]}>
            You&#39;re applying for this{" "}
            <Link href={`/jobs/${jobId}`}>--Job</Link>{" "}
          </p>
          <Tip
            tip="Your resume will be attached when you submit this form, if you would like to change it, go to your profile page."
            link={{ to: "profile", path: "/profile" }}
            inside
          />
          <div
            className={`${ApplyJobStyles["create-job__input-box"]} ${ApplyJobStyles["text-box-border"]}`}
          >
            <label htmlFor="desc">
              Description <span>*</span>
            </label>
            <span>Describe why you&#39;re the best candidate for the job.</span>
            <textarea
              name="desc"
              id="desc"
              placeholder="description..."
              maxLength={250}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            ></textarea>
            <div className={ApplyJobStyles["max-chars"]}>
              {desc.length} / <span>250</span>
            </div>
          </div>
          <button
            disabled={mutation.isLoading}
            type="submit"
            className={`p-relative ${
              mutation.isLoading
                ? `${ApplyJobStyles["loading-btn"]} ${ApplyJobStyles["apply-btn"]}`
                : ""
            } ${ApplyJobStyles.btn} ${ApplyJobStyles["btn-primary"]}`}
          >
            {mutation.isLoading ? <Spinner /> : "Submit Proposal"}
          </button>
        </>
      )
    }
  } else {
    content = <p>Something went wrong!</p>
  }

  return (
    <>
      <Head>
        <title>Apply for Job</title>
        <meta name="description" content="Apply for the selected Job." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section
        className={`${ApplyJobStyles["create-job"]} ${ApplyJobStyles["apply-job"]}`}
      >
        <form onSubmit={submitProposal} className="container-md">
          <div className={ApplyJobStyles["create-job__container"]}>
            {content}
          </div>
        </form>
      </section>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const res = await axiosInstance.get(`/profile/resume`, {
      headers: {
        cookie: context.req.headers.cookie || "",
      },
    })

    return {
      props: {
        resume: res.data,
      },
    }
  } catch (e: any) {
    return {
      props: {
        resume: null,
      },
    }
  }
}
