import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import Problem from "@/lib/models/Problem"
import Solution from "@/lib/models/Solution"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    await connectDB()

    // Get overall stats
    const [totalUsers, totalProblems, totalSolutions, solvedProblems, openProblems] = await Promise.all([
      User.countDocuments(),
      Problem.countDocuments(),
      Solution.countDocuments(),
      Problem.countDocuments({ status: "solved" }),
      Problem.countDocuments({ status: "open" }),
    ])

    // Get recent activity
    const recentProblems = await Problem.find().populate("author", "username").sort({ createdAt: -1 }).limit(5).lean()

    const recentSolutions = await Solution.find()
      .populate("author", "username")
      .populate("problem", "title")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    // Get top users by reputation
    const topUsers = await User.find().select("username avatar reputation").sort({ reputation: -1 }).limit(10).lean()

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProblems,
        totalSolutions,
        solvedProblems,
        openProblems,
      },
      recentProblems,
      recentSolutions,
      topUsers,
    })
  } catch (error) {
    console.error("[v0] Get admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
