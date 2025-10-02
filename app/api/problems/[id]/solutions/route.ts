import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Solution from "@/lib/models/Solution"
import Problem from "@/lib/models/Problem"
import User from "@/lib/models/User"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const solutions = await Solution.find({ problem: params.id })
      .populate("author", "username avatar reputation")
      .sort({ isAccepted: -1, upvotes: -1, createdAt: -1 })
      .lean()

    return NextResponse.json({ solutions })
  } catch (error) {
    console.error("[v0] Get solutions error:", error)
    return NextResponse.json({ error: "Failed to fetch solutions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { content, images } = await request.json()

    // Validation
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    if (content.length < 20) {
      return NextResponse.json({ error: "Solution must be at least 20 characters" }, { status: 400 })
    }

    await connectDB()

    // Check if problem exists
    const problem = await Problem.findById(params.id)

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 })
    }

    // Create solution
    const solution = await Solution.create({
      problem: params.id,
      author: session.userId,
      content,
      images: images || [],
    })

    const populatedSolution = await Solution.findById(solution._id)
      .populate("author", "username avatar reputation")
      .lean()

    // Award reputation to solution author
    await User.findByIdAndUpdate(session.userId, { $inc: { reputation: 5 } })

    return NextResponse.json({ solution: populatedSolution }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Create solution error:", error)
    return NextResponse.json({ error: "Failed to create solution" }, { status: 500 })
  }
}
