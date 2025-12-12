"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const servicios = [
  { id: "mantencion", label: "Mantención General" },
  { id: "aceite", label: "Cambio de Aceite" },
  { id: "frenos", label: "Revisión de Frenos" },
  { id: "diagnostico", label: "Diagnóstico" },
  { id: "alineacion", label: "Alineación y Balanceo" },
  { id: "otro", label: "Otro" },
]

const horarios = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]

export default function AgendarPortalPage() {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    patente: "",
    servicio: "",
    fecha: "",
    hora: "",
    notas: "",
  })

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => {
      router.push("/portal")
    }, 3000)
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-background px-4">
        <div className="mx-auto max-w-lg space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-xl font-bold">Cita Agendada</h1>
          <p className="text-muted-foreground">
            Tu cita ha sido registrada exitosamente. Te enviaremos una confirmación a tu correo.
          </p>
          <p className="text-sm text-muted-foreground">Redirigiendo al portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-lg items-center gap-3 px-4">
          <Link
            href="/portal"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="min-w-0 flex-1 truncate text-lg font-semibold">Agendar Cita</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-28">
        <div className="mx-auto max-w-lg space-y-6">
          {/* Contact Info */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Datos de Contacto</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  placeholder="Juan Pérez"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="bg-secondary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono de Contacto</Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="bg-secondary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-secondary"
                />
              </div>
            </div>
          </section>

          {/* Vehicle Info */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Vehículo</h2>
            <div className="space-y-2">
              <Label htmlFor="patente">Patente del Vehículo</Label>
              <Input
                id="patente"
                placeholder="ABC-123"
                value={formData.patente}
                onChange={(e) => setFormData({ ...formData, patente: e.target.value.toUpperCase() })}
                className="bg-secondary font-mono text-lg uppercase"
              />
            </div>
          </section>

          {/* Service */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Servicio</h2>
            <div className="space-y-2">
              <Label htmlFor="servicio">Tipo de Servicio</Label>
              <Select
                value={formData.servicio}
                onValueChange={(value) => setFormData({ ...formData, servicio: value })}
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {servicios.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Date & Time */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Fecha y Hora</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    className="bg-secondary pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora">Hora</Label>
                <Select value={formData.hora} onValueChange={(value) => setFormData({ ...formData, hora: value })}>
                  <SelectTrigger className="bg-secondary">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {horarios.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Notas</h2>
            <div className="space-y-2">
              <Label htmlFor="notas">Observaciones (opcional)</Label>
              <Textarea
                id="notas"
                placeholder="Describe brevemente el problema o servicio que necesitas..."
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                className="min-h-[80px] bg-secondary"
              />
            </div>
          </section>
        </div>
      </main>

      {/* Fixed Submit Button */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card p-4">
        <div className="mx-auto max-w-lg">
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={handleSubmit}
            disabled={!formData.nombre || !formData.patente || !formData.servicio || !formData.fecha || !formData.hora}
          >
            <Check className="h-5 w-5" />
            Confirmar Cita
          </Button>
        </div>
      </div>
    </div>
  )
}
