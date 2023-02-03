import { models, Schema, model, ObjectId } from "mongoose"

export interface IProposal {
  user: string | ObjectId
  desc: string
  resume: string
  status: string
}

const ProposalSchema = new Schema<IProposal>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    desc: String,
    resume: String,
    status: {
      type: String,
      enum: ["Active", "Not Selected", "Selected"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
)

export default models.Proposal || model("Proposal", ProposalSchema)
