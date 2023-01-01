import React from "react"
import ProfileStyles from "../../styles/Profile.module.css"
import { FiPlusCircle } from "react-icons/fi"

export default function Resume() {
  return (
    <div className={ProfileStyles.portion}>
      <p className={`font-serif ${ProfileStyles.title}`}>Resume</p>
      <button className={ProfileStyles[`btn-profile`]}>
        <FiPlusCircle className={ProfileStyles.icon} /> Attach Resume
      </button>
    </div>
  )
}
