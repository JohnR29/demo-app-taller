"use client"

import { useState } from "react"
import { Package, AlertTriangle, TrendingUp, Eye, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { InventoryDetailModal } from "./inventory-detail-modal"
import { useBranch } from "@/contexts/branch-context"
import { mockInventoryWithBranches } from "@/lib/mock-data-branches"
import { designTokens } from "@/lib/design-tokens"

export function InventoryList() {
  const { selectedBranchId, isGlobalView } = useBranch()
  const [selected, setSelected] = useState<typeof mockInventoryWithBranches[0] | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  
  // Filtrar inventario por sucursal
  const inventory = isGlobalView
    ? mockInventoryWithBranches
    : mockInventoryWithBranches.filter(i => i.branchId === selectedBranchId)

  const handleOpenDetail = (item: typeof mockInventoryWithBranches[0]) => {
    setSelected(item)
    setModalOpen(true)
  }

  const handleSave = (updated: typeof mockInventoryWithBranches[0]) => {
    // En producción: actualizar vía API
    setModalOpen(false)
  }

  return (
    <div className="space-y-2">
      {/* Desktop Header - hidden on mobile */}
      <div className="hidden rounded-lg bg-secondary p-3 text-xs font-medium uppercase tracking-wider text-muted-foreground lg:grid lg:grid-cols-12 lg:gap-4">
        <div className="lg:col-span-4">Producto</div>
        {isGlobalView && <div className="lg:col-span-1">Sucursal</div>}
        <div className={cn("lg:text-center", isGlobalView ? "lg:col-span-2" : "lg:col-span-2")}>Stock</div>
        <div className={cn("lg:text-right", isGlobalView ? "lg:col-span-2" : "lg:col-span-2")}>Precio</div>
        <div className={cn("lg:text-center", isGlobalView ? "lg:col-span-1" : "lg:col-span-2")}>Portal</div>
        <div className={cn("lg:text-right", isGlobalView ? "lg:col-span-2" : "lg:col-span-2")}>Último Mov.</div>
      </div>

      {/* Items */}
      {inventory.map((item) => {
        const isLowStock = item.stock <= item.minStock
        const isOutOfStock = item.stock === 0

        return (
          <button
            key={item.id}
            type="button"
            className={cn(
              "w-full text-left rounded-lg border bg-card p-3 transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/40",
              "lg:grid lg:items-center lg:gap-4",
              isGlobalView ? "lg:grid-cols-13" : "lg:grid-cols-12",
              isOutOfStock && "border-destructive/30",
              isLowStock && !isOutOfStock && "border-warning/30",
            )}
            onClick={() => handleOpenDetail(item)}
            aria-label={`Ver detalle de ${item.name}`}
          >
            {/* Product Info */}
            <div className={isGlobalView ? "lg:col-span-4" : "lg:col-span-4"}>
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
                  <p className="truncate font-medium text-foreground">{item.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.code}</span>
                    <span>•</span>
                    <span>{item.category}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sucursal (solo en vista global) */}
            {isGlobalView && (
              <div className="lg:col-span-1 mt-2 lg:mt-0">
                <Badge variant="outline" className="gap-1 text-xs">
                  <MapPin className={cn(designTokens.icon.xs)} />
                  {item.branchName.replace("Sucursal ", "")}
                </Badge>
              </div>
            )}

            <div className={cn("mt-3 flex flex-wrap items-center justify-between gap-2 lg:mt-0", isGlobalView ? "lg:col-span-8" : "lg:col-span-8", "lg:grid lg:gap-4", isGlobalView ? "lg:grid-cols-7" : "lg:grid-cols-8")}>
              {/* Stock */}
              <div className={cn("flex items-center gap-2", isGlobalView ? "lg:col-span-2" : "lg:col-span-2", "lg:justify-center")}>
                <span className="text-xs text-muted-foreground lg:hidden">Stock:</span>
                <span
                  className={cn(
                    "text-base font-bold lg:text-lg",
                    isOutOfStock ? "text-destructive" : isLowStock ? "text-warning" : "text-foreground",
                  )}
                >
                  {item.stock}
                </span>
                <span className="text-xs text-muted-foreground">/{item.minStock}</span>
                {isOutOfStock ? (
                  <Badge variant="destructive" className="text-xs">
                    Sin Stock
                  </Badge>
                ) : isLowStock ? (
                  <Badge className="border-warning/30 bg-warning/20 text-xs text-warning">Bajo</Badge>
                ) : null}
              </div>

              {/* Price */}
              <div className={cn("flex items-center gap-1", isGlobalView ? "lg:col-span-2" : "lg:col-span-2", "lg:justify-end")}>
                <span className="text-xs text-muted-foreground lg:hidden">Precio:</span>
                <span className="font-medium text-foreground">${item.price.toLocaleString()}</span>
              </div>

              {/* Portal visibility - oculto por ahora */}
              <div className={cn("hidden items-center gap-1", isGlobalView ? "lg:col-span-1" : "lg:col-span-2", "lg:flex lg:justify-center")}>
                <Badge variant="outline" className="gap-1 border-primary/30 bg-primary/10 text-primary">
                  <Eye className="h-3 w-3" />
                </Badge>
              </div>

              {/* Last Movement */}
              <div className={cn("flex items-center gap-1", isGlobalView ? "lg:col-span-2" : "lg:col-span-2", "lg:justify-end")}>
                <span className="text-xs text-muted-foreground lg:hidden">Mov:</span>
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Hoy</span>
              </div>
            </div>
          </button>
        )
      })}
      <InventoryDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        item={selected}
        onSave={handleSave}
      />
    </div>
  )
}
