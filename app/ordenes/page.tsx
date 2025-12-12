import { AppLayout } from "@/components/layout/app-layout"
import { OrdersList } from "@/components/orders/orders-list"
import { OrdersFilter } from "@/components/orders/orders-filter"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function OrdenesPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Órdenes de Trabajo</h1>
            <p className="text-sm text-muted-foreground">Gestiona todas las OT del taller</p>
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
