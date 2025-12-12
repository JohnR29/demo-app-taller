"use client"

import { Package, AlertTriangle, TrendingDown, TrendingUp, Eye, EyeOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface InventoryItem {
  id: string
  sku: string
  nombre: string
  categoria: string
  stockActual: number
  stockMinimo: number
  precio: number
  ultimoMovimiento: string
  visiblePortal: boolean
}

const mockInventory: InventoryItem[] = [
  {
    id: "1",
    sku: "ACE-001",
    nombre: "Aceite Motor 5W-30 Mobil",
    categoria: "Aceites",
    stockActual: 24,
    stockMinimo: 10,
    precio: 15000,
    ultimoMovimiento: "Hoy",
    visiblePortal: true,
  },
  {
    id: "2",
    sku: "FIL-023",
    nombre: "Filtro de Aceite Toyota",
    categoria: "Filtros",
    stockActual: 3,
    stockMinimo: 5,
    precio: 8500,
    ultimoMovimiento: "Ayer",
    visiblePortal: true,
  },
  {
    id: "3",
    sku: "FIL-045",
    nombre: "Filtro de Aire K&N Universal",
    categoria: "Filtros",
    stockActual: 8,
    stockMinimo: 5,
    precio: 12000,
    ultimoMovimiento: "Hace 2 días",
    visiblePortal: true,
  },
  {
    id: "4",
    sku: "BUJ-112",
    nombre: "Bujía NGK Iridium",
    categoria: "Eléctricos",
    stockActual: 2,
    stockMinimo: 8,
    precio: 12000,
    ultimoMovimiento: "Hace 3 días",
    visiblePortal: false,
  },
  {
    id: "5",
    sku: "PAD-089",
    nombre: "Pastillas de Freno Brembo",
    categoria: "Frenos",
    stockActual: 6,
    stockMinimo: 4,
    precio: 45000,
    ultimoMovimiento: "Hace 1 semana",
    visiblePortal: true,
  },
  {
    id: "6",
    sku: "ACE-002",
    nombre: "Aceite Transmisión ATF",
    categoria: "Aceites",
    stockActual: 0,
    stockMinimo: 5,
    precio: 22000,
    ultimoMovimiento: "Hace 2 semanas",
    visiblePortal: false,
  },
  {
    id: "7",
    sku: "BAT-001",
    nombre: "Batería Bosch 12V 60Ah",
    categoria: "Eléctricos",
    stockActual: 4,
    stockMinimo: 3,
    precio: 95000,
    ultimoMovimiento: "Ayer",
    visiblePortal: true,
  },
]

export function InventoryList() {
  return (
    <div className="space-y-2">
      {/* Desktop Header - hidden on mobile */}
      <div className="hidden rounded-lg bg-secondary p-3 text-xs font-medium uppercase tracking-wider text-muted-foreground lg:grid lg:grid-cols-12 lg:gap-4">
        <div className="col-span-4">Producto</div>
        <div className="col-span-2 text-center">Stock</div>
        <div className="col-span-2 text-right">Precio</div>
        <div className="col-span-2 text-center">Portal</div>
        <div className="col-span-2 text-right">Último Mov.</div>
      </div>

      {/* Items */}
      {mockInventory.map((item) => {
        const isLowStock = item.stockActual <= item.stockMinimo
        const isOutOfStock = item.stockActual === 0

        return (
          <div
            key={item.id}
            className={cn(
              "rounded-lg border bg-card p-3 transition-colors hover:bg-secondary",
              "lg:grid lg:grid-cols-12 lg:items-center lg:gap-4",
              isOutOfStock && "border-destructive/30",
              isLowStock && !isOutOfStock && "border-warning/30",
            )}
          >
            {/* Product Info */}
            <div className="lg:col-span-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    isOutOfStock ? "bg-destructive/20" : isLowStock ? "bg-warning/20" : "bg-secondary",
                  )}
                >
                  {isOutOfStock || isLowStock ? (
                    <AlertTriangle className={cn("h-5 w-5", isOutOfStock ? "text-destructive" : "text-warning")} />
                  ) : (
                    <Package className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.nombre}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{item.sku}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.categoria}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 lg:col-span-8 lg:mt-0 lg:grid lg:grid-cols-8 lg:gap-4">
              {/* Stock */}
              <div className="flex items-center gap-2 lg:col-span-2 lg:justify-center">
                <span className="text-xs text-muted-foreground lg:hidden">Stock:</span>
                <span
                  className={cn(
                    "text-base font-bold lg:text-lg",
                    isOutOfStock ? "text-destructive" : isLowStock ? "text-warning" : "text-foreground",
                  )}
                >
                  {item.stockActual}
                </span>
                <span className="text-xs text-muted-foreground">/{item.stockMinimo}</span>
                {isOutOfStock ? (
                  <Badge variant="destructive" className="text-xs">
                    Sin Stock
                  </Badge>
                ) : isLowStock ? (
                  <Badge className="border-warning/30 bg-warning/20 text-xs text-warning">Bajo</Badge>
                ) : null}
              </div>

              {/* Price */}
              <div className="flex items-center gap-1 lg:col-span-2 lg:justify-end">
                <span className="text-xs text-muted-foreground lg:hidden">Precio:</span>
                <span className="font-medium text-foreground">${item.precio.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-1 lg:col-span-2 lg:justify-center">
                <span className="text-xs text-muted-foreground lg:hidden">Portal:</span>
                {item.visiblePortal ? (
                  <Badge variant="outline" className="gap-1 border-primary/30 bg-primary/10 text-primary">
                    <Eye className="h-3 w-3" />
                    <span className="hidden sm:inline">Visible</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 text-muted-foreground">
                    <EyeOff className="h-3 w-3" />
                    <span className="hidden sm:inline">Oculto</span>
                  </Badge>
                )}
              </div>

              {/* Last Movement */}
              <div className="flex items-center gap-1 lg:col-span-2 lg:justify-end">
                <span className="text-xs text-muted-foreground lg:hidden">Mov:</span>
                {item.ultimoMovimiento === "Hoy" ? (
                  <TrendingUp className="h-4 w-4 text-primary" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">{item.ultimoMovimiento}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
