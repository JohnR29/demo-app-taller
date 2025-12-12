"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadImage } from "@/lib/upload-image"
import { Camera, Upload, Plus, Minus, Edit3 } from "lucide-react"

export interface InventoryDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: {
    id: string
    sku: string
    nombre: string
    categoria: string
    stockActual: number
    stockMinimo: number
    precio: number
    visiblePortal: boolean
    fotoUrl?: string
  } | null
  onSave: (item: any) => void
}

export function InventoryDetailModal({ open, onOpenChange, item, onSave }: InventoryDetailModalProps) {

  const [stock, setStock] = useState(item?.stockActual ?? 0)
  const [saving, setSaving] = useState(false)
  const [fotoUrl, setFotoUrl] = useState(item?.fotoUrl || "")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [stockMode, setStockMode] = useState<'entrada' | 'salida' | 'modificacion'>("modificacion")
  const [stockDelta, setStockDelta] = useState(1)

  if (!item) return null

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      onSave({ ...item, stockActual: stock, fotoUrl })
      onOpenChange(false)
    }, 800)
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

  const handleStockChange = (mode: 'entrada' | 'salida' | 'modificacion') => {
    setStockMode(mode)
    setStockDelta(1)
    if (mode === 'modificacion') setStock(item.stockActual)
  }

  const handleStockDelta = (delta: number) => {
    setStockDelta((prev) => Math.max(1, prev + delta))
  }

  const applyStockChange = () => {
    if (stockMode === 'entrada') setStock((prev) => prev + stockDelta)
    else if (stockMode === 'salida') setStock((prev) => Math.max(0, prev - stockDelta))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-xs sm:max-w-sm p-2 sm:p-4"
        style={{
          maxHeight: '90dvh',
          minHeight: 'auto',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
        }}
      >
        <DialogHeader>
          <DialogTitle>Detalle de Repuesto</DialogTitle>
          <DialogDescription>Visualiza y ajusta el stock del repuesto.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-1">
          {/* Foto */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative">
              <img
                src={fotoUrl || "/placeholder.svg"}
                alt={item.nombre}
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
            <span className="text-xs text-muted-foreground">Foto del producto</span>
          </div>
          <div>
            <Label className="text-xs">SKU</Label>
            <div className="font-mono text-sm bg-secondary rounded px-2 py-1">{item.sku}</div>
          </div>
          <div>
            <Label className="text-xs">Nombre</Label>
            <div className="text-sm font-medium">{item.nombre}</div>
          </div>
          <div>
            <Label className="text-xs">Categoría</Label>
            <div className="text-xs text-muted-foreground">{item.categoria}</div>
          </div>
          {/* Stock con modos */}
          <div className="space-y-1">
            <Label className="text-xs">Stock</Label>
            <div className="flex gap-1 mb-1 flex-wrap">
              <Button
                size="sm"
                variant={stockMode === 'entrada' ? 'default' : 'outline'}
                onClick={() => handleStockChange('entrada')}
                className="flex-1 min-w-[90px]"
              >
                <Plus className="h-4 w-4 mr-1" /> Entrada
              </Button>
              <Button
                size="sm"
                variant={stockMode === 'salida' ? 'default' : 'outline'}
                onClick={() => handleStockChange('salida')}
                className="flex-1 min-w-[90px]"
              >
                <Minus className="h-4 w-4 mr-1" /> Salida
              </Button>
              <Button
                size="sm"
                variant={stockMode === 'modificacion' ? 'default' : 'outline'}
                onClick={() => handleStockChange('modificacion')}
                className="flex-1 min-w-[90px]"
              >
                <Edit3 className="h-4 w-4 mr-1" /> Modificar
              </Button>
            </div>
            {stockMode === 'modificacion' ? (
              <Input
                type="number"
                min={0}
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
                className="bg-secondary font-mono text-center"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <Button size="icon" variant="outline" onClick={() => handleStockDelta(-1)} disabled={stockDelta <= 1}>
                  -
                </Button>
                <Input
                  type="number"
                  min={1}
                  value={stockDelta}
                  onChange={e => setStockDelta(Math.max(1, Number(e.target.value)))}
                  className="w-14 bg-secondary text-center font-mono"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <Button size="icon" variant="outline" onClick={() => handleStockDelta(1)}>
                  +
                </Button>
                <Button size="sm" onClick={applyStockChange}>
                  {stockMode === 'entrada' ? 'Agregar' : 'Descontar'}
                </Button>
                <span className="ml-2 text-xs text-muted-foreground">Stock: {stock}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving || stock < 0}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
