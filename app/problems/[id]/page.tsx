"use client"

import { Navbar } from "@/components/navbar"
import { ProblemDetail } from "@/components/problem-detail"
import { useEffect } from "react"
import { useProblemsStore } from "@/lib/stores/problems-store"
import { useSolutionsStore } from "@/lib/stores/solutions-store"
import { useAuth } from "@/lib/hooks/use-auth"

export default function ProblemPage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuth()
  const { fetchProblemById } = useProblemsStore()
  const { fetchSolutions } = useSolutionsStore()

  useEffect(() => {
    if (isAuthenticated) {
      fetchProblemById(params.id)
      fetchSolutions(params.id)
    }
  }, [isAuthenticated, params.id, fetchProblemById, fetchSolutions])

  return (
    <div className="min-h-screen">
      <Navbar />
      <ProblemDetail problemId={params.id} />
    </div>
  )
}
