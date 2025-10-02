import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import { createToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (username.length < 3 || username.length > 30) {
      return NextResponse.json({ error: "Username must be between 3 and 30 characters" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    await connectDB()

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email or username already exists" }, { status: 400 })
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    })

    // Create token
    const token = await createToken({
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    })

    // Set cookie
    await setAuthCookie(token)

    return NextResponse.json(
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          reputation: user.reputation,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Register error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
