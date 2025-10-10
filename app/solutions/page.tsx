import { Navbar } from "@/components/navbar"
import { SolutionListSkeleton } from "@/components/skeletons/solution-card-skeleton"
import { Suspense } from "react"

export default function SolutionsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Solutions</h1>
          <p className="text-muted-foreground">Browse solutions from the community</p>
        </div>

        <Suspense fallback={<SolutionListSkeleton count={5} />}>
          <div className="text-center py-12 text-muted-foreground">
            Solutions are displayed on individual problem pages
          </div>
        </Suspense>
      </main>
    </div>
  )
}
