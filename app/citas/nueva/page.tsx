"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, Calendar, Clock } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
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

export default function NuevaCitaPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    patente: "",
    cliente: "",
    telefono: "",
    servicio: "",
    fecha: "",
    hora: "",
    notas: "",
  })

  const handleSubmit = () => {
    // Simulate save
    router.push("/citas")
  }

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-4">
            <Link href="/citas" className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-semibold">Nueva Cita</h1>
          </div>
        </header>

        <div className="mx-auto max-w-lg space-y-6 p-4 pb-24">
          {/* Client Info */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Datos del Cliente</h2>
            <div className="space-y-4">
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
              <div className="space-y-2">
                <Label htmlFor="cliente">Nombre del Cliente</Label>
                <Input
                  id="cliente"
                  placeholder="Juan Pérez"
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
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
            <div className="grid grid-cols-2 gap-4">
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
                placeholder="Información adicional sobre la cita..."
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                className="min-h-[80px] bg-secondary"
              />
            </div>
          </section>
        </div>

        {/* Fixed Submit Button */}
        <div className="fixed bottom-16 left-0 right-0 z-20 border-t border-border bg-card p-4 md:bottom-0 md:left-64">
          <div className="mx-auto max-w-lg">
            <Button className="w-full gap-2" size="lg" onClick={handleSubmit}>
              <Check className="h-5 w-5" />
              Agendar Cita
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
