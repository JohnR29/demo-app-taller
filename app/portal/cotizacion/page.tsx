"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Send, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const marcas = ["Toyota", "Honda", "Nissan", "Mazda", "Chevrolet", "Hyundai", "Kia"]
const anios = Array.from({ length: 20 }, (_, i) => (2024 - i).toString())

function CotizacionForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const repuestoParam = searchParams.get("repuesto") || ""

  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    marca: "",
    modelo: "",
    anio: "",
    repuesto: repuestoParam,
    detalles: "",
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
          <h1 className="text-xl font-bold">Solicitud Enviada</h1>
          <p className="text-muted-foreground">
            Hemos recibido tu solicitud de cotización. Te contactaremos a la brevedad.
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
            href="/portal/repuestos"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="min-w-0 flex-1 truncate text-lg font-semibold">Solicitar Cotización</h1>
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
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
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

          {/* Vehicle Info */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Datos del Vehículo</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="marca">Marca</Label>
                  <Select value={formData.marca} onValueChange={(v) => setFormData({ ...formData, marca: v })}>
                    <SelectTrigger className="bg-secondary">
                      <SelectValue placeholder="Marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {marcas.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anio">Año</Label>
                  <Select value={formData.anio} onValueChange={(v) => setFormData({ ...formData, anio: v })}>
                    <SelectTrigger className="bg-secondary">
                      <SelectValue placeholder="Año" />
                    </SelectTrigger>
                    <SelectContent>
                      {anios.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  placeholder="Corolla, Civic, Sentra..."
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  className="bg-secondary"
                />
              </div>
            </div>
          </section>

          {/* Part Info */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Repuesto Solicitado
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="repuesto">Nombre del Repuesto</Label>
                <Input
                  id="repuesto"
                  placeholder="Ej: Filtro de aceite, pastillas de freno..."
                  value={formData.repuesto}
                  onChange={(e) => setFormData({ ...formData, repuesto: e.target.value })}
                  className="bg-secondary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="detalles">Detalles Adicionales (opcional)</Label>
                <Textarea
                  id="detalles"
                  placeholder="Información adicional sobre el repuesto que necesitas..."
                  value={formData.detalles}
                  onChange={(e) => setFormData({ ...formData, detalles: e.target.value })}
                  className="min-h-[80px] bg-secondary"
                />
              </div>
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
            disabled={!formData.nombre || !formData.email || !formData.repuesto}
          >
            <Send className="h-5 w-5" />
            Enviar Solicitud
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CotizacionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      }
    >
      <CotizacionForm />
    </Suspense>
  )
}
