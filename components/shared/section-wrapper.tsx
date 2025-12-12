import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { designTokens } from "@/lib/design-tokens"

interface SectionWrapperProps {
  children: ReactNode
  title?: string
  icon?: LucideIcon
  className?: string
  contentClassName?: string
}

export function SectionWrapper({ children, title, icon: Icon, className, contentClassName }: SectionWrapperProps) {
  return (
    <div className={cn(designTokens.card.base, designTokens.spacing.card, className)}>
      {title && (
        <div className="mb-1 flex items-center gap-1">
          {Icon && <Icon className={cn(designTokens.icon.sm, "text-muted-foreground")} />}
          <h2 className={designTokens.typography.h3}>{title}</h2>
        </div>
      )}
      <div className={cn(contentClassName)}>{children}</div>
    </div>
  )
}
