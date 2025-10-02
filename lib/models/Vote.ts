import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IVote extends Document {
  user: mongoose.Types.ObjectId
  target: mongoose.Types.ObjectId
  targetType: "Solution"
  voteType: "upvote" | "downvote"
  createdAt: Date
}

const VoteSchema = new Schema<IVote>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    target: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },
    targetType: {
      type: String,
      required: true,
      enum: ["Solution"],
    },
    voteType: {
      type: String,
      required: true,
      enum: ["upvote", "downvote"],
    },
  },
  {
    timestamps: true,
  },
)

// Ensure one vote per user per target
VoteSchema.index({ user: 1, target: 1 }, { unique: true })

const Vote: Model<IVote> = mongoose.models.Vote || mongoose.model<IVote>("Vote", VoteSchema)

export default Vote
