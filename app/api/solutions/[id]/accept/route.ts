import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Solution from "@/lib/models/Solution"
import Problem from "@/lib/models/Problem"
import User from "@/lib/models/User"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    await connectDB()

    const solution = await Solution.findById(params.id)

    if (!solution) {
      return NextResponse.json({ error: "Solution not found" }, { status: 404 })
    }

    // Get the problem
    const problem = await Problem.findById(solution.problem)

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 })
    }

    // Check if user is the problem author
    if (problem.author.toString() !== session.userId) {
      return NextResponse.json({ error: "Only the problem author can accept solutions" }, { status: 403 })
    }

    // Unaccept previous solution if exists
    if (problem.acceptedSolution) {
      await Solution.findByIdAndUpdate(problem.acceptedSolution, {
        isAccepted: false,
      })
    }

    // Accept this solution
    solution.isAccepted = true
    await solution.save()

    // Update problem
    problem.acceptedSolution = solution._id
    problem.status = "solved"
    await problem.save()

    // Award reputation to solution author
    await User.findByIdAndUpdate(solution.author, { $inc: { reputation: 15 } })

    return NextResponse.json({ message: "Solution accepted successfully" })
  } catch (error) {
    console.error("[v0] Accept solution error:", error)
    return NextResponse.json({ error: "Failed to accept solution" }, { status: 500 })
  }
}
