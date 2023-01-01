import { AiOutlineInfoCircle } from "react-icons/ai"
import Link from "next/link"
import { useRouter } from "next/router"

export default function Caution({
  caution,
  link,
  inside,
}: {
  caution: string
  link: { path: string; to: string; from?: string }
  inside?: boolean
}) {
  const router = useRouter()

  const redirect = () => {
    router.push({
      pathname: link.path,
      query: { from: link?.from },
    })
  }

  return (
    <div className={`tip caution ${inside ? "inside" : ""}`}>
      <AiOutlineInfoCircle className="icon" />
      <p>
        {caution} <span onClick={redirect}>--{link?.to}</span>{" "}
      </p>
    </div>
  )
}
