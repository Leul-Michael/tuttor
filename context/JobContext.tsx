import { createContext, ReactElement, useContext, useState } from "react"

interface InitialValueProps {
  jobId: string
  viewJob: (id: string) => void
}

const JobContext = createContext({} as InitialValueProps)

export default function useJobContext() {
  return useContext(JobContext)
}

export function JobContextProvider({ children }: { children: ReactElement }) {
  const [jobId, setJobId] = useState("")

  function viewJob(id: string) {
    setJobId(id)
  }
  return (
    <JobContext.Provider value={{ jobId, viewJob }}>
      {children}
    </JobContext.Provider>
  )
}
