"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RatingStars } from "@/components/shared/rating-stars"
import { SpecialtyTag } from "@/components/shared/specialty-tag"
import { StockChip } from "@/components/portal/stock-chip"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { ArrowLeft, MapPin, Phone, Clock, Calendar, Package, Star, Check, Mail } from "lucide-react"

const mockWorkshop = {
  id: "1",
  name: "Taller Mecánico Los Expertos",
  address: "Av. Providencia 1234, Santiago",
  phone: "+56912345678",
  email: "contacto@losexpertoschile.cl",
  rating: 4.8,
  reviewCount: 127,
  distance: 1.2,
  specialties: ["Frenos", "Suspensión", "Aceites", "Motor Diésel", "Electricidad", "Baterías"],
  isOpen: true,
  openHours: "Lun-Vie: 08:00-18:00 | Sáb: 09:00-14:00",
  description:
    "Taller mecánico con más de 20 años de experiencia. Especializados en mantenciones preventivas y correctivas para todo tipo de vehículos.",
  images: ["/automotive-workshop-exterior.jpg"],
}

const mockParts = [
  {
    id: "1",
    sku: "ACE-001",
    nombre: "Aceite Motor 5W-30 Mobil",
    categoria: "Aceites",
    stock: 24,
    precio: 15000,
    disponible: true,
  },
  {
    id: "2",
    sku: "FIL-023",
    nombre: "Filtro de Aceite Toyota",
    categoria: "Filtros",
    stock: 3,
    precio: 8500,
    disponible: true,
  },
  {
    id: "3",
    sku: "PAD-089",
    nombre: "Pastillas de Freno Brembo",
    categoria: "Frenos",
    stock: 6,
    precio: 45000,
    disponible: true,
  },
  {
    id: "4",
    sku: "BAT-001",
    nombre: "Batería Bosch 12V 60Ah",
    categoria: "Eléctricos",
    stock: 4,
    precio: 95000,
    disponible: true,
  },
  {
    id: "5",
    sku: "AMO-112",
    nombre: "Amortiguador Delantero",
    categoria: "Suspensión",
    stock: 0,
    precio: 55000,
    disponible: false,
  },
]

const mockReviews = [
  {
    id: "1",
    author: "Carlos Muñoz",
    rating: 5,
    date: "Hace 2 días",
    comment: "Excelente atención y trabajo de calidad. Muy profesionales.",
  },
  {
    id: "2",
    author: "María González",
    rating: 5,
    date: "Hace 1 semana",
    comment: "Rápidos y eficientes. Me explicaron todo el proceso.",
  },
  {
    id: "3",
    author: "Juan Pérez",
    rating: 4,
    date: "Hace 2 semanas",
    comment: "Buen servicio, aunque un poco más caro que otros talleres.",
  },
]

const horarios = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]

const servicios = [
  { id: "mantencion", label: "Mantención General" },
  { id: "aceite", label: "Cambio de Aceite" },
  { id: "frenos", label: "Revisión de Frenos" },
  { id: "diagnostico", label: "Diagnóstico" },
  { id: "alineacion", label: "Alineación y Balanceo" },
  { id: "otro", label: "Otro" },
]

