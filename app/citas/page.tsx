"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { WeeklyCalendar } from "@/components/calendar/weekly-calendar"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, User, Car, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

const mockAppointments = [
  {
    id: "1",
    cliente: "Carlos Muñoz",
    telefono: "+56912345678",
    vehiculo: { marca: "Toyota", modelo: "Corolla", año: 2020, patente: "ABC-123" },
    servicio: "Mantención 45.000 km",
    fecha: "2024-01-25",
    hora: "09:00",
    duracion: 120,
    tieneRepuestos: true,
    estado: "confirmada",
    notas: "Cliente solicita revisión de frenos",
  },
  {
    id: "2",
    cliente: "María González",
    telefono: "+56987654321",
    vehiculo: { marca: "Honda", modelo: "Civic", año: 2019, patente: "XYZ-789" },
    servicio: "Cambio de Pastillas de Freno",
    fecha: "2024-01-25",
    hora: "11:30",
    duracion: 90,
    tieneRepuestos: false,
    estado: "pendiente",
    notas: "Verificar stock de pastillas",
  },
  {
    id: "3",
    cliente: "Pedro Ramírez",
    telefono: "+56911223344",
    vehiculo: { marca: "Mazda", modelo: "3", año: 2021, patente: "DEF-456" },
    servicio: "Diagnóstico Motor",
    fecha: "2024-01-25",
    hora: "14:00",
    duracion: 60,
    tieneRepuestos: true,
    estado: "confirmada",
    notas: "",
  },
  {
    id: "4",
    cliente: "Ana Silva",
    telefono: "+56922334455",
    vehiculo: { marca: "Nissan", modelo: "Sentra", año: 2018, patente: "GHI-789" },
    servicio: "Cambio de Aceite",
    fecha: "2024-01-26",
    hora: "10:00",
    duracion: 45,
    tieneRepuestos: true,
    estado: "cancelada",
    notas: "Cliente canceló por viaje",
  },
]

export default function CitasPage() {
  const [view, setView] = useState<"calendar" | "list">("calendar")

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return (
          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Confirmada
          </Badge>
        )
      case "pendiente":
        return (
          <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">
            <AlertCircle className="mr-1 h-3 w-3" />
            Pendiente
          </Badge>
        )
      case "cancelada":
        return (
          <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelada
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <CalendarHeader />

        <div className="border-b border-border bg-card px-3 py-2">
          <Tabs value={view} onValueChange={(v) => setView(v as "calendar" | "list")} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="calendar" className="gap-2">
                <CalendarDays className="h-4 w-4" />
                <span className="hidden sm:inline">Calendario</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Lista</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-auto">
          {view === "calendar" ? (
            <WeeklyCalendar />
          ) : (
            <div className="mx-auto max-w-4xl space-y-3 p-3 pb-20 sm:p-4 md:pb-4">
              {mockAppointments.map((cita) => (
                <Card key={cita.id} className="overflow-hidden">
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-foreground">{cita.cliente}</h3>
                          {getEstadoBadge(cita.estado)}
                        </div>
                        <p className="text-sm text-foreground">{cita.servicio}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="text-foreground">{cita.fecha}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-foreground">{cita.hora}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="text-foreground">{cita.duracion} minutos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="text-primary">{cita.telefono}</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="text-foreground">
                            {cita.vehiculo.marca} {cita.vehiculo.modelo} {cita.vehiculo.año}
                          </span>
                        </div>
                        <Badge variant="outline" className="font-mono">
                          {cita.vehiculo.patente}
                        </Badge>
                        {cita.tieneRepuestos ? (
                          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                            Repuestos Disponibles
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">
                            Sin Repuestos
                          </Badge>
                        )}
                      </div>
                    </div>

                    {cita.notas && (
                      <div className="rounded-md bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">Notas:</p>
                        <p className="text-sm text-foreground">{cita.notas}</p>
                      </div>
                    )}

                    {cita.estado === "pendiente" && (
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 active:scale-95">
                          Confirmar
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 active:scale-95 bg-transparent">
                          Rechazar
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
