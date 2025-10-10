"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, CheckCircle, RefreshCw, Filter, Trophy } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useSolutionsStore } from "@/lib/stores/solutions-store"
import { SolutionListSkeleton } from "@/components/skeletons/solution-card-skeleton"
import { SmartPagination } from "@/components/smart-pagination"

export function SolutionsList() {
  const {
    solutions,
    isLoading,
    isRefreshing,
    error,
    pagination,
    filters,
    fetchAllSolutions,
    refreshSolutions,
    goToPage,
    setFilters,
    shouldRefresh
  } = useSolutionsStore()

  useEffect(() => {
    // Fetch top solutions (sorted by votes)
    fetchAllSolutions({ sortBy: "votes", order: "desc" })
  }, [])

  const handleRefresh = () => {
    fetchAllSolutions({ sortBy: "votes", order: "desc" }, true)
  }

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters)
    fetchAllSolutions({ ...filters, ...newFilters, sortBy: "votes", order: "desc" }, true)
  }

  if (isLoading) {
    return <SolutionListSkeleton count={5} />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button 
          onClick={handleRefresh}
          variant="outline"
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Retrying...
            </>
          ) : (
            'Try again'
          )}
        </Button>
      </div>
    )
  }

  if (solutions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No solutions found</p>
        <Link href="/problems" className="text-primary hover:underline">
          Browse problems to find solutions
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button and filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {pagination ? `${pagination.total} Solutions` : 'Top Solutions'}
          </h2>
          {shouldRefresh() && (
            <Badge variant="outline" className="text-xs">
              Data may be outdated
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Solutions List */}
      <div className="space-y-4">
        {solutions.map((solution) => {
          const problemId = typeof solution.problem === 'string' ? solution.problem : solution.problem._id
          const problemTitle = typeof solution.problem === 'string' ? 'Unknown Problem' : solution.problem.title
          
          return (
            <Link key={solution._id} href={`/problems/${problemId}`}>
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-balance">
                          Solution to: {problemTitle}
                        </h3>
                      {solution.isAccepted && (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Accepted
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-pretty">
                      {solution.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Trophy className="h-4 w-4" />
                      <span className="font-medium">{solution.votes}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <Link href={`/profile/${solution.author.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={solution.author.avatar || "/placeholder.svg"} alt={solution.author.username} />
                      <AvatarFallback>{solution.author.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="hover:text-primary transition-colors">{solution.author.username}</span>
                  </Link>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(solution.createdAt), { addSuffix: true })}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{solution.upvotes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsDown className="h-4 w-4" />
                    <span>{solution.downvotes}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </Link>
          )
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8">
          <SmartPagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  )
}
