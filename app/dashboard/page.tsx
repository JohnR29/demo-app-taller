import { AppLayout } from "@/components/layout/app-layout"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { FloatingSearch } from "@/components/dashboard/floating-search"
import { ActiveOrders } from "@/components/dashboard/active-orders"
import { ClipboardList, Calendar, AlertTriangle, DollarSign } from "lucide-react"

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Buenos días, Carlos</h1>
          <p className="text-sm text-muted-foreground">Viernes, 11 de Diciembre 2025</p>
        </div>

        {/* Floating Search */}
        <FloatingSearch />

        {/* Quick Actions */}
        <QuickActions />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <KpiCard
            title="Órdenes Activas"
            value={8}
            icon={ClipboardList}
            variant="success"
            trend={{ value: 12, isPositive: true }}
          />
          <KpiCard title="Citas Hoy" value={5} icon={Calendar} variant="info" />
          <KpiCard title="Stock Bajo" value={3} icon={AlertTriangle} variant="warning" />
          <KpiCard title="Facturado Hoy" value="$1.2M" icon={DollarSign} variant="default" />
        </div>

        {/* Active Orders */}
        <ActiveOrders />
      </div>
    </AppLayout>
  )
}
