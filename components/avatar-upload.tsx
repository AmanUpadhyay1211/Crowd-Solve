"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/hooks/use-auth"
import { Upload, X, Loader2 } from "lucide-react"

interface AvatarUploadProps {
  currentAvatar?: string
  username: string
  onAvatarUpdate?: (avatarUrl: string) => void
}

export function AvatarUpload({ currentAvatar, username, onAvatarUpdate }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { setUser } = useAuth()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append("avatar", file)

      const response = await fetch("/api/users/avatar", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        onAvatarUpdate?.(data.user.avatar)
        toast({
          title: "Success",
          description: "Avatar updated successfully",
        })
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update avatar",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = async () => {
    setIsRemoving(true)
    
    try {
      const response = await fetch("/api/users/avatar", {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        onAvatarUpdate?.("")
        toast({
          title: "Success",
          description: "Avatar removed successfully",
        })
      } else {
        throw new Error(data.error || "Removal failed")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove avatar",
        variant: "destructive",
      })
    } finally {
      setIsRemoving(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={currentAvatar || "/placeholder.svg"} alt={username} />
        <AvatarFallback className="text-2xl">{username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex gap-2">
        <Button
          onClick={handleClick}
          disabled={isUploading || isRemoving}
          size="sm"
          className="gap-2"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isUploading ? "Uploading..." : "Upload Avatar"}
        </Button>

        {currentAvatar && (
          <Button
            onClick={handleRemove}
            disabled={isUploading || isRemoving}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            {isRemoving ? "Removing..." : "Remove"}
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground text-center max-w-xs">
        Upload a JPG, PNG, WebP, or GIF file. Max size: 2MB
      </p>
    </div>
  )
}
