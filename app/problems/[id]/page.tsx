"use client"

import { Navbar } from "@/components/navbar"
import { ProblemDetail } from "@/components/problem-detail"
import { useEffect } from "react"
import { useProblemsStore } from "@/lib/stores/problems-store"
import { useSolutionsStore } from "@/lib/stores/solutions-store"

export default function ProblemPage({ params }: { params: { id: string } }) {
  const { fetchProblemById } = useProblemsStore()
  const { fetchSolutions } = useSolutionsStore()

  useEffect(() => {
    // Fetch problem and solutions for everyone (public content)
    fetchProblemById(params.id)
    fetchSolutions(params.id)
  }, [params.id]) // Only re-run when problem ID changes

  return (
    <div className="min-h-screen">
      <Navbar />
      <ProblemDetail problemId={params.id} />
    </div>
  )
}
