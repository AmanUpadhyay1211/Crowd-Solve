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
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    fetchProblems()
  }, [])

  const retry = () => {
    setRetryCount(prev => prev + 1)
    fetchProblems()
  }

  const fetchProblems = async () => {
    try {
      setError(null)
      const response = await fetch("/api/problems", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format')
      }
      
      // Ensure problems is an array and normalize the data
      const normalizedProblems = (data.problems || []).map((problem: any) => ({
        ...problem,
        tags: Array.isArray(problem.tags) ? problem.tags : [],
        images: Array.isArray(problem.images) ? problem.images : [],
        author: problem.author || { username: 'Unknown', avatar: null, reputation: 0 }
      }))
      
      setProblems(normalizedProblems)
      setRetryCount(0) // Reset retry count on success
    } catch (error: any) {
      console.error("[v0] Fetch problems error:", error)
      
      let errorMessage = "Failed to load problems. Please try again."
      if (error.name === 'TimeoutError') {
        errorMessage = "Request timed out. Please check your connection and try again."
      } else if (error.message.includes('HTTP error')) {
        errorMessage = `Server error (${error.message.split('status: ')[1]}). Please try again later.`
      }
      
      setError(errorMessage)
      setProblems([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading problems...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <button 
          onClick={retry}
          className="text-primary hover:underline"
          disabled={retryCount >= 3}
        >
          {retryCount >= 3 ? 'Max retries reached' : 'Try again'}
        </button>
        {retryCount >= 3 && (
          <p className="text-sm text-muted-foreground mt-2">
            Please refresh the page or contact support if the problem persists.
          </p>
        )}
      </div>
    )
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

            {problem.tags && problem.tags.length > 0 && (
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
                <Link href={`/profile/${problem.author.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={problem.author.avatar || "/placeholder.svg"} alt={problem.author.username} />
                    <AvatarFallback>{problem.author.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hover:text-primary transition-colors">{problem.author.username}</span>
                </Link>
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
