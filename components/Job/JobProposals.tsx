import { Dispatch, SetStateAction, useState, MouseEvent } from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { MdOutlineClose } from "react-icons/md"
import { useRouter } from "next/router"
import useDm from "../../context/DMContext"
import useCreateConversation from "../../hooks/useCreateConversation"
import { useSession } from "next-auth/react"

export default function JobProposals({
  setOpenModal,
  proposals,
  jobId,
}: {
  setOpenModal: Dispatch<SetStateAction<boolean>>
  proposals: string[]
  jobId: string
}) {
  const session = useSession()
  const router = useRouter()
  const { createConversation } = useCreateConversation()
  const { setSelectedChatId } = useDm()
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

  return (
    <div
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      className={`${ProfileStyles.resume} ${ProfileStyles.proposals}`}
    >
      <div className={ProfileStyles["resume-header"]}>
        <h1 className="font-serif">Proposals</h1>
        <MdOutlineClose
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setOpenModal(false)
          }}
          className={ProfileStyles.icon}
        />
      </div>
      <ul className={ProfileStyles["proposals-list"]}>
        {proposals.length ? (
          proposals.map((proposal: any, idx: number) =>
            proposal?.user?.name ? (
              <li
                className={ProfileStyles["proposals-item"]}
                key={proposal._id}
              >
                <div className={ProfileStyles["proposal-item__header"]}>
                  <div
                    onClick={(e) => {
                      router.push(`/users/${proposal?.user?._id}`)
                    }}
                    className="avatar pointer"
                  >
                    {proposal?.user?.name.slice(0, 2)}
                  </div>
                  <p>{proposal?.user?.name}</p>
                  <button
                    disabled={loading}
                    onClick={(e) => handleConversation(e, proposal?.user)}
                    className={`${ProfileStyles.btn} ${ProfileStyles["proposal-btns"]}`}
                  >
                    {loading ? "loading..." : "Contact"}
                  </button>
                </div>
                <p className={`${ProfileStyles["prop-desc"]}`}>
                  {proposal?.desc}
                </p>
              </li>
            ) : (
              <li className={ProfileStyles["proposals-item"]} key={idx}>
                <p className={ProfileStyles["prop-desc"]}>
                  User proposed not found (account probably deleted!)
                </p>
              </li>
            )
          )
        ) : (
          <li className={ProfileStyles["proposals-item"]}>
            <p className={ProfileStyles["prop-desc"]}>No proposals found</p>
          </li>
        )}
      </ul>
    </div>
  )
}
