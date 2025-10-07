"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { SolutionForm } from "@/components/solution-form"
import { SolutionCard } from "@/components/solution-card"
import { useAuth } from "@/lib/hooks/use-auth"

interface Problem {
  _id: string
  title: string
  description: string
  images: string[]
  tags: string[]
  status: string
  views: number
  author: {
    _id: string
    username: string
    avatar?: string
    reputation: number
  }
  createdAt: string
}

interface Solution {
  _id: string
  content: string
  images: string[]
  upvotes: number
  downvotes: number
  isAccepted: boolean
  author: {
    username: string
    avatar?: string
    reputation: number
  }
  createdAt: string
}

export function ProblemDetail({ problemId }: { problemId: string }) {
  const { user } = useAuth()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProblem()
    fetchSolutions()
  }, [problemId])

  const fetchProblem = async () => {
    try {
      const response = await fetch(`/api/problems/${problemId}`)
      const data = await response.json()
      setProblem(data.problem)
    } catch (error) {
      console.error("[v0] Fetch problem error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSolutions = async () => {
    try {
      const response = await fetch(`/api/problems/${problemId}/solutions`)
      const data = await response.json()
      setSolutions(data.solutions)
    } catch (error) {
      console.error("[v0] Fetch solutions error:", error)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!problem) {
    return <div className="container mx-auto px-4 py-8">Problem not found</div>
  }

  const isProblemAuthor = user?.id === problem.author._id

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold text-balance">{problem.title}</h1>
              <Badge
                variant={problem.status === "solved" ? "default" : problem.status === "open" ? "secondary" : "outline"}
              >
                {problem.status}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href={`/profile/${problem.author.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={problem.author.avatar || "/placeholder.svg"} alt={problem.author.username} />
                  <AvatarFallback>{problem.author.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground hover:text-primary transition-colors">{problem.author.username}</p>
                  <p className="text-xs">{problem.author.reputation} reputation</p>
                </div>
              </Link>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(problem.createdAt), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{problem.views} views</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-pretty">{problem.description}</p>
            </div>

            {problem.images.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {problem.images.map((image, index) => (
                  <div key={index} className="relative aspect-video overflow-hidden rounded-lg border border-border">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Problem image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {problem.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {problem.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Solutions ({solutions.length})</h2>

          {solutions.length > 0 && (
            <div className="space-y-4">
              {solutions.map((solution) => (
                <SolutionCard
                  key={solution._id}
                  solution={solution}
                  isProblemAuthor={isProblemAuthor}
                  onAccept={() => {
                    fetchProblem()
                    fetchSolutions()
                  }}
                />
              ))}
            </div>
          )}

          <SolutionForm problemId={problemId} onSuccess={fetchSolutions} />
        </div>
      </div>
    </main>
  )
}
