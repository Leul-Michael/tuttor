import Link from "next/link"
import { HiOutlineLightBulb } from "react-icons/hi"

export default function Tip({
  tip,
  link,
  inside,
}: {
  tip: string
  link?: { path: string; to: string }
  inside?: boolean
}) {
  return (
    <div className={`tip ${inside ? "inside" : ""}`}>
      <HiOutlineLightBulb className="icon" />
      <p>
        {tip} {link ? <Link href={link.path}>--{link.to}</Link> : null}
      </p>
    </div>
  )
}
