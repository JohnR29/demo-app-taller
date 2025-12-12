"use client"

import Link from "next/link"
import { Plus, Calendar, ScanBarcode } from "lucide-react"
import { cn } from "@/lib/utils"

const actions = [
  {
    href: "/ordenes/nueva",
    icon: Plus,
    label: "Nueva Orden",
    variant: "primary" as const,
  },
  {
    href: "/citas/nueva",
    icon: Calendar,
    label: "Agendar Cita",
    variant: "secondary" as const,
  },
  {
    href: "/inventario?scan=true",
    icon: ScanBarcode,
    label: "Escanear",
    variant: "secondary" as const,
  },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={cn(
            "flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-lg border p-3 transition-all active:scale-95",
            action.variant === "primary"
              ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
              : "border-border bg-card text-foreground hover:bg-secondary",
          )}
        >
          <action.icon className="h-6 w-6" />
          <span className="text-xs font-medium">{action.label}</span>
        </Link>
      ))}
    </div>
  )
}
