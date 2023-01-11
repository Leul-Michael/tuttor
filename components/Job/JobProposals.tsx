import { Dispatch, SetStateAction, useState, MouseEvent } from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { MdOutlineClose } from "react-icons/md"
import { useRouter } from "next/router"

export default function JobProposals({
  setOpenModal,
  proposals,
  jobId,
}: {
  setOpenModal: Dispatch<SetStateAction<boolean>>
  proposals: string[]
  jobId: string
}) {
  const router = useRouter()

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
        {proposals.map((proposal: any, idx: number) =>
          proposal?.user?.name ? (
            <li className={ProfileStyles["proposals-item"]} key={proposal._id}>
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
        )}
      </ul>
    </div>
  )
}
