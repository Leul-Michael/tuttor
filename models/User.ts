import { Schema, model, models } from "mongoose"

export interface IUser {
  _id: string
  name: string
  email: string
  password?: string
  location?: string
  bio?: string
  resume?: string
  price: number
  subjects?: []
  education?: []
  reviews?: []
  role: string
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: String,
    bio: { type: String, maxlength: 200 },
    resume: String,
    price: {
      type: Number,
      required: true,
      default: 50,
    },
    subjects: [String],
    education: [
      {
        level: String,
        field: String,
        school: String,
        sDate: String,
        eDate: String,
      },
    ],
    reviews: [
      {
        stars: Number,
        review: String,
        userId: String,
      },
    ],
    role: {
      type: String,
      enum: ["tuttor", "employer"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default models.User || model<IUser>("User", UserSchema)
