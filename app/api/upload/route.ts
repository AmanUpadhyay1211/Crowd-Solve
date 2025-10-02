import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { uploadToCloudinary } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // Validate file types and sizes
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 })
      }

      if (file.size > maxSize) {
        return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 })
      }
    }

    // Upload to Cloudinary
    const uploadPromises = files.map((file) => uploadToCloudinary(file, "crowdsolve/problems"))

    const urls = await Promise.all(uploadPromises)

    return NextResponse.json({ urls })
  } catch (error: any) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
