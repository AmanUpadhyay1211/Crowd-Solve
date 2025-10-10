"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, FileQuestion, Lightbulb, CheckCircle, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { AdminDashboardSkeleton } from "@/components/skeletons/admin-dashboard-skeleton"

interface Stats {
  totalUsers: number
  totalProblems: number
  totalSolutions: number
  solvedProblems: number
  openProblems: number
}

interface Problem {
  _id: string
  title: string
  status: string
  author: {
    username: string
  }
  createdAt: string
}

interface Solution {
  _id: string
  content: string
  author: {
    username: string
  }
  problem: {
    title: string
  }
  createdAt: string
}

interface TopUser {
  username: string
  avatar?: string
  reputation: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentProblems, setRecentProblems] = useState<Problem[]>([])
  const [recentSolutions, setRecentSolutions] = useState<Solution[]>([])
  const [topUsers, setTopUsers] = useState<TopUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()

      if (response.ok) {
        setStats(data.stats)
        setRecentProblems(data.recentProblems)
        setRecentSolutions(data.recentSolutions)
        setTopUsers(data.topUsers)
      }
    } catch (error) {
      console.error("[v0] Fetch admin stats error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <AdminDashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
              <FileQuestion className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProblems}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Solutions</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSolutions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.solvedProblems}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.openProblems}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Problems */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Problems</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProblems.map((problem) => (
              <div key={problem._id} className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium line-clamp-1">{problem.title}</p>
                  <p className="text-sm text-muted-foreground">
                    by {problem.author.username} •{" "}
                    {formatDistanceToNow(new Date(problem.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <Badge variant={problem.status === "solved" ? "default" : "secondary"}>{problem.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Solutions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Solutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSolutions.map((solution) => (
              <div key={solution._id}>
                <p className="text-sm text-muted-foreground mb-1">Solution to: {solution.problem.title}</p>
                <p className="line-clamp-2 text-sm">{solution.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  by {solution.author.username} •{" "}
                  {formatDistanceToNow(new Date(solution.createdAt), { addSuffix: true })}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Users */}
      <Card>
        <CardHeader>
          <CardTitle>Top Users by Reputation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div key={user.username} className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold">
                  {index + 1}
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.reputation} reputation</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
