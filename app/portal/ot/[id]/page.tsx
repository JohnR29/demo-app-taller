"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Clock, User, Calendar, Car, Gauge, Package, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { designTokens } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

const mockOrders: Record<string, any> = {
  "OT-001": {
    id: "OT-001",
    patente: "ABC-123",
    marca: "Toyota",
    modelo: "Corolla 2020",
    cliente: {
      nombre: "Juan Pérez",
      telefono: "+56 9 1234 5678",
      email: "juan.perez@email.com",
    },
    mecanico: "Carlos M.",
    estado: "en-progreso",
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
  },
  "OT-002": {
    id: "OT-002",
    patente: "XYZ-789",
    marca: "Nissan",
    modelo: "Sentra 2019",
    cliente: {
      nombre: "María López",
      telefono: "+56 9 8765 4321",
      email: "maria.lopez@email.com",
    },
    mecanico: "Pedro R.",
    estado: "pendiente",
    fechaIngreso: "11 Dic 2025 - 14:00",
    kilometraje: "92,100 km",
    descripcion: "Revisión de sistema de frenos. Cambio de pastillas delanteras.",
    repuestos: [
      { sku: "BRK-012", nombre: "Pastillas de Freno Delanteras", cantidad: 2, precio: 35000 },
      { sku: "FLU-008", nombre: "Fluido de Frenos", cantidad: 1, precio: 12000 },
    ],
    manoObra: 30000,
    tiempoTrabajo: "1h 30m",
  },
  "OT-003": {
    id: "OT-003",
    patente: "DEF-456",
    marca: "Honda",
    modelo: "Civic 2021",
    cliente: {
      nombre: "Roberto Silva",
      telefono: "+56 9 5555 6666",
      email: "roberto.silva@email.com",
    },
    mecanico: "Carlos M.",
    estado: "en-progreso",
    fechaIngreso: "11 Dic 2025 - 10:15",
    kilometraje: "45,800 km",
    descripcion: "Diagnóstico del motor. Revisión de inyectores.",
    repuestos: [
      { sku: "INJ-005", nombre: "Inyector Combustible", cantidad: 1, precio: 85000 },
    ],
    manoObra: 60000,
    tiempoTrabajo: "1h 30m",
  },
  "OT-004": {
    id: "OT-004",
    patente: "ABC-123",
    marca: "Toyota",
    modelo: "Corolla 2020",
    cliente: {
      nombre: "Juan Pérez",
      telefono: "+56 9 1234 5678",
      email: "juan.perez@email.com",
    },
    mecanico: "Pedro R.",
    estado: "completada",
    fechaIngreso: "10 Dic 2025 - 08:00",
    kilometraje: "85,300 km",
    descripcion: "Reparación de frenos. Cambio de pastillas y discos.",
    repuestos: [
      { sku: "BRK-015", nombre: "Pastillas de Freno", cantidad: 4, precio: 40000 },
      { sku: "DSC-008", nombre: "Disco de Freno", cantidad: 2, precio: 55000 },
    ],
    manoObra: 50000,
    tiempoTrabajo: "2h 45m",
  },
}

const statusConfig: Record<string, { label: string; className: string }> = {
  "en-progreso": { label: "En Progreso", className: "bg-primary/20 text-primary border-primary/30" },
  pendiente: { label: "Pendiente", className: "bg-warning/20 text-warning border-warning/30" },
  completada: { label: "Completada", className: "bg-accent/20 text-accent border-accent/30" },
}

