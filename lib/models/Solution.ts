import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ISolution extends Document {
  problem: mongoose.Types.ObjectId
  author: mongoose.Types.ObjectId
  content: string
  images: string[]
  upvotes: number
  downvotes: number
  isAccepted: boolean
  createdAt: Date
  updatedAt: Date
}

const SolutionSchema = new Schema<ISolution>(
  {
    problem: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 20,
    },
    images: [
      {
        type: String,
      },
    ],
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const Solution: Model<ISolution> = mongoose.models.Solution || mongoose.model<ISolution>("Solution", SolutionSchema)

export default Solution
