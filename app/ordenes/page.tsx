"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { OrdersList } from "@/components/orders/orders-list"
import { OrdersFilter } from "@/components/orders/orders-filter"
import { Plus, MapPin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useBranch } from "@/contexts/branch-context"
import { mockOrdersWithBranches } from "@/lib/mock-data-branches"
import { designTokens } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

export default function OrdenesPage() {
  const { selectedBranchId, currentBranch, isGlobalView } = useBranch()

  // Filtrar órdenes por sucursal
  const filteredOrders = isGlobalView
    ? mockOrdersWithBranches
    : mockOrdersWithBranches.filter(o => o.branchId === selectedBranchId)

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">Órdenes de Trabajo</h1>
              {!isGlobalView && currentBranch && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className={cn(designTokens.icon.xs)} />
                  {currentBranch.code}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {isGlobalView 
                ? `${filteredOrders.length} órdenes en todas las sucursales`
                : `${filteredOrders.length} órdenes en ${currentBranch?.name}`
              }
            </p>
          </div>
          <Link href="/ordenes/nueva">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nueva OT</span>
            </Button>
          </Link>
        </div>

        <OrdersFilter />
        <OrdersList />
      </div>
    </AppLayout>
  )
}
