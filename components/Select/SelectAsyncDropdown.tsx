import { useRef, useState, MouseEvent } from "react"
import SelectStyles from "../../styles/Select.module.css"
import axiosInstance from "../../axios/axios"
import { useQuery } from "@tanstack/react-query"
import Spinner from "../Spinner"

export type AsyncOption = {
  _id: string | number
  title: string
  invites?: string[]
}

interface SelectDropdownProps {
  value: AsyncOption
  userId: string
  onChange: (value: AsyncOption) => void
}

export default function SelectAsyncDropdown({
  value,
  userId,
  onChange,
}: SelectDropdownProps) {
  const optionsRef = useRef<HTMLUListElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["invite-jobs"],
    queryFn: async () => {
      const res = axiosInstance.get("/jobs/invite")
      return (await res).data
    },
  })

  const handleToggle = (e: MouseEvent<HTMLDivElement>) => {
    if (
      e.target === optionsRef.current ||
      optionsRef.current?.contains(e.target as any)
    )
      return
    setIsOpen((prev) => !prev)
  }

  return (
    <div
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
      className={SelectStyles.container}
      onClick={(e) => handleToggle(e)}
    >
      <div className={SelectStyles["select-display"]}>{value.title}</div>
      <div className={SelectStyles["arrow-down"]}></div>

      <ul
        ref={optionsRef}
        className={`${SelectStyles["dropdown-options"]} ${
          isOpen ? SelectStyles.show : ""
        }`}
      >
        {isLoading ? (
          <li className={`ld-center p-relative ${SelectStyles.loading}`}>
            <Spinner />
          </li>
        ) : data?.length > 0 ? (
          data?.map((job: AsyncOption) => (
            <li
              key={job._id}
              onClick={() => {
                if (job?.invites?.includes(userId)) return
                onChange(job)
                setIsOpen(false)
              }}
            >
              <span>
                {job.title}{" "}
                {job?.invites?.includes(userId) ? (
                  <span
                    title="user already invited"
                    className={`${SelectStyles.tip}`}
                  >
                    invited
                  </span>
                ) : null}
              </span>
            </li>
          ))
        ) : (
          <li
            onClick={() => {
              setIsOpen(false)
            }}
          >
            <span>No available jobs.</span>
          </li>
        )}
      </ul>
    </div>
  )
}
