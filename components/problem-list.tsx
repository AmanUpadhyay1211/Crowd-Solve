"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Problem {
  _id: string
  title: string
  description: string
  tags: string[]
  status: string
  views: number
  author: {
    username: string
    avatar?: string
    reputation: number
  }
  createdAt: string
}

export function ProblemList() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProblems()
  }, [])

  const fetchProblems = async () => {
    try {
      const response = await fetch("/api/problems")
      const data = await response.json()
      setProblems(data.problems)
    } catch (error) {
      console.error("[v0] Fetch problems error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading problems...</div>
  }

  if (problems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No problems found</p>
        <Link href="/problems/new" className="text-primary hover:underline">
          Be the first to post a problem
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {problems.map((problem) => (
        <Link key={problem._id} href={`/problems/${problem._id}`}>
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-balance">{problem.title}</h3>
                  <p className="text-muted-foreground line-clamp-2 text-pretty">{problem.description}</p>
                </div>
                <Badge
                  variant={
                    problem.status === "solved" ? "default" : problem.status === "open" ? "secondary" : "outline"
                  }
                >
                  {problem.status}
                </Badge>
              </div>
            </CardHeader>

            {problem.tags.length > 0 && (
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            )}

            <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={problem.author.avatar || "/placeholder.svg"} alt={problem.author.username} />
                    <AvatarFallback>{problem.author.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{problem.author.username}</span>
                </div>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(problem.createdAt), { addSuffix: true })}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{problem.views}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
