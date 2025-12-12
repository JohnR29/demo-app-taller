import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "success" | "warning" | "info"
}

export function KpiCard({ title, value, icon: Icon, trend, variant = "default" }: KpiCardProps) {
  const variantStyles = {
    default: "border-border",
    success: "border-primary/30",
    warning: "border-warning/30",
    info: "border-accent/30",
  }

  const iconStyles = {
    default: "bg-secondary text-foreground",
    success: "bg-primary/20 text-primary",
    warning: "bg-warning/20 text-warning",
    info: "bg-accent/20 text-accent",
  }

  return (
    <div className={cn("rounded-lg border bg-card p-4", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          {trend && (
            <p className={cn("text-xs font-medium", trend.isPositive ? "text-primary" : "text-destructive")}>
              {trend.isPositive ? "+" : ""}
              {trend.value}% vs ayer
            </p>
          )}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
