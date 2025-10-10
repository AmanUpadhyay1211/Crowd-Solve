import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Solution from "@/lib/models/Solution"
import Problem from "@/lib/models/Problem"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sortBy') || 'votes'
    const order = searchParams.get('order') || 'desc'
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build query
    const query: any = {}
    if (status) {
      query.isAccepted = status === 'accepted'
    }

    // Build sort object
    const sort: any = {}
    if (sortBy === 'votes') {
      sort.votes = order === 'desc' ? -1 : 1
    } else if (sortBy === 'upvotes') {
      sort.upvotes = order === 'desc' ? -1 : 1
    } else if (sortBy === 'createdAt') {
      sort.createdAt = order === 'desc' ? -1 : 1
    }

    // Calculate skip
    const skip = (page - 1) * limit

    // Fetch solutions with pagination
    const solutions = await Solution.find(query)
      .populate('author', 'username avatar reputation')
      .populate('problem', 'title description status')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await Solution.countDocuments(query)
    const pages = Math.ceil(total / limit)

    // Normalize the data
    const normalizedSolutions = solutions.map(solution => ({
      ...solution,
      _id: solution._id.toString(),
      author: {
        _id: solution.author._id.toString(),
        username: solution.author.username,
        avatar: solution.author.avatar,
        reputation: solution.author.reputation || 0
      },
      problem: {
        _id: solution.problem._id.toString(),
        title: solution.problem.title,
        description: solution.problem.description,
        status: solution.problem.status
      },
      upvotes: solution.upvotes || 0,
      downvotes: solution.downvotes || 0,
      votes: solution.votes || solution.upvotes || 0,
      isAccepted: solution.isAccepted || false,
      createdAt: solution.createdAt.toISOString(),
      updatedAt: solution.updatedAt.toISOString()
    }))

    return NextResponse.json({
      solutions: normalizedSolutions,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    })

  } catch (error: any) {
    console.error("[v0] Get solutions error:", error)
    return NextResponse.json(
      { error: "Failed to fetch solutions" },
      { status: 500 }
    )
  }
}
