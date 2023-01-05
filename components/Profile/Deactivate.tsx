import React from "react"
import ProfileStyles from "../../styles/Profile.module.css"

export default function Deactivate() {
  return (
    <div className={ProfileStyles.portion}>
      <p className={`font-serif ${ProfileStyles.title}`}>Deactivate Account.</p>
      <button
        className={`${ProfileStyles[`btn-profile`]} ${
          ProfileStyles["btn-danger"]
        }`}
      >
        Deactivate
      </button>
    </div>
  )
}
