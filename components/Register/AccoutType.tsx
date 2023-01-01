import AuthStyles from "../../styles/Auth.module.css"
import { Dispatch, SetStateAction } from "react"
import { ACCOUNT_TYPE } from "../../types"

export default function AccoutType({
  setAccountType,
}: {
  setAccountType: Dispatch<SetStateAction<ACCOUNT_TYPE | undefined>>
}) {
  return (
    <div className={AuthStyles.options}>
      <p className="font-serif">Select account type</p>
      <div className={AuthStyles["options-list"]}>
        <button
          onClick={() => setAccountType(ACCOUNT_TYPE.TUTTOR)}
          className={AuthStyles["options-btn"]}
        >
          Tutor (Looking for tuttoring jobs)
        </button>
        <button
          onClick={() => setAccountType(ACCOUNT_TYPE.EMPLOYER)}
          className={AuthStyles["options-btn"]}
        >
          Employer (Looking for tuttors)
        </button>
      </div>
    </div>
  )
}
