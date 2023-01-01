import { msgType } from "../../types"
import { MdErrorOutline } from "react-icons/md"
import { AiOutlineCheckCircle } from "react-icons/ai"
import { HiOutlineLightBulb } from "react-icons/hi"
import msgStyles from "../../styles/Message.module.css"

interface MsgProps {
  type: msgType
  msg: string
}

export default function Message({ type, msg }: MsgProps) {
  return (
    <div
      className={`${msgStyles.toast} ${
        type === msgType.ERROR
          ? msgStyles.error
          : type === msgType.SUCCESS
          ? msgStyles.success
          : ""
      }`}
    >
      <span className={msgStyles["toast-icon"]}>
        {type === msgType.ERROR ? (
          <MdErrorOutline />
        ) : type === msgType.SUCCESS ? (
          <AiOutlineCheckCircle />
        ) : (
          <HiOutlineLightBulb />
        )}
      </span>
      <p className={msgStyles["toast-msg"]}>{msg}</p>
    </div>
  )
}
