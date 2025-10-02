import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import Problem from "@/lib/models/Problem"
import Solution from "@/lib/models/Solution"

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    await connectDB()

    const user = await User.findOne({ username: params.username }).select("-password").lean()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's problems
    const problems = await Problem.find({ author: user._id }).sort({ createdAt: -1 }).limit(10).lean()

    // Get user's solutions
    const solutions = await Solution.find({ author: user._id })
      .populate("problem", "title")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    // Get stats
    const [problemCount, solutionCount, acceptedSolutionCount] = await Promise.all([
      Problem.countDocuments({ author: user._id }),
      Solution.countDocuments({ author: user._id }),
      Solution.countDocuments({ author: user._id, isAccepted: true }),
    ])

    return NextResponse.json({
      user,
      problems,
      solutions,
      stats: {
        problemCount,
        solutionCount,
        acceptedSolutionCount,
      },
    })
  } catch (error) {
    console.error("[v0] Get user profile error:", error)
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
  }
}
