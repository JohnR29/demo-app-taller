"use client"

import Link from "next/link"
import { ArrowLeft, Edit, Clock, User, Calendar, Car, Gauge, Package, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface OrderDetailProps {
  orderId: string
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  const order = {
    id: orderId,
    patente: "ABC-123",
    marca: "Toyota",
    modelo: "Corolla 2020",
    cliente: {
      nombre: "Juan Pérez",
      telefono: "+56 9 1234 5678",
      email: "juan.perez@email.com",
    },
    mecanico: "Carlos M.",
    estado: "en-progreso" as const,
    fechaIngreso: "11 Dic 2025 - 09:30",
    kilometraje: "85,420 km",
    descripcion: "Cambio de aceite y filtros. Revisión general de frenos y suspensión.",
    repuestos: [
      { sku: "ACE-001", nombre: "Aceite Motor 5W-30", cantidad: 4, precio: 15000 },
      { sku: "FIL-023", nombre: "Filtro de Aceite", cantidad: 1, precio: 8500 },
      { sku: "FIL-045", nombre: "Filtro de Aire", cantidad: 1, precio: 12000 },
    ],
    manoObra: 45000,
    tiempoTrabajo: "2h 15m",
  }

  const subtotalRepuestos = order.repuestos.reduce((acc, r) => acc + r.precio * r.cantidad, 0)
  const total = subtotalRepuestos + order.manoObra

  const statusConfig = {
    "en-progreso": { label: "En Progreso", className: "bg-primary/20 text-primary border-primary/30" },
    pendiente: { label: "Pendiente", className: "bg-warning/20 text-warning border-warning/30" },
    completada: { label: "Completada", className: "bg-accent/20 text-accent border-accent/30" },
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-2 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/ordenes"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hover:bg-secondary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="truncate text-lg font-semibold">{order.id}</h1>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 gap-2 bg-transparent">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Editar</span>
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-4 p-4">
        {/* Vehicle & Status Card */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xl font-bold text-foreground sm:text-2xl">{order.patente}</span>
                <Badge variant="outline" className={cn("text-xs", statusConfig[order.estado].className)}>
                  {statusConfig[order.estado].label}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {order.marca} {order.modelo}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary sm:h-12 sm:w-12">
              <Car className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6" />
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Gauge className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">Km:</span>
              <span className="truncate font-medium text-foreground">{order.kilometraje}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">Tiempo:</span>
              <span className="truncate font-medium text-foreground">{order.tiempoTrabajo}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">Mecánico:</span>
              <span className="truncate font-medium text-foreground">{order.mecanico}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">Ingreso:</span>
              <span className="truncate font-medium text-foreground">{order.fechaIngreso}</span>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Cliente</h2>
          <div className="space-y-2">
            <p className="font-medium text-foreground">{order.cliente.nombre}</p>
            <p className="truncate text-sm text-muted-foreground">{order.cliente.telefono}</p>
            <p className="truncate text-sm text-muted-foreground">{order.cliente.email}</p>
          </div>
        </div>

        {/* Work Description */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Descripción del Trabajo
          </h2>
          <p className="text-foreground">{order.descripcion}</p>
        </div>

        {/* Parts Used */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Repuestos Usados</h2>
          </div>
          <div className="space-y-3">
            {order.repuestos.map((repuesto) => (
              <div key={repuesto.sku} className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{repuesto.nombre}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {repuesto.sku} x {repuesto.cantidad}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium text-foreground">
                  ${(repuesto.precio * repuesto.cantidad).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Summary */}
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Resumen de Facturación</h2>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Repuestos</span>
              <span className="text-foreground">${subtotalRepuestos.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Mano de Obra</span>
              <span className="text-foreground">${order.manoObra.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-primary">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pb-20 md:pb-4">
          <Button variant="outline" className="flex-1 bg-transparent">
            Imprimir
          </Button>
          <Button className="flex-1">Cerrar y Facturar</Button>
        </div>
      </div>
    </div>
  )
}
