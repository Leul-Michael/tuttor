import { Dispatch, SetStateAction } from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { MdOutlineClose } from "react-icons/md"
import JobProposal from "./JobProposal"

export default function JobProposals({
  setOpenModal,
  proposals,
  jobId,
}: {
  setOpenModal: Dispatch<SetStateAction<boolean>>
  proposals: string[]
  jobId: string
}) {
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
          proposals.map((proposal: string) => (
            <JobProposal key={proposal} proposalId={proposal} jobId={jobId} />
          ))
        ) : (
          <li className={ProfileStyles["proposals-item"]}>
            <p className={ProfileStyles["prop-desc"]}>No proposal found!</p>
          </li>
        )}
      </ul>
    </div>
  )
}
