import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Solution from "@/lib/models/Solution"
import { getSession } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if user is the author
    if (solution.author.toString() !== session.userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const { content, images } = await request.json()

    if (content) solution.content = content
    if (images) solution.images = images

    await solution.save()

    const updatedSolution = await Solution.findById(params.id).populate("author", "username avatar reputation").lean()

    return NextResponse.json({ solution: updatedSolution })
  } catch (error) {
    console.error("[v0] Update solution error:", error)
    return NextResponse.json({ error: "Failed to update solution" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if user is the author
    if (solution.author.toString() !== session.userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    await solution.deleteOne()

    return NextResponse.json({ message: "Solution deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete solution error:", error)
    return NextResponse.json({ error: "Failed to delete solution" }, { status: 500 })
  }
}
