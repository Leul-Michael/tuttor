import { formatDistanceToNowStrict } from "date-fns"
import { parseISO } from "date-fns/fp"

import timeStyles from "../styles/Job.module.css"

interface TimeAgoProps {
  timestamp: string
}

function TimeAgo({ timestamp }: TimeAgoProps) {
  let time = ""
  if (timestamp) {
    const parseDate = parseISO(timestamp)
    const timePeriod = formatDistanceToNowStrict(parseDate)

    time = `Posted ${timePeriod} ago`
  }
  return <p className={timeStyles.posted}>{time}</p>
}

export default TimeAgo
