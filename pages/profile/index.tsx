import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import axiosInstance from "../../axios/axios"
import { IUser } from "../../models/User"
import ProfileStyles from "../../styles/Profile.module.css"
import Education from "../../components/Profile/Education"
import Subjects from "../../components/Profile/Subjects"
import Resume from "../../components/Profile/Resume"
import Tip from "../../components/Messages/Tip"
import { FormEvent, useState } from "react"
import useToast from "../../context/ToastContext"
import { ACCOUNT_TYPE } from "../../types"
import ChangePassword from "../../components/Profile/ChangePassword"
import Deactivate from "../../components/Profile/Deactivate"

export default function Profile({ user }: { user: IUser }) {
  const { addMessage } = useToast()
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState({
    name: user.name || "",
    email: user.email || "",
    location: user.location || "",
    bio: user.bio || "",
    price: user.price || 0,
  })

  const { name, email, location, bio, price } = currentUser

  const updateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setLoading(true)
      const res = await axiosInstance.post("/profile/update", {
        name,
        email,
        location,
        bio,
        price,
      })
      addMessage(res.data.msg)
    } catch (e: any) {
      addMessage(`Error: ${e.response.data.msg || e.message}`)

      setCurrentUser({
        name: user.name || "",
        email: user.email || "",
        location: user.location || "",
        bio: user.bio || "",
        price: user.price || 0,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={`${ProfileStyles.profile}`}>
      <div className={`${ProfileStyles.container}`}>
        <div className={ProfileStyles.main}>
          <p className={`font-serif ${ProfileStyles.title}`}>
            Personal information
          </p>
          <form
            onSubmit={updateProfile}
            className={ProfileStyles["profile-from"]}
          >
            <div className={ProfileStyles["input-box"]}>
              <label htmlFor="name">
                Full name <span>*</span>
              </label>
              <input
                type="text"
                name="name"
                id=""
                value={currentUser.name}
                onChange={(e) =>
                  setCurrentUser((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className={ProfileStyles["input-box"]}>
              <label htmlFor="email">
                Email <span>*</span>
              </label>
              <input
                type="email"
                name=""
                id="email"
                value={currentUser.email}
                onChange={(e) =>
                  setCurrentUser((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className={ProfileStyles["textarea-box"]}>
              <label htmlFor="bio">Summary</label>
              <textarea
                name=""
                id="bio"
                placeholder="Describe what you provide in details"
                value={currentUser?.bio}
                onChange={(e) =>
                  setCurrentUser((prev) => ({ ...prev, bio: e.target.value }))
                }
              ></textarea>
            </div>
            {user.role === ACCOUNT_TYPE.TUTTOR && (
              <>
                <Tip
                  inside
                  tip="Salary is the MINIMUM per hour price that you're willing to work for. If you haven't set a price, it will be set 50 Birr per hour by default."
                />
                <div
                  className={`${ProfileStyles["input-box"]} ${ProfileStyles.price}`}
                >
                  <label htmlFor="price">
                    Salary (per hour in Birr) <span>*</span>
                  </label>
                  <input
                    type="number"
                    name=""
                    id="price"
                    min={50}
                    max={10000}
                    value={currentUser?.price}
                    onChange={(e) =>
                      setCurrentUser((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                  />
                </div>{" "}
              </>
            )}
            <div className={ProfileStyles["input-box"]}>
              <label htmlFor="location">
                Location <span>*</span>
              </label>
              <input
                type="text"
                name=""
                id="location"
                value={currentUser.location}
                onChange={(e) =>
                  setCurrentUser((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                placeholder="e.g. CMC, Addis Ababa"
              />
            </div>
            <button
              disabled={loading}
              className={`${ProfileStyles.btn} ${ProfileStyles["btn-primary"]}`}
            >
              Save Changes
            </button>
          </form>
        </div>
        {user.role === ACCOUNT_TYPE.TUTTOR && (
          <>
            <Resume />
            <Subjects />
            <Education />
          </>
        )}
        <ChangePassword />
        <Deactivate />
      </div>
    </section>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  try {
    const res = await axiosInstance.get("/getMe", {
      headers: {
        cookie: context.req.headers.cookie || "",
      },
    })

    if (!res.data) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      }
    }

    return {
      props: {
        user: res.data,
      },
    }
  } catch {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }
}
