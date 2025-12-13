"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { FloatingSearch } from "@/components/dashboard/floating-search"
import { ActiveOrders } from "@/components/dashboard/active-orders"
import { ClipboardList, Calendar, AlertTriangle, DollarSign, MapPin } from "lucide-react"
import { useBranch } from "@/contexts/branch-context"
import { Badge } from "@/components/ui/badge"
import { designTokens } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"
import { mockOrdersWithBranches, mockInventoryWithBranches, mockAppointmentsWithBranches } from "@/lib/mock-data-branches"

export default function DashboardPage() {
  const { selectedBranchId, currentBranch, isGlobalView } = useBranch()

  // Filtrar datos según sucursal seleccionada
  const filteredOrders = isGlobalView 
    ? mockOrdersWithBranches 
    : mockOrdersWithBranches.filter(o => o.branchId === selectedBranchId)
  
  const filteredInventory = isGlobalView
    ? mockInventoryWithBranches
    : mockInventoryWithBranches.filter(i => i.branchId === selectedBranchId)
  
  const filteredAppointments = isGlobalView
    ? mockAppointmentsWithBranches
    : mockAppointmentsWithBranches.filter(a => a.branchId === selectedBranchId)

  const activeOrders = filteredOrders.filter(o => o.status === "in-progress").length
  const todayAppointments = filteredAppointments.length
  const lowStockItems = filteredInventory.filter(i => i.stock <= i.minStock).length
  const todayRevenue = filteredOrders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + o.estimatedCost, 0)

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Buenos días, Carlos</h1>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Viernes, 12 de Diciembre 2025</p>
            {!isGlobalView && currentBranch && (
              <Badge variant="outline" className="gap-1">
                <MapPin className={cn(designTokens.icon.xs)} />
                {currentBranch.name}
              </Badge>
            )}
            {isGlobalView && (
              <Badge variant="secondary" className={cn(designTokens.typography.bodyMd)}>
                Vista Consolidada
              </Badge>
            )}
          </div>
        </div>

        {/* Floating Search */}
        <FloatingSearch />

        {/* Quick Actions */}
        <QuickActions />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <KpiCard
            title="Órdenes Activas"
            value={activeOrders}
            icon={ClipboardList}
            variant="success"
            trend={{ value: 12, isPositive: true }}
          />
          <KpiCard 
            title="Citas Hoy" 
            value={todayAppointments} 
            icon={Calendar} 
            variant="info" 
          />
          <KpiCard 
            title="Stock Bajo" 
            value={lowStockItems} 
            icon={AlertTriangle} 
            variant="warning" 
          />
          <KpiCard 
            title="Facturado Hoy" 
            value={`$${(todayRevenue / 1000).toFixed(1)}k`} 
            icon={DollarSign} 
            variant="default" 
          />
        </div>

        {/* Active Orders */}
        <ActiveOrders />
      </div>
    </AppLayout>
  )
}
