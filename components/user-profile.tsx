"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, FileQuestion, Lightbulb, CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { UserProfileSkeleton } from "@/components/skeletons/user-profile-skeleton"

interface User {
  username: string
  email: string
  bio?: string
  avatar?: string
  reputation: number
  createdAt: string
}

interface Problem {
  _id: string
  title: string
  status: string
  views: number
  createdAt: string
}

interface Solution {
  _id: string
  content: string
  upvotes: number
  isAccepted: boolean
  problem: {
    title: string
  }
  createdAt: string
}

interface Stats {
  problemCount: number
  solutionCount: number
  acceptedSolutionCount: number
}

export function UserProfile({ username }: { username: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [problems, setProblems] = useState<Problem[]>([])
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUserProfile()
  }, [username])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/${username}`)
      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setProblems(data.problems)
        setSolutions(data.solutions)
        setStats(data.stats)
      }
    } catch (error) {
      console.error("[v0] Fetch user profile error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <UserProfileSkeleton />
      </main>
    )
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-8">User not found</div>
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                <AvatarFallback className="text-2xl">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
                {user.bio && <p className="text-muted-foreground mb-4">{user.bio}</p>}
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="text-lg font-semibold">{user.reputation} reputation</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Member since {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {stats && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Problems Posted</CardTitle>
                <FileQuestion className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.problemCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Solutions Given</CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.solutionCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accepted Solutions</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.acceptedSolutionCount}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Activity Tabs */}
        <Tabs defaultValue="problems" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="problems">Problems</TabsTrigger>
            <TabsTrigger value="solutions">Solutions</TabsTrigger>
          </TabsList>

          <TabsContent value="problems" className="space-y-4">
            {problems.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">No problems posted yet</CardContent>
              </Card>
            ) : (
              problems.map((problem) => (
                <Link key={problem._id} href={`/problems/${problem._id}`}>
                  <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-lg">{problem.title}</CardTitle>
                        <Badge
                          variant={
                            problem.status === "solved"
                              ? "default"
                              : problem.status === "open"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {problem.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {problem.views} views • {formatDistanceToNow(new Date(problem.createdAt), { addSuffix: true })}
                      </p>
                    </CardHeader>
                  </Card>
                </Link>
              ))
            )}
          </TabsContent>

          <TabsContent value="solutions" className="space-y-4">
            {solutions.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">No solutions given yet</CardContent>
              </Card>
            ) : (
              solutions.map((solution) => (
                <Card key={solution._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-2">Solution to: {solution.problem.title}</p>
                        <p className="line-clamp-2">{solution.content}</p>
                      </div>
                      {solution.isAccepted && (
                        <Badge className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Accepted
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {solution.upvotes} upvotes •{" "}
                      {formatDistanceToNow(new Date(solution.createdAt), { addSuffix: true })}
                    </p>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
