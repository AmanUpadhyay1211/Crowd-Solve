import mongoose, { Schema, type Document, type Model } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  username: string
  email: string
  password: string
  bio?: string
  avatar?: string
  reputation: number
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    avatar: {
      type: String,
    },
    reputation: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
