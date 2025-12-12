"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  className?: string
}

export function RatingStars({ rating, maxRating = 5, size = "md", showValue = false, className }: RatingStarsProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const isFilled = i < Math.floor(rating)
        const isHalf = i < rating && i >= Math.floor(rating)

        return (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              isFilled
                ? "fill-warning text-warning"
                : isHalf
                  ? "fill-warning/50 text-warning"
                  : "fill-muted text-muted",
            )}
          />
        )
      })}
      {showValue && (
        <span className={cn("ml-1 font-semibold text-foreground", textSizeClasses[size])}>{rating.toFixed(1)}</span>
      )}
    </div>
  )
}
