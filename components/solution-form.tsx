"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/image-upload"
import { useAuth } from "@/lib/hooks/use-auth"

interface SolutionFormProps {
  problemId: string
  onSuccess: () => void
}

export function SolutionForm({ problemId, onSuccess }: SolutionFormProps) {
  const { isAuthenticated } = useAuth()
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/problems/${problemId}/solutions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, images }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit solution")
      }

      setContent("")
      setImages([])
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Please log in to submit a solution</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Solution</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="content">Solution</Label>
            <Textarea
              id="content"
              placeholder="Share your solution to this problem..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={20}
              rows={6}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">{content.length} characters (minimum 20)</p>
          </div>

          <div className="space-y-2">
            <Label>Images (optional)</Label>
            <ImageUpload images={images} onChange={setImages} maxImages={3} />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Solution"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
