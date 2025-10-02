import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { uploadToCloudinary } from "@/lib/cloudinary"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    await connectDB()

    const formData = await request.formData()
    const file = formData.get("avatar") as File

    if (!file) {
      return NextResponse.json({ error: "No avatar file provided" }, { status: 400 })
    }

    // Validate file type and size
    const maxSize = 2 * 1024 * 1024 // 2MB for avatars
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 })
    }

    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds 2MB limit" }, { status: 400 })
    }

    // Upload to Cloudinary
    const avatarUrl = await uploadToCloudinary(file, "crowdsolve/avatars")

    // Update user's avatar in database
    const updatedUser = await User.findByIdAndUpdate(
      session.userId,
      { avatar: avatarUrl },
      { new: true, select: "-password" }
    )

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ 
      message: "Avatar updated successfully",
      user: updatedUser 
    })
  } catch (error: any) {
    console.error("[v0] Avatar upload error:", error)
    return NextResponse.json({ error: "Avatar upload failed" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    await connectDB()

    // Remove avatar from user
    const updatedUser = await User.findByIdAndUpdate(
      session.userId,
      { $unset: { avatar: 1 } },
      { new: true, select: "-password" }
    )

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ 
      message: "Avatar removed successfully",
      user: updatedUser 
    })
  } catch (error: any) {
    console.error("[v0] Avatar removal error:", error)
    return NextResponse.json({ error: "Avatar removal failed" }, { status: 500 })
  }
}
