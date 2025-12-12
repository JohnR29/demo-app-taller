"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, ScanBarcode, Trash2, Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface Repuesto {
  id: string
  sku: string
  nombre: string
  cantidad: number
  precio: number
}

const mockMecanicos = [
  { id: "1", nombre: "Carlos M." },
  { id: "2", nombre: "Pedro R." },
  { id: "3", nombre: "Luis T." },
]

export function WorkOrderForm() {
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [repuestos, setRepuestos] = useState<Repuesto[]>([
    { id: "1", sku: "ACE-001", nombre: "Aceite Motor 5W-30", cantidad: 4, precio: 15000 },
    { id: "2", sku: "FIL-023", nombre: "Filtro de Aceite", cantidad: 1, precio: 8500 },
  ])

  const [formData, setFormData] = useState({
    patente: "",
    kilometraje: "",
    mecanico: "",
    descripcion: "",
  })

  const subtotal = repuestos.reduce((acc, r) => acc + r.precio * r.cantidad, 0)
  const manoObra = 45000
  const total = subtotal + manoObra

  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setRepuestos([
        ...repuestos,
        {
          id: Date.now().toString(),
          sku: "BUJ-" + Math.floor(Math.random() * 1000),
          nombre: "Bujía NGK Iridium",
          cantidad: 4,
          precio: 12000,
        },
      ])
      setIsScanning(false)
    }, 1500)
  }

  const removeRepuesto = (id: string) => {
    setRepuestos(repuestos.filter((r) => r.id !== id))
  }

  const updateCantidad = (id: string, cantidad: number) => {
    setRepuestos(repuestos.map((r) => (r.id === id ? { ...r, cantidad: Math.max(1, cantidad) } : r)))
  }

  const handleSubmit = () => {
    router.push("/ordenes")
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-4">
          <Link
            href="/ordenes"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold">Nueva Orden de Trabajo</h1>
          </div>
        </div>
      </header>

      {/* Form Content - Single Scroll */}
      <div className="flex-1 space-y-6 p-4 pb-48">
        {/* Vehicle Info Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Datos del Vehículo</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patente">Patente</Label>
              <Input
                id="patente"
                placeholder="ABC-123"
                value={formData.patente}
                onChange={(e) => setFormData({ ...formData, patente: e.target.value.toUpperCase() })}
                className="bg-secondary font-mono text-lg uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kilometraje">Kilometraje</Label>
              <Input
                id="kilometraje"
                type="number"
                inputMode="numeric"
                placeholder="85000"
                value={formData.kilometraje}
                onChange={(e) => setFormData({ ...formData, kilometraje: e.target.value })}
                className="bg-secondary text-lg"
              />
            </div>
          </div>
        </section>

        {/* Assignment Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Asignación</h2>
          <div className="space-y-2">
            <Label htmlFor="mecanico">Mecánico Asignado</Label>
            <Select value={formData.mecanico} onValueChange={(value) => setFormData({ ...formData, mecanico: value })}>
              <SelectTrigger className="bg-secondary">
                <SelectValue placeholder="Seleccionar mecánico" />
              </SelectTrigger>
              <SelectContent>
                {mockMecanicos.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Work Description Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Descripción del Trabajo
          </h2>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Detalle de la reparación</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe los trabajos a realizar..."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="min-h-[100px] bg-secondary"
            />
          </div>
        </section>

        {/* Parts Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Repuestos</h2>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2 bg-transparent"
              onClick={handleScan}
              disabled={isScanning}
            >
              <ScanBarcode className={cn("h-4 w-4", isScanning && "animate-pulse")} />
              <span className="hidden xs:inline">{isScanning ? "Escaneando..." : "Escanear"}</span>
            </Button>
          </div>

          <div className="space-y-2">
            {repuestos.map((repuesto) => (
              <div key={repuesto.id} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{repuesto.nombre}</p>
                    <p className="font-mono text-xs text-muted-foreground">{repuesto.sku}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeRepuesto(repuesto.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => updateCantidad(repuesto.id, repuesto.cantidad - 1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{repuesto.cantidad}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => updateCantidad(repuesto.id, repuesto.cantidad + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    ${(repuesto.precio * repuesto.cantidad).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            Agregar Repuesto Manual
          </Button>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-20 border-t border-border bg-card p-4 md:bottom-0 md:left-64">
        <div className="mx-auto max-w-4xl space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Repuestos</span>
            <span className="text-foreground">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Mano de Obra</span>
            <span className="text-foreground">${manoObra.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-lg font-bold text-primary">${total.toLocaleString()}</span>
          </div>
          <Button className="w-full gap-2" size="lg" onClick={handleSubmit}>
            <Check className="h-5 w-5" />
            Guardar y Facturar
          </Button>
        </div>
      </div>
    </div>
  )
}
