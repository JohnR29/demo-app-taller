"use client"

import Link from "next/link"
import { ChevronRight, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface Order {
  id: string
  patente: string
  cliente: string
  mecanico: string
  estado: "en-progreso" | "pendiente" | "completada"
  tiempo: string
}

const mockOrders: Order[] = [
  {
    id: "OT-001",
    patente: "ABC-123",
    cliente: "Juan Pérez",
    mecanico: "Carlos M.",
    estado: "en-progreso",
    tiempo: "2h 15m",
  },
  {
    id: "OT-002",
    patente: "XYZ-789",
    cliente: "María López",
    mecanico: "Pedro R.",
    estado: "pendiente",
    tiempo: "45m",
  },
  {
    id: "OT-003",
    patente: "DEF-456",
    cliente: "Roberto Silva",
    mecanico: "Carlos M.",
    estado: "en-progreso",
    tiempo: "1h 30m",
  },
]

const statusConfig = {
  "en-progreso": { label: "En Progreso", className: "bg-primary/20 text-primary border-primary/30" },
  pendiente: { label: "Pendiente", className: "bg-warning/20 text-warning border-warning/30" },
  completada: { label: "Completada", className: "bg-accent/20 text-accent border-accent/30" },
}

export function ActiveOrders() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Órdenes Activas</h2>
        <Link href="/ordenes" className="text-sm text-primary hover:underline">
          Ver todas
        </Link>
      </div>
      <div className="space-y-2">
        {mockOrders.map((order) => (
          <Link
            key={order.id}
            href={`/ordenes/${order.id}`}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-secondary active:scale-[0.99]"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-foreground">{order.patente}</span>
                <Badge variant="outline" className={cn("text-xs", statusConfig[order.estado].className)}>
                  {statusConfig[order.estado].label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{order.cliente}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{order.mecanico}</span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {order.tiempo}
                </span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  )
}
