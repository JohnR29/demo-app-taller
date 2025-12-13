"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, Phone, Clock, Edit, Trash2, Plus, Building2, Users, Package, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { designTokens } from "@/lib/design-tokens"
import { useBranch } from "@/contexts/branch-context"
import { mockOrdersWithBranches, mockInventoryWithBranches, mockAppointmentsWithBranches } from "@/lib/mock-data-branches"

export default function SucursalesPage() {
  const { availableBranches } = useBranch()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<string | null>(null)

  // Calcular estadísticas por sucursal
  const getBranchStats = (branchId: string) => {
    const orders = mockOrdersWithBranches.filter(o => o.branchId === branchId)
    const inventory = mockInventoryWithBranches.filter(i => i.branchId === branchId)
    const appointments = mockAppointmentsWithBranches.filter(a => a.branchId === branchId)
    
    return {
      activeOrders: orders.filter(o => o.status === "in-progress").length,
      totalOrders: orders.length,
      inventoryItems: inventory.length,
      todayAppointments: appointments.filter(a => a.status === "confirmed").length,
    }
  }

  const handleEdit = (branchId: string) => {
    setEditingBranch(branchId)
    setDialogOpen(true)
  }

  const handleNew = () => {
    setEditingBranch(null)
    setDialogOpen(true)
  }

  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card px-3 py-3 sm:px-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <h1 className={cn(designTokens.typography.h1)}>Gestión de Sucursales</h1>
              <p className={cn(designTokens.typography.body, "text-muted-foreground")}>
                {availableBranches.length} sucursales activas
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2" onClick={handleNew}>
                  <Plus className={cn(designTokens.icon.sm)} />
                  <span className="hidden sm:inline">Nueva Sucursal</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingBranch ? "Editar Sucursal" : "Nueva Sucursal"}
                  </DialogTitle>
                </DialogHeader>
                <BranchForm branchId={editingBranch} onClose={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Lista de Sucursales */}
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-5xl space-y-3 p-3 pb-20 sm:p-4 md:pb-4">
            {availableBranches.map((branch) => {
              const stats = getBranchStats(branch.id)
              return (
                <Card key={branch.id} className="overflow-hidden">
                  <div className="p-4 sm:p-5">
                    {/* Header de la sucursal */}
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Building2 className={cn(designTokens.icon.md, "text-primary")} />
                          <h3 className="text-base font-bold sm:text-lg">{branch.name}</h3>
                          <Badge variant="outline" className="font-mono">
                            {branch.code}
                          </Badge>
                          <Badge variant={branch.isActive ? "default" : "secondary"}>
                            {branch.isActive ? "Activa" : "Inactiva"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(branch.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Información de contacto */}
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className={cn(designTokens.icon.sm, "mt-0.5 shrink-0 text-muted-foreground")} />
                          <span className="text-foreground">{branch.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className={cn(designTokens.icon.sm, "shrink-0 text-muted-foreground")} />
                          <span className="text-primary">{branch.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className={cn(designTokens.icon.sm, "shrink-0 text-muted-foreground")} />
                          <span className="text-foreground">Lun-Vie: 8:00 - 18:00</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className={cn(designTokens.icon.sm, "shrink-0 text-muted-foreground")} />
                          <span className="text-foreground">5 mecánicos</span>
                        </div>
                      </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Package className={cn(designTokens.icon.sm)} />
                          <span className="text-xs">Inventario</span>
                        </div>
                        <p className="mt-1 text-xl font-bold">{stats.inventoryItems}</p>
                      </div>
                      <div className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building2 className={cn(designTokens.icon.sm)} />
                          <span className="text-xs">OT Activas</span>
                        </div>
                        <p className="mt-1 text-xl font-bold">{stats.activeOrders}</p>
                      </div>
                      <div className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className={cn(designTokens.icon.sm)} />
                          <span className="text-xs">Citas Hoy</span>
                        </div>
                        <p className="mt-1 text-xl font-bold">{stats.todayAppointments}</p>
                      </div>
                      <div className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building2 className={cn(designTokens.icon.sm)} />
                          <span className="text-xs">Total OT</span>
                        </div>
                        <p className="mt-1 text-xl font-bold">{stats.totalOrders}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

function BranchForm({ branchId, onClose }: { branchId: string | null; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    phone: "",
    email: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar
    console.log("Guardando sucursal:", formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Sucursal</Label>
        <Input
          id="name"
          placeholder="Ej: Sucursal Centro"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Código</Label>
        <Input
          id="code"
          placeholder="Ej: SUC-001"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          placeholder="Ej: Av. Providencia 1234, Santiago"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+56 2 1234 5678"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="centro@taller.cl"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          {branchId ? "Actualizar" : "Crear"} Sucursal
        </Button>
      </div>
    </form>
  )
}
