"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface Appointment {
  id: string
  patente: string
  cliente: string
  servicio: string
  hora: string
  duracion: number
  tipo: "mantencion" | "reparacion" | "diagnostico" | "otro"
  day: number
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patente: "ABC-123",
    cliente: "Juan Pérez",
    servicio: "Cambio de aceite",
    hora: "09:00",
    duracion: 1,
    tipo: "mantencion",
    day: 0,
  },
  {
    id: "2",
    patente: "XYZ-789",
    cliente: "María López",
    servicio: "Revisión de frenos",
    hora: "10:00",
    duracion: 2,
    tipo: "reparacion",
    day: 0,
  },
  {
    id: "3",
    patente: "DEF-456",
    cliente: "Roberto Silva",
    servicio: "Diagnóstico motor",
    hora: "14:00",
    duracion: 1.5,
    tipo: "diagnostico",
    day: 1,
  },
  {
    id: "4",
    patente: "GHI-321",
    cliente: "Ana García",
    servicio: "Alineación y balanceo",
    hora: "09:00",
    duracion: 1,
    tipo: "otro",
    day: 2,
  },
  {
    id: "5",
    patente: "JKL-654",
    cliente: "Diego Morales",
    servicio: "Cambio de batería",
    hora: "11:00",
    duracion: 1,
    tipo: "reparacion",
    day: 2,
  },
  {
    id: "6",
    patente: "MNO-987",
    cliente: "Carla Fernández",
    servicio: "Mantención 50.000 km",
    hora: "08:00",
    duracion: 3,
    tipo: "mantencion",
    day: 3,
  },
  {
    id: "7",
    patente: "PQR-111",
    cliente: "Felipe Torres",
    servicio: "Cambio de embrague",
    hora: "14:00",
    duracion: 4,
    tipo: "reparacion",
    day: 4,
  },
]

const typeConfig = {
  mantencion: { label: "Mantención", className: "bg-primary/20 border-primary/40 text-primary" },
  reparacion: { label: "Reparación", className: "bg-accent/20 border-accent/40 text-accent" },
  diagnostico: { label: "Diagnóstico", className: "bg-warning/20 border-warning/40 text-warning" },
  otro: { label: "Otro", className: "bg-secondary border-border text-foreground" },
}

const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
const hours = Array.from({ length: 11 }, (_, i) => i + 8)

export function WeeklyCalendar() {
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)

  const getAppointmentStyle = (appointment: Appointment) => {
    const startHour = Number.parseInt(appointment.hora.split(":")[0])
    const top = (startHour - 8) * 60
    const height = appointment.duracion * 60

    return {
      top: `${top}px`,
      height: `${height}px`,
    }
  }

  const getAppointmentsForDay = (dayIndex: number) => {
    return mockAppointments.filter((apt) => apt.day === dayIndex)
  }

  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1)

  const getDayDate = (dayIndex: number) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + dayIndex)
    return date.getDate()
  }

  const isToday = (dayIndex: number) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + dayIndex)
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="flex-1 overflow-x-hidden p-4">
      <div className="mx-auto max-w-6xl">
        {/* Desktop Weekly View - only show on lg+ screens */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-8 border-b border-border">
            <div className="p-2"></div>
            {days.map((day, index) => (
              <div
                key={day}
                className={cn("border-l border-border p-2 text-center", isToday(index) && "bg-primary/10")}
              >
                <div className="text-xs font-medium uppercase text-muted-foreground">{day}</div>
                <div className={cn("mt-1 text-xl font-bold", isToday(index) ? "text-primary" : "text-foreground")}>
                  {getDayDate(index)}
                </div>
              </div>
            ))}
          </div>

          <div className="relative grid grid-cols-8">
            <div className="border-r border-border">
              {hours.map((hour) => (
                <div key={hour} className="relative h-[60px] pr-2 text-right">
                  <span className="absolute -top-2 right-2 text-xs text-muted-foreground">
                    {hour.toString().padStart(2, "0")}:00
                  </span>
                </div>
              ))}
            </div>

            {days.map((_, dayIndex) => (
              <div
                key={dayIndex}
                className={cn("relative border-l border-border", isToday(dayIndex) && "bg-primary/5")}
              >
                {hours.map((hour) => (
                  <div key={hour} className="h-[60px] border-b border-border/50"></div>
                ))}

                {getAppointmentsForDay(dayIndex).map((apt) => (
                  <button
                    key={apt.id}
                    type="button"
                    onClick={() => setSelectedAppointment(apt.id === selectedAppointment ? null : apt.id)}
                    style={getAppointmentStyle(apt)}
                    className={cn(
                      "absolute inset-x-1 overflow-hidden rounded border p-1 text-left transition-all",
                      typeConfig[apt.tipo].className,
                      selectedAppointment === apt.id && "ring-2 ring-ring",
                    )}
                  >
                    <p className="truncate text-xs font-semibold">{apt.patente}</p>
                    <p className="truncate text-xs opacity-80">{apt.servicio}</p>
                    <p className="truncate text-xs opacity-60">{apt.hora}</p>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 lg:hidden">
          {days.slice(0, 5).map((day, dayIndex) => {
            const dayAppointments = getAppointmentsForDay(dayIndex)
            const hasAppointments = dayAppointments.length > 0

            return (
              <div key={day} className="overflow-hidden rounded-lg border border-border bg-card">
                <div
                  className={cn(
                    "flex items-center justify-between border-b border-border p-3",
                    isToday(dayIndex) && "bg-primary/10",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold",
                        isToday(dayIndex) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground",
                      )}
                    >
                      {getDayDate(dayIndex)}
                    </div>
                    <span className="font-medium text-foreground">{day}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{dayAppointments.length} citas</span>
                </div>

                {hasAppointments ? (
                  <div className="divide-y divide-border">
                    {dayAppointments.map((apt) => (
                      <button
                        key={apt.id}
                        type="button"
                        onClick={() => setSelectedAppointment(apt.id === selectedAppointment ? null : apt.id)}
                        className={cn(
                          "flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-secondary",
                          selectedAppointment === apt.id && "bg-secondary",
                        )}
                      >
                        <div
                          className={cn("mt-1 h-3 w-3 shrink-0 rounded-full", {
                            "bg-primary": apt.tipo === "mantencion",
                            "bg-accent": apt.tipo === "reparacion",
                            "bg-warning": apt.tipo === "diagnostico",
                            "bg-muted-foreground": apt.tipo === "otro",
                          })}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate font-mono text-sm font-semibold text-foreground">
                              {apt.patente}
                            </span>
                            <span className="shrink-0 text-sm text-muted-foreground">{apt.hora}</span>
                          </div>
                          <p className="truncate text-sm text-foreground">{apt.servicio}</p>
                          <p className="truncate text-xs text-muted-foreground">{apt.cliente}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">Sin citas programadas</div>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
          {Object.entries(typeConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={cn("h-3 w-3 rounded-full", config.className.split(" ")[0])} />
              <span className="text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
