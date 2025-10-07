import { Navbar } from "@/components/navbar"
import { ProblemList } from "@/components/problem-list"
import { Suspense } from "react"

export default function ProblemsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Problems</h1>
          <p className="text-muted-foreground">Browse problems from the community and share your solutions</p>
        </div>

        <Suspense fallback={
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading problems...</p>
          </div>
        }>
          <ProblemList />
        </Suspense>
      </main>
    </div>
  )
}
