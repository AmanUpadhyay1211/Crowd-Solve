import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IProblem extends Document {
  title: string
  description: string
  images: string[]
  tags: string[]
  location?: {
    type: string
    coordinates: [number, number]
    address?: string
  }
  author: mongoose.Types.ObjectId
  status: "open" | "solved" | "closed"
  acceptedSolution?: mongoose.Types.ObjectId
  views: number
  createdAt: Date
  updatedAt: Date
}

const ProblemSchema = new Schema<IProblem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
    },
    images: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      address: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "solved", "closed"],
      default: "open",
    },
    acceptedSolution: {
      type: Schema.Types.ObjectId,
      ref: "Solution",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Index for text search
ProblemSchema.index({ title: "text", description: "text", tags: "text" })

const Problem: Model<IProblem> = mongoose.models.Problem || mongoose.model<IProblem>("Problem", ProblemSchema)

export default Problem
