import { Navbar } from "@/components/navbar"
import { AdminDashboard } from "@/components/admin-dashboard"
import { AdminDashboardSkeleton } from "@/components/skeletons/admin-dashboard-skeleton"
import { Suspense } from "react"

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <Suspense fallback={<AdminDashboardSkeleton />}>
          <AdminDashboard />
        </Suspense>
      </main>
    </div>
  )
}
