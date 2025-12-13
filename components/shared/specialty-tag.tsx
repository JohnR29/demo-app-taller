"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpecialtyTagProps {
  label: string
  icon?: LucideIcon
  selected?: boolean
  onClick?: () => void
  size?: "sm" | "md"
}

export function SpecialtyTag({ label, icon: Icon, selected = false, onClick, size = "md" }: SpecialtyTagProps) {
  const sizeClasses = {
    sm: "h-6 min-h-[24px] px-1.5 text-xs",
    md: "h-9 min-h-[36px] px-3 text-sm",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium transition-all",
        sizeClasses[size],
        selected
          ? "border-primary bg-primary/20 text-primary shadow-sm"
          : "border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-muted-foreground/30",
        onClick && "cursor-pointer active:scale-95",
        !onClick && "cursor-default",
      )}
    >
      {Icon && <Icon className="h-3 w-3 shrink-0" />}
      <span className="truncate">{label}</span>
    </button>
  )
}
