import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Problem from "@/lib/models/Problem"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const tag = searchParams.get("tag")
    const search = searchParams.get("search")

    const query: any = {}

    if (status) {
      query.status = status
    }

    if (tag) {
      query.tags = tag
    }

    if (search) {
      query.$text = { $search: search }
    }

    const skip = (page - 1) * limit

    const [problems, total] = await Promise.all([
      Problem.find(query)
        .populate("author", "username avatar reputation")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Problem.countDocuments(query),
    ])

    return NextResponse.json({
      problems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Get problems error:", error)
    return NextResponse.json({ error: "Failed to fetch problems" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { title, description, images, tags, location } = await request.json()

    // Validation
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    if (title.length < 10 || title.length > 200) {
      return NextResponse.json({ error: "Title must be between 10 and 200 characters" }, { status: 400 })
    }

    if (description.length < 20) {
      return NextResponse.json({ error: "Description must be at least 20 characters" }, { status: 400 })
    }

    await connectDB()

    const problem = await Problem.create({
      title,
      description,
      images: images || [],
      tags: tags || [],
      location,
      author: session.userId,
    })

    const populatedProblem = await Problem.findById(problem._id).populate("author", "username avatar reputation").lean()

    return NextResponse.json({ problem: populatedProblem }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Create problem error:", error)
    return NextResponse.json({ error: "Failed to create problem" }, { status: 500 })
  }
}
