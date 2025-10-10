"use client"

import { Navbar } from "@/components/navbar"
import { ProblemList } from "@/components/problem-list"
import { Suspense, useEffect } from "react"
import { useProblemsStore } from "@/lib/stores/problems-store"
import { ProblemListSkeleton } from "@/components/skeletons/problem-card-skeleton"

export default function ProblemsPage() {
  const { fetchProblems, isLoading, error } = useProblemsStore()

  // Fetch problems on component mount (visible to everyone)
  useEffect(() => {
    fetchProblems()
  }, []) // Empty dependency array - only run once on mount

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Problems</h1>
          <p className="text-muted-foreground">Browse problems from the community and share your solutions</p>
        </div>

        <Suspense fallback={<ProblemListSkeleton count={5} />}>
          <ProblemList />
        </Suspense>
      </main>
    </div>
  )
}
