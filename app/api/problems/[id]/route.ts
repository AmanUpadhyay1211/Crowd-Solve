import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Problem from "@/lib/models/Problem"
import Solution from "@/lib/models/Solution"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const problem = await Problem.findById(params.id)
      .populate("author", "username avatar reputation")
      .populate("acceptedSolution")
      .lean()

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 })
    }

    // Increment views
    await Problem.findByIdAndUpdate(params.id, { $inc: { views: 1 } })

    return NextResponse.json({ problem })
  } catch (error) {
    console.error("[v0] Get problem error:", error)
    return NextResponse.json({ error: "Failed to fetch problem" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    await connectDB()

    const problem = await Problem.findById(params.id)

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 })
    }

    // Check if user is the author
    if (problem.author.toString() !== session.userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const updates = await request.json()

    // Only allow certain fields to be updated
    const allowedUpdates = ["title", "description", "tags", "status"]
    const updateKeys = Object.keys(updates)

    const isValidUpdate = updateKeys.every((key) => allowedUpdates.includes(key))

    if (!isValidUpdate) {
      return NextResponse.json({ error: "Invalid updates" }, { status: 400 })
    }

    Object.assign(problem, updates)
    await problem.save()

    const updatedProblem = await Problem.findById(params.id).populate("author", "username avatar reputation").lean()

    return NextResponse.json({ problem: updatedProblem })
  } catch (error) {
    console.error("[v0] Update problem error:", error)
    return NextResponse.json({ error: "Failed to update problem" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    await connectDB()

    const problem = await Problem.findById(params.id)

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 })
    }

    // Check if user is the author
    if (problem.author.toString() !== session.userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Delete associated solutions
    await Solution.deleteMany({ problem: params.id })

    await problem.deleteOne()

    return NextResponse.json({ message: "Problem deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete problem error:", error)
    return NextResponse.json({ error: "Failed to delete problem" }, { status: 500 })
  }
}
