"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, RefreshCw, Filter } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useProblemsStore } from "@/lib/stores/problems-store"
import { useAuth } from "@/lib/hooks/use-auth"

export function ProblemList() {
  const { isAuthenticated } = useAuth()
  const {
    problems,
    isLoading,
    isRefreshing,
    error,
    pagination,
    filters,
    fetchProblems,
    refreshProblems,
    setFilters,
    shouldRefresh
  } = useProblemsStore()

  useEffect(() => {
    if (isAuthenticated) {
      fetchProblems()
    }
  }, [isAuthenticated, fetchProblems])

  const handleRefresh = () => {
    refreshProblems()
  }

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters)
    fetchProblems(newFilters, true)
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
    <div className="space-y-6">
      {/* Header with refresh button and filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {pagination ? `${pagination.total} Problems` : 'Problems'}
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

      {/* Problems List */}
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
    </div>
  )
}
