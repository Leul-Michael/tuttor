import { Dispatch, SetStateAction } from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { MdOutlineClose } from "react-icons/md"
import JobProposal from "./JobProposal"
import axiosInstance from "../../axios/axios"
import { useQuery } from "@tanstack/react-query"
import Spinner from "../Spinner"
import { JobProposalType } from "../../types"

export default function JobProposals({
  setOpenModal,
  proposals,
  jobId,
}: {
  setOpenModal: Dispatch<SetStateAction<boolean>>
  proposals: string[]
  jobId: string
}) {
  const { data, isFetching } = useQuery({
    queryKey: ["JobProposals"],
    queryFn: async () => {
      const res = await axiosInstance.get("/jobs/proposal", {
        params: {
          proposalIds: proposals.join(","),
        },
      })
      return res.data
    },
  })

  return (
    <div
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      className={`${ProfileStyles.resume} ${ProfileStyles.proposals} ${ProfileStyles.lg}`}
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
        {isFetching ? (
          <li
            className={`p-relative ${ProfileStyles["p-relative"]} ${ProfileStyles["proposals-item"]}`}
          >
            <Spinner />
          </li>
        ) : data.length ? (
          data.map((proposal: JobProposalType) => (
            <JobProposal key={proposal._id} proposal={proposal} jobId={jobId} />
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