export default function WorkshopDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [activeTab, setActiveTab] = useState("info")
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  // Booking form
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    patente: "",
    servicio: "",
    fecha: "",
    hora: "",
  })

  const handleBooking = () => {
    setBookingSuccess(true)
    setTimeout(() => {
      router.push("/marketplace")
    }, 2500)
  }

  if (bookingSuccess) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-background px-4">
        <div className="mx-auto max-w-lg space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-xl font-bold">Cita Agendada</h1>
          <p className="text-muted-foreground">
            Tu cita en {mockWorkshop.name} ha sido registrada exitosamente. Te enviaremos una confirmación por correo.
          </p>
          <p className="text-sm text-muted-foreground">Redirigiendo al marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-hidden bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-14 items-center gap-3 px-3 sm:px-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-9 w-9 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="min-w-0 truncate text-base font-bold text-foreground sm:text-lg">Detalle del Taller</h1>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-4xl space-y-4 p-3 pb-6 sm:space-y-5 sm:p-4">
          {/* Workshop Header Card */}
          <Card className="overflow-hidden">
            <div className="space-y-4 p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-foreground sm:text-xl">{mockWorkshop.name}</h2>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <RatingStars rating={mockWorkshop.rating} showValue />
                      <span className="text-sm text-muted-foreground">({mockWorkshop.reviewCount} reseñas)</span>
                      <span className="text-sm font-bold text-primary">{mockWorkshop.distance} km</span>
                    </div>
                  </div>
                  <Badge variant={mockWorkshop.isOpen ? "default" : "secondary"} className="shrink-0">
                    {mockWorkshop.isOpen ? "Abierto" : "Cerrado"}
                  </Badge>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">{mockWorkshop.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-foreground">{mockWorkshop.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <a href={`tel:${mockWorkshop.phone}`} className="text-primary hover:underline">
                      {mockWorkshop.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <a href={`mailto:${mockWorkshop.email}`} className="text-primary hover:underline">
                      {mockWorkshop.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-foreground">{mockWorkshop.openHours}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {mockWorkshop.specialties.map((specialty) => (
                    <SpecialtyTag key={specialty} label={specialty} size="sm" />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info" className="text-xs sm:text-sm">
                Información
              </TabsTrigger>
              <TabsTrigger value="parts" className="text-xs sm:text-sm">
                Repuestos
              </TabsTrigger>
              <TabsTrigger value="booking" className="text-xs sm:text-sm">
                Agendar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-3">
              <Card>
                <div className="space-y-3 p-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Reseñas</h3>
                  </div>
                  <div className="space-y-3">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="space-y-1.5 border-b border-border pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">{review.author}</p>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <RatingStars rating={review.rating} size="sm" />
                        <p className="text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="parts" className="space-y-2">
              {mockParts.map((part) => (
                <Card key={part.id}>
                  <div className="space-y-3 p-4">
                    <div className="flex items-start gap-2">
                      <Package className="mt-1 h-5 w-5 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1 space-y-1">
                        <h4 className="text-balance text-sm font-semibold leading-tight text-foreground sm:text-base">
                          {part.nombre}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{part.sku}</span>
                          <Badge variant="outline" className="text-xs">
                            {part.categoria}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">Precio</span>
                        <p className="text-lg font-bold text-foreground sm:text-xl">${part.precio.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground">Disponibilidad</span>
                        <StockChip enStock={part.disponible} />
                        {part.disponible && (
                          <span className="text-xs text-muted-foreground">Stock: {part.stock} unidades</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="booking" className="space-y-4">
              <Card>
                <div className="space-y-4 p-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Datos de Contacto
                    </h3>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="nombre">Nombre Completo</Label>
                        <Input
                          id="nombre"
                          placeholder="Juan Pérez"
                          value={formData.nombre}
                          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          className="min-h-[44px]"
                        />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="telefono">Teléfono</Label>
                          <Input
                            id="telefono"
                            type="tel"
                            placeholder="+56 9 1234 5678"
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            className="min-h-[44px]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="email">Correo</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="juan@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="min-h-[44px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Vehículo</h3>
                    <div className="space-y-1.5">
                      <Label htmlFor="patente">Patente</Label>
                      <Input
                        id="patente"
                        placeholder="ABC-123"
                        value={formData.patente}
                        onChange={(e) => setFormData({ ...formData, patente: e.target.value.toUpperCase() })}
                        className="min-h-[44px] font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Fecha y Hora
                    </h3>
                    <div className="space-y-1.5">
                      <Label htmlFor="servicio">Servicio</Label>
                      <Select
                        value={formData.servicio}
                        onValueChange={(value) => setFormData({ ...formData, servicio: value })}
                      >
                        <SelectTrigger className="min-h-[44px]">
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
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="fecha">Fecha</Label>
                        <Input
                          id="fecha"
                          type="date"
                          value={formData.fecha}
                          onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                          className="min-h-[44px]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="hora">Hora</Label>
                        <Select
                          value={formData.hora}
                          onValueChange={(value) => setFormData({ ...formData, hora: value })}
                        >
                          <SelectTrigger className="min-h-[44px]">
                            <SelectValue placeholder="Seleccionar hora" />
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
                  </div>

                  <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={() => setConfirmDialog(true)}
                    disabled={
                      !formData.nombre ||
                      !formData.telefono ||
                      !formData.patente ||
                      !formData.servicio ||
                      !formData.fecha ||
                      !formData.hora
                    }
                  >
                    <Calendar className="h-4 w-4" />
                    Confirmar Cita
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      <ConfirmDialog
        open={confirmDialog}
        onOpenChange={setConfirmDialog}
        title="Confirmar Agendamiento"
        description={`¿Confirmas la cita en ${mockWorkshop.name} para el ${formData.fecha} a las ${formData.hora}?`}
        confirmLabel="Sí, confirmar"
        cancelLabel="Revisar"
        onConfirm={handleBooking}
        icon={<Calendar className="h-12 w-12 text-primary" />}
      />
    </div>
  )
}
