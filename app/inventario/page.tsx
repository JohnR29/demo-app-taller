"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { InventoryList } from "@/components/inventory/inventory-list"
import { InventoryFilter } from "@/components/inventory/inventory-filter"
import { Plus, ScanBarcode } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function InventarioPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)

  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      // Would navigate to product or show not found
    }, 1500)
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Inventario</h1>
            <p className="text-sm text-muted-foreground">Gestiona repuestos y stock</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleScan}>
              <ScanBarcode className={isScanning ? "animate-pulse" : ""} />
              <span className="hidden sm:inline">{isScanning ? "Escaneando..." : "Escanear"}</span>
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Nuevo</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Agregar Repuesto</DialogTitle>
                  <DialogDescription>Ingresa los datos del nuevo repuesto al inventario.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU / Código</Label>
                    <Input id="sku" placeholder="ACE-001" className="bg-secondary font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del Producto</Label>
                    <Input id="nombre" placeholder="Aceite Motor 5W-30" className="bg-secondary" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Actual</Label>
                      <Input id="stock" type="number" placeholder="0" className="bg-secondary" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minimo">Stock Mínimo</Label>
                      <Input id="minimo" type="number" placeholder="5" className="bg-secondary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio Unitario</Label>
                    <Input id="precio" type="number" placeholder="15000" className="bg-secondary" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Guardar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <InventoryFilter />
        <InventoryList />
      </div>
    </AppLayout>
  )
}