export default function OTDetailPage() {
  const params = useParams()
  const otId = params.id as string
  const order = mockOrders[otId]

  if (!order) {
    return (
      <PageWrapper title="OT no encontrada" backHref="/portal/historial-vehiculo" useScrollArea={false}>
        <div className="flex flex-1 items-center justify-center">
          <p className={designTokens.typography.body}>La orden de trabajo no existe</p>
        </div>
      </PageWrapper>
    )
  }

  const subtotalRepuestos = order.repuestos.reduce((acc: number, r: any) => acc + r.precio * r.cantidad, 0)
  const total = subtotalRepuestos + order.manoObra

  return (
    <PageWrapper title={order.id} backHref="/portal/historial-vehiculo">
      <div className={designTokens.spacing.section}>
        {/* Vehicle & Status Card */}
        <SectionWrapper>
          <div className="flex items-start justify-between gap-1.5">
            <div className="min-w-0 space-y-0.5">
              <div className="flex flex-wrap items-center gap-1">
                <span className={cn(designTokens.typography.h2, "font-mono font-bold")}>{order.patente}</span>
                <Badge variant="outline" className={cn("text-xs", statusConfig[order.estado].className)}>
                  {statusConfig[order.estado].label}
                </Badge>
              </div>
              <p className={designTokens.typography.body}>
                {order.marca} {order.modelo}
              </p>
            </div>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-secondary sm:h-10 sm:w-10">
              <Car className={cn(designTokens.icon.md, "text-muted-foreground sm:h-5 sm:w-5")} />
            </div>
          </div>

          <div className="mt-1.5 grid gap-1 sm:mt-2 sm:gap-1.5 grid-cols-2">
            <div className={cn(designTokens.typography.body, "flex items-center gap-0.5")}>
              <Gauge className={cn(designTokens.icon.sm, "shrink-0 text-muted-foreground")} />
              <span>KM:</span>
              <span className="truncate font-medium text-foreground">{order.kilometraje}</span>
            </div>
            <div className={cn(designTokens.typography.body, "flex items-center gap-0.5")}>
              <Clock className={cn(designTokens.icon.sm, "shrink-0 text-muted-foreground")} />
              <span>Tiempo:</span>
              <span className="truncate font-medium text-foreground">{order.tiempoTrabajo}</span>
            </div>
            <div className={cn(designTokens.typography.body, "flex items-center gap-0.5")}>
              <User className={cn(designTokens.icon.sm, "shrink-0 text-muted-foreground")} />
              <span>Mec:</span>
              <span className="truncate font-medium text-foreground">{order.mecanico}</span>
            </div>
            <div className={cn(designTokens.typography.body, "flex items-center gap-0.5")}>
              <Calendar className={cn(designTokens.icon.sm, "shrink-0 text-muted-foreground")} />
              <span>Ingreso:</span>
              <span className="truncate font-medium text-foreground">{order.fechaIngreso}</span>
            </div>
          </div>
        </SectionWrapper>

        {/* Client Info */}
        <SectionWrapper title="Cliente">
          <div className="space-y-0.5">
            <p className={cn(designTokens.typography.bodyMd, "font-medium")}>{order.cliente.nombre}</p>
            <p className={cn(designTokens.typography.body, "truncate")}>{order.cliente.telefono}</p>
            <p className={cn(designTokens.typography.body, "truncate")}>{order.cliente.email}</p>
          </div>
        </SectionWrapper>

        {/* Work Description */}
        <SectionWrapper title="Descripción">
          <p className={designTokens.typography.bodyMd}>{order.descripcion}</p>
        </SectionWrapper>

        {/* Parts Used */}
        <SectionWrapper title="Repuestos" icon={Package}>
          <div className="space-y-1">
            {order.repuestos.map((repuesto: any) => (
              <div key={repuesto.sku} className="flex items-start justify-between gap-1">
                <div className="min-w-0 flex-1">
                  <p className={cn(designTokens.typography.bodyMd, "truncate font-medium")}>{repuesto.nombre}</p>
                  <p className={cn(designTokens.typography.body, "font-mono")}>
                    {repuesto.sku} x {repuesto.cantidad}
                  </p>
                </div>
                <p className={cn(designTokens.typography.bodyMd, "shrink-0 font-medium whitespace-nowrap")}>
                  ${(repuesto.precio * repuesto.cantidad).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </SectionWrapper>

        {/* Summary */}
        <div className={cn(designTokens.card.base, "bg-muted/30", designTokens.spacing.card, "space-y-1")}>
          <div className={cn(designTokens.typography.body, "flex items-center justify-between")}>
            <span>Subtotal:</span>
            <span className="font-medium text-foreground">${subtotalRepuestos.toLocaleString()}</span>
          </div>
          <div className={cn(designTokens.typography.body, "flex items-center justify-between")}>
            <span>Mano de Obra:</span>
            <span className="font-medium text-foreground">${order.manoObra.toLocaleString()}</span>
          </div>
          <div className="border-t border-border pt-1 flex items-center justify-between font-semibold">
            <span className={designTokens.typography.bodyMd}>Total:</span>
            <span className={cn(designTokens.typography.bodyMd, "text-primary")}>${total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
