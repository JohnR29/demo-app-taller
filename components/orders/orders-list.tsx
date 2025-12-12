"use client"

import Link from "next/link"
import { ChevronRight, Clock, User, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useBranch } from "@/contexts/branch-context"
import { mockOrdersWithBranches } from "@/lib/mock-data-branches"
import { designTokens } from "@/lib/design-tokens"

const statusConfig = {
  "in-progress": { label: "En Progreso", className: "bg-primary/20 text-primary border-primary/30" },
  "pending": { label: "Pendiente", className: "bg-warning/20 text-warning border-warning/30" },
  "completed": { label: "Completada", className: "bg-accent/20 text-accent border-accent/30" },
}

export function OrdersList() {
  const { selectedBranchId, isGlobalView } = useBranch()

  // Filtrar órdenes por sucursal
  const orders = isGlobalView
    ? mockOrdersWithBranches
    : mockOrdersWithBranches.filter(o => o.branchId === selectedBranchId)

  return (
    <div className="space-y-2">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/ordenes/${order.id}`}
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary active:scale-[0.99]"
        >
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base font-bold text-foreground">{order.vehicleId}</span>
              <Badge variant="outline" className={cn("text-xs", statusConfig[order.status].className)}>
                {statusConfig[order.status].label}
              </Badge>
              <span className="text-xs text-muted-foreground">{order.id}</span>
              {isGlobalView && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <MapPin className={cn(designTokens.icon.xs)} />
                  {order.branchName.replace("Sucursal ", "")}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{order.vehicle}</p>
            <p className="text-sm text-foreground">{order.service}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {order.client}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {order.date}
              </span>
              <span className="font-medium text-foreground">${order.estimatedCost.toLocaleString()}</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Link>
      ))}
    </div>
  )
}
