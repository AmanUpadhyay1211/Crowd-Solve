import { Navbar } from "@/components/navbar"
import { SolutionsList } from "@/components/solutions-list"
import { SolutionListSkeleton } from "@/components/skeletons/solution-card-skeleton"
import { Suspense } from "react"

export default function SolutionsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Top Solutions</h1>
          <p className="text-muted-foreground">Discover the most voted solutions from our community</p>
        </div>

        <Suspense fallback={<SolutionListSkeleton count={5} />}>
          <SolutionsList />
        </Suspense>
      </main>
    </div>
  )
}
