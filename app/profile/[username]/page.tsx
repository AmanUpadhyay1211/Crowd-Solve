import { Navbar } from "@/components/navbar"
import { UserProfile } from "@/components/user-profile"

export default function ProfilePage({ params }: { params: { username: string } }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <UserProfile username={params.username} />
    </div>
  )
}
