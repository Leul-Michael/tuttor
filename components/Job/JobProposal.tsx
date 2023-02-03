import { useState, MouseEvent } from "react"
import TimeAgo from "../TimeAgo"
import ProfileStyles from "../../styles/Profile.module.css"
import { useRouter } from "next/router"
import useCreateConversation from "../../hooks/useCreateConversation"
import useDm from "../../context/DMContext"
import { useSession } from "next-auth/react"
import axiosInstance from "../../axios/axios"
import { useQuery } from "@tanstack/react-query"
import Spinner from "../Spinner"

export default function JobProposal({
  proposalId,
  jobId,
}: {
  proposalId: string
  jobId: string
}) {
  const session = useSession()
  const router = useRouter()
  const { createConversation } = useCreateConversation()
  const { setSelectedChatId } = useDm()

  const {
    data: proposal,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["Proposal" + proposalId],
    queryFn: async () => {
      const res = await axiosInstance.get("/jobs/proposal", {
        params: {
          proposalId,
        },
      })
      return res.data
    },
  })

  const [loading, setLoading] = useState(false)

  const handleConversation = async (
    e: MouseEvent<HTMLButtonElement>,
    user: any
  ) => {
    e.preventDefault()
    if (!session.data?.user || !user) return
    try {
      setLoading(true)
      const res = await createConversation(
        { _id: session.data.user.id, name: session.data.user.name! },
        user
      )

      if (res) {
        setSelectedChatId(res)
        router.push(`/users/${user._id}/conversation`)
      }
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (
    e: MouseEvent<HTMLButtonElement>,
    status: string,
    proposalId: string
  ) => {
    e.preventDefault()
    try {
      await axiosInstance.post("/jobs/proposal/status", {
        status,
        jobId,
        proposalId,
      })
    } finally {
      refetch()
    }
  }

  if (isLoading || isRefetching) {
    return (
      <li
        className={`p-relative ${ProfileStyles["p-relative"]} ${ProfileStyles["proposals-item"]}`}
      >
        <Spinner />
      </li>
    )
  }

  if (!proposal || !proposal.user?.name) {
    return (
      <li className={ProfileStyles["proposals-item"]}>
        <p className={ProfileStyles["prop-desc"]}>
          User proposed not found (account probably deleted!)
        </p>
      </li>
    )
  }

  return (
    <li className={ProfileStyles["proposals-item"]}>
      <div className={ProfileStyles["proposal-item__header"]}>
        <div
          onClick={() => {
            router.push(`/users/${proposal?.user?._id}`)
          }}
          className="avatar pointer"
        >
          {proposal?.user?.name.slice(0, 2)}
        </div>
        <div>
          <p>{proposal?.user?.name}</p>
          <span>{proposal?.user?.location}</span>
        </div>
        {proposal.status === "Active" ? (
          <>
            {" "}
            <button
              disabled={loading}
              onClick={(e) => handleConversation(e, proposal?.user)}
              className={`${ProfileStyles.btn} ${ProfileStyles["proposal-btns"]}`}
            >
              Contact
            </button>
            <button
              disabled={loading}
              onClick={(e) => updateStatus(e, "Not Selected", proposal._id)}
              className={`${ProfileStyles.btn} ${ProfileStyles["proposal-btns"]} ${ProfileStyles["btn-danger-light"]}`}
            >
              Not Intersted
            </button>{" "}
          </>
        ) : (
          <>
            <div>
              <p className="job-status job-status-fail">Not Intersted</p>
            </div>

            <button
              disabled={loading}
              onClick={(e) => updateStatus(e, "Active", proposal._id)}
              className={`${ProfileStyles.btn} ${ProfileStyles["proposal-btns"]} ${ProfileStyles["btn-danger-light"]}`}
            >
              Undo
            </button>
          </>
        )}
      </div>
      <p className={`${ProfileStyles["prop-desc"]}`}>{proposal?.desc}</p>
      <TimeAgo timestamp={proposal?.createdAt} prefix="Proposed" />
    </li>
  )
}
