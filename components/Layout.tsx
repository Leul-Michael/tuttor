import { ReactElement } from "react"
import Toast from "./Messages/Toast"
import useWindowsWidth from "../hooks/useWindowsWidth"
import dynamic from "next/dynamic"

const Header = dynamic(() => import("./Nav/Header"))
const Mobile = dynamic(() => import("./Nav/Mobile"))

export default function Layout({ children }: { children: ReactElement }) {
  const [width] = useWindowsWidth()

  return (
    <>
      {width > 768 ? <Header /> : <Mobile />}
      <Toast />
      <main>{children}</main>
    </>
  )
}
