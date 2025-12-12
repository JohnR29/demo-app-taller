import { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { designTokens } from "@/lib/design-tokens"

interface PageWrapperProps {
  children: ReactNode
  title?: string
  icon?: LucideIcon
  backHref?: string
  headerActions?: ReactNode
  className?: string
  useScrollArea?: boolean
}

export function PageWrapper({
  children,
  title,
  icon: Icon,
  backHref,
  headerActions,
  className,
  useScrollArea = true,
}: PageWrapperProps) {
  const content = (
    <main className={cn(designTokens.spacing.page, className)}>
      <div className={designTokens.layout.container}>{children}</div>
    </main>
  )

  return (
    <div className={designTokens.layout.page}>
      {(title || backHref) && (
        <header className={designTokens.header.container}>
          <div className={cn(designTokens.header.content, "justify-between")}>
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
              {backHref && (
                <Link href={backHref} className="shrink-0">
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <ArrowLeft className={designTokens.icon.lg} />
                  </Button>
                </Link>
              )}
              {Icon && <Icon className={cn(designTokens.icon.lg, "shrink-0 text-primary")} />}
              {title && <h1 className={designTokens.header.title}>{title}</h1>}
            </div>
            {headerActions && <div className="shrink-0">{headerActions}</div>}
          </div>
        </header>
      )}
      {useScrollArea ? <ScrollArea className="flex-1">{content}</ScrollArea> : content}
    </div>
  )
}
