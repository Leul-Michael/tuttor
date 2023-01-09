import { models, Schema, model, ObjectId } from "mongoose"

interface IJob {
  user: string | ObjectId
  title: string
  budget: string
  numberOfStudents: string
  tutorType: string
  location: string
  desc: string
  schedule: []
  requirements: []
  proposals: []
}

const JobSchema = new Schema<IJob>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    numberOfStudents: {
      type: String,
      default: "1",
    },
    location: {
      type: String,
      required: true,
    },
    tutorType: {
      type: String,
      enum: ["Both", "In Person", "Online"],
    },
    desc: {
      type: String,
      maxlength: 300,
    },
    requirements: [String],
    schedule: [String],
    proposals: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        desc: String,
        resume: String,
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default models.Job || model<IJob>("Job", JobSchema)
