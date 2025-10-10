import { Navbar } from "@/components/navbar"
import { UserProfile } from "@/components/user-profile"
import { UserProfileSkeleton } from "@/components/skeletons/user-profile-skeleton"
import { Suspense } from "react"

export default function ProfilePage({ params }: { params: { username: string } }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfile username={params.username} />
      </Suspense>
    </div>
  )
}
