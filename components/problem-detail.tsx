"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Calendar, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { SolutionForm } from "@/components/solution-form"
import { SolutionCard } from "@/components/solution-card"
import { useAuth } from "@/lib/hooks/use-auth"
import { useProblemsStore } from "@/lib/stores/problems-store"
import { useSolutionsStore } from "@/lib/stores/solutions-store"
import { ProblemDetailSkeleton } from "@/components/skeletons/problem-detail-skeleton"
import { SolutionListSkeleton } from "@/components/skeletons/solution-card-skeleton"

export function ProblemDetail({ problemId }: { problemId: string }) {
  const { user } = useAuth()
  const { 
    currentProblem, 
    isLoading: problemLoading, 
    error: problemError,
    refreshProblems 
  } = useProblemsStore()
  const { 
    solutions, 
    isLoading: solutionsLoading, 
    error: solutionsError,
    refreshSolutions 
  } = useSolutionsStore()
  const handleRefresh = () => {
    refreshProblems()
    refreshSolutions(problemId)
  }

  if (problemLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <ProblemDetailSkeleton />
      </main>
    )
  }

  if (problemError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-destructive mb-4">{problemError}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </div>
      </div>
    )
  }

  if (!currentProblem) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Problem not found</p>
        </div>
      </div>
    )
  }

  const isProblemAuthor = user?.id === currentProblem.author._id

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header with refresh button */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Problem Details</h1>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold text-balance">{currentProblem.title}</h1>
              <Badge
                variant={currentProblem.status === "solved" ? "default" : currentProblem.status === "open" ? "secondary" : "outline"}
              >
                {currentProblem.status}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href={`/profile/${currentProblem.author.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentProblem.author.avatar || "/placeholder.svg"} alt={currentProblem.author.username} />
                  <AvatarFallback>{currentProblem.author.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground hover:text-primary transition-colors">{currentProblem.author.username}</p>
                  <p className="text-xs">{currentProblem.author.reputation} reputation</p>
                </div>
              </Link>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(currentProblem.createdAt), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{currentProblem.views} views</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-pretty">{currentProblem.description}</p>
            </div>

            {currentProblem.images && currentProblem.images.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {currentProblem.images.map((image, index) => (
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

            {currentProblem.tags && currentProblem.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentProblem.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Solutions ({solutions.length})</h2>
            {solutionsError && (
              <Button onClick={() => refreshSolutions(problemId)} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            )}
          </div>

          {solutionsLoading ? (
            <SolutionListSkeleton count={3} />
          ) : solutionsError ? (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">{solutionsError}</p>
              <Button onClick={() => refreshSolutions(problemId)} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </Button>
            </div>
          ) : solutions.length > 0 ? (
            <div className="space-y-4">
              {solutions.map((solution) => (
                <SolutionCard
                  key={solution._id}
                  solution={solution}
                  isProblemAuthor={isProblemAuthor}
                  onAccept={() => {
                    refreshProblems()
                    refreshSolutions(problemId)
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No solutions yet. Be the first to help!</p>
            </div>
          )}

          <SolutionForm problemId={problemId} onSuccess={() => refreshSolutions(problemId)} />
        </div>
      </div>
    </main>
  )
}
