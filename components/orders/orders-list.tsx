"use client"

import Link from "next/link"
import { ChevronRight, Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface Order {
  id: string
  patente: string
  marca: string
  modelo: string
  cliente: string
  mecanico: string
  estado: "en-progreso" | "pendiente" | "completada"
  fecha: string
  tiempo: string
  descripcion: string
}

const mockOrders: Order[] = [
  {
    id: "OT-001",
    patente: "ABC-123",
    marca: "Toyota",
    modelo: "Corolla 2020",
    cliente: "Juan Pérez",
    mecanico: "Carlos M.",
    estado: "en-progreso",
    fecha: "11 Dic 2025",
    tiempo: "2h 15m",
    descripcion: "Cambio de aceite y filtros",
  },
  {
    id: "OT-002",
    patente: "XYZ-789",
    marca: "Nissan",
    modelo: "Sentra 2019",
    cliente: "María López",
    mecanico: "Pedro R.",
    estado: "pendiente",
    fecha: "11 Dic 2025",
    tiempo: "Esperando",
    descripcion: "Revisión de frenos",
  },
  {
    id: "OT-003",
    patente: "DEF-456",
    marca: "Honda",
    modelo: "Civic 2021",
    cliente: "Roberto Silva",
    mecanico: "Carlos M.",
    estado: "en-progreso",
    fecha: "11 Dic 2025",
    tiempo: "1h 30m",
    descripcion: "Diagnóstico motor",
  },
  {
    id: "OT-004",
    patente: "GHI-321",
    marca: "Mazda",
    modelo: "3 2022",
    cliente: "Ana García",
    mecanico: "Luis T.",
    estado: "completada",
    fecha: "10 Dic 2025",
    tiempo: "3h 45m",
    descripcion: "Cambio de batería y alternador",
  },
  {
    id: "OT-005",
    patente: "JKL-654",
    marca: "Chevrolet",
    modelo: "Spark 2018",
    cliente: "Diego Morales",
    mecanico: "Pedro R.",
    estado: "pendiente",
    fecha: "11 Dic 2025",
    tiempo: "Esperando",
    descripcion: "Alineación y balanceo",
  },
]

const statusConfig = {
  "en-progreso": { label: "En Progreso", className: "bg-primary/20 text-primary border-primary/30" },
  pendiente: { label: "Pendiente", className: "bg-warning/20 text-warning border-warning/30" },
  completada: { label: "Completada", className: "bg-accent/20 text-accent border-accent/30" },
}

export function OrdersList() {
  return (
    <div className="space-y-2">
      {mockOrders.map((order) => (
        <Link
          key={order.id}
          href={`/ordenes/${order.id}`}
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary active:scale-[0.99]"
        >
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base font-bold text-foreground">{order.patente}</span>
              <Badge variant="outline" className={cn("text-xs", statusConfig[order.estado].className)}>
                {statusConfig[order.estado].label}
              </Badge>
              <span className="text-xs text-muted-foreground">{order.id}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {order.marca} {order.modelo}
            </p>
            <p className="text-sm text-foreground">{order.descripcion}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {order.mecanico}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {order.tiempo}
              </span>
              <span>{order.fecha}</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Link>
      ))}
    </div>
  )
}
