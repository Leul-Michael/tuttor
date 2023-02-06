import { Dispatch, SetStateAction } from "react"
import { msgType } from "../../types"
import msgStyles from "../../styles/Message.module.css"
import { MdErrorOutline, MdOutlineClose } from "react-icons/md"
import { AiOutlineCheckCircle } from "react-icons/ai"
import { HiOutlineLightBulb } from "react-icons/hi"

interface MsgProps {
  type: msgType
  msg: string
  closeModal: Dispatch<SetStateAction<boolean>>
}

export default function MsgSm({ type, msg, closeModal }: MsgProps) {
  return (
    <div
      className={`${msgStyles.toast} ${msgStyles["msg-sm"]} ${
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
      <p className={msgStyles["msg-txt"]}>{msg}</p>
      <span onClick={() => closeModal(false)} className={msgStyles.close}>
        <MdOutlineClose />
      </span>
    </div>
  )
}
