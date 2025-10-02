import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Solution from "@/lib/models/Solution"
import Vote from "@/lib/models/Vote"
import User from "@/lib/models/User"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { voteType } = await request.json()

    if (!["upvote", "downvote"].includes(voteType)) {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 })
    }

    await connectDB()

    const solution = await Solution.findById(params.id)

    if (!solution) {
      return NextResponse.json({ error: "Solution not found" }, { status: 404 })
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({
      user: session.userId,
      target: params.id,
    })

    if (existingVote) {
      // If same vote type, remove vote
      if (existingVote.voteType === voteType) {
        await existingVote.deleteOne()

        // Update solution vote count
        if (voteType === "upvote") {
          solution.upvotes = Math.max(0, solution.upvotes - 1)
          await User.findByIdAndUpdate(solution.author, { $inc: { reputation: -2 } })
        } else {
          solution.downvotes = Math.max(0, solution.downvotes - 1)
          await User.findByIdAndUpdate(solution.author, { $inc: { reputation: 1 } })
        }

        await solution.save()

        return NextResponse.json({
          message: "Vote removed",
          upvotes: solution.upvotes,
          downvotes: solution.downvotes,
        })
      } else {
        // Change vote type
        const oldVoteType = existingVote.voteType
        existingVote.voteType = voteType
        await existingVote.save()

        // Update solution vote counts
        if (voteType === "upvote") {
          solution.upvotes += 1
          solution.downvotes = Math.max(0, solution.downvotes - 1)
          await User.findByIdAndUpdate(solution.author, { $inc: { reputation: 3 } })
        } else {
          solution.downvotes += 1
          solution.upvotes = Math.max(0, solution.upvotes - 1)
          await User.findByIdAndUpdate(solution.author, { $inc: { reputation: -3 } })
        }

        await solution.save()

        return NextResponse.json({
          message: "Vote changed",
          upvotes: solution.upvotes,
          downvotes: solution.downvotes,
        })
      }
    }

    // Create new vote
    await Vote.create({
      user: session.userId,
      target: params.id,
      targetType: "Solution",
      voteType,
    })

    // Update solution vote count
    if (voteType === "upvote") {
      solution.upvotes += 1
      await User.findByIdAndUpdate(solution.author, { $inc: { reputation: 2 } })
    } else {
      solution.downvotes += 1
      await User.findByIdAndUpdate(solution.author, { $inc: { reputation: -1 } })
    }

    await solution.save()

    return NextResponse.json({
      message: "Vote recorded",
      upvotes: solution.upvotes,
      downvotes: solution.downvotes,
    })
  } catch (error: any) {
    console.error("[v0] Vote error:", error)
    return NextResponse.json({ error: "Failed to record vote" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ userVote: null })
    }

    await connectDB()

    const vote = await Vote.findOne({
      user: session.userId,
      target: params.id,
    })

    return NextResponse.json({ userVote: vote?.voteType || null })
  } catch (error) {
    console.error("[v0] Get vote error:", error)
    return NextResponse.json({ userVote: null })
  }
}
