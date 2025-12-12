import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface StockChipProps {
  enStock: boolean
  className?: string
}

export function StockChip({ enStock, className }: StockChipProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        enStock ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {enStock ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {enStock ? "En Stock" : "Sin Stock"}
    </span>
  )
}
