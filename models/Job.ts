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
  saves: []
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
    saves: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    proposals: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        desc: String,
        resume: String,
        proposedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["Active", "Not Selected", "Selected"],
          default: "Active",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default models.Job || model<IJob>("Job", JobSchema)
