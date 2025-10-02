import { Navbar } from "@/components/navbar"
import { ProblemDetail } from "@/components/problem-detail"

export default function ProblemPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ProblemDetail problemId={params.id} />
    </div>
  )
}
