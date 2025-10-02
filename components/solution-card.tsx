"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, Check } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/lib/hooks/use-auth"
import { cn } from "@/lib/utils"

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

interface SolutionCardProps {
  solution: Solution
  isProblemAuthor: boolean
  onAccept?: () => void
}

export function SolutionCard({ solution, isProblemAuthor, onAccept }: SolutionCardProps) {
  const { isAuthenticated } = useAuth()
  const [upvotes, setUpvotes] = useState(solution.upvotes)
  const [downvotes, setDownvotes] = useState(solution.downvotes)
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null)
  const [isVoting, setIsVoting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserVote()
    }
  }, [isAuthenticated])

  const fetchUserVote = async () => {
    try {
      const response = await fetch(`/api/solutions/${solution._id}/vote`)
      const data = await response.json()
      setUserVote(data.userVote)
    } catch (error) {
      console.error("[v0] Fetch user vote error:", error)
    }
  }

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!isAuthenticated || isVoting) return

    setIsVoting(true)

    try {
      const response = await fetch(`/api/solutions/${solution._id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteType }),
      })

      if (!response.ok) {
        throw new Error("Failed to vote")
      }

      const data = await response.json()
      setUpvotes(data.upvotes)
      setDownvotes(data.downvotes)

      // Update user vote state
      if (userVote === voteType) {
        setUserVote(null)
      } else {
        setUserVote(voteType)
      }
    } catch (error) {
      console.error("[v0] Vote error:", error)
    } finally {
      setIsVoting(false)
    }
  }

  const handleAccept = async () => {
    try {
      const response = await fetch(`/api/solutions/${solution._id}/accept`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to accept solution")
      }

      onAccept?.()
    } catch (error) {
      console.error("[v0] Accept solution error:", error)
    }
  }

  return (
    <Card className={cn(solution.isAccepted && "border-primary")}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={solution.author.avatar || "/placeholder.svg"} alt={solution.author.username} />
              <AvatarFallback>{solution.author.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{solution.author.username}</p>
              <p className="text-xs text-muted-foreground">
                {solution.author.reputation} reputation •{" "}
                {formatDistanceToNow(new Date(solution.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          {solution.isAccepted && (
            <Badge className="gap-1">
              <Check className="h-3 w-3" />
              Accepted
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap text-pretty">{solution.content}</p>
        </div>

        {solution.images.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {solution.images.map((image, index) => (
              <div key={index} className="relative aspect-video overflow-hidden rounded-lg border border-border">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Solution image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant={userVote === "upvote" ? "default" : "outline"}
              size="sm"
              onClick={() => handleVote("upvote")}
              disabled={!isAuthenticated || isVoting}
              className="gap-1"
            >
              <ThumbsUp className="h-4 w-4" />
              {upvotes}
            </Button>

            <Button
              variant={userVote === "downvote" ? "default" : "outline"}
              size="sm"
              onClick={() => handleVote("downvote")}
              disabled={!isAuthenticated || isVoting}
              className="gap-1"
            >
              <ThumbsDown className="h-4 w-4" />
              {downvotes}
            </Button>
          </div>

          {isProblemAuthor && !solution.isAccepted && (
            <Button variant="outline" size="sm" onClick={handleAccept} className="ml-auto gap-1 bg-transparent">
              <Check className="h-4 w-4" />
              Accept Solution
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
