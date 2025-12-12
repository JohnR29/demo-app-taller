"use client"

import { useState, useRef } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { InventoryList } from "@/components/inventory/inventory-list"
import { InventoryFilter } from "@/components/inventory/inventory-filter"
import { Plus, ScanBarcode, Camera, Upload, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { uploadImage } from "@/lib/upload-image"
import { useBranch } from "@/contexts/branch-context"
import { mockInventoryWithBranches } from "@/lib/mock-data-branches"
import { designTokens } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"


export default function InventarioPage() {
  const { selectedBranchId, currentBranch, isGlobalView } = useBranch()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  // Para foto del producto
  const [fotoUrl, setFotoUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filtrar inventario por sucursal
  const filteredInventory = isGlobalView
    ? mockInventoryWithBranches
    : mockInventoryWithBranches.filter(i => i.branchId === selectedBranchId)

  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      // Would navigate to product or show not found
    }, 1500)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploading(true)
      const url = await uploadImage(file)
      setFotoUrl(url)
      setUploading(false)
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">Inventario</h1>
              {!isGlobalView && currentBranch && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className={cn(designTokens.icon.xs)} />
                  {currentBranch.code}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {isGlobalView 
                ? `${filteredInventory.length} productos en todas las sucursales`
                : `${filteredInventory.length} productos en ${currentBranch?.name}`
              }
            </p>
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
                  {/* Foto del producto (opcional) */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative">
                      <img
                        src={fotoUrl || "/placeholder.svg"}
                        alt="Foto del producto"
                        className="h-20 w-20 rounded-lg object-cover border bg-secondary"
                        style={{ objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="absolute bottom-1 right-1 rounded-full bg-background p-1 shadow hover:bg-secondary"
                        onClick={() => fileInputRef.current?.click()}
                        aria-label="Cambiar foto"
                        disabled={uploading}
                        style={{ lineHeight: 0 }}
                      >
                        {uploading ? (
                          <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : (
                          <Camera className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={uploading}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">Foto del producto (opcional)</span>
                  </div>
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
