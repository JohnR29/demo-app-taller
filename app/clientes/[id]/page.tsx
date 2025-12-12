"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Car,
  Calendar,
  Edit,
  Trash2,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react"

const mockCliente = {
  id: "1",
  nombre: "Carlos Muñoz Soto",
  rut: "12.345.678-9",
  telefono: "+56912345678",
  email: "carlos.munoz@email.com",
  direccion: "Av. Providencia 1234, Santiago",
  vehiculos: [
    { patente: "ABC-123", marca: "Toyota", modelo: "Corolla", año: 2020, color: "Plateado", km: 45000 },
    { patente: "XYZ-789", marca: "Honda", modelo: "Civic", año: 2019, color: "Negro", km: 62000 },
  ],
  ultimaVisita: "Hace 3 días",
  totalOrdenes: 12,
  estado: "activo",
}

const mockOrdenes = [
  {
    id: "OT-1234",
    patente: "ABC-123",
    fecha: "2024-01-15",
    servicio: "Mantención 45.000 km",
    estado: "completada",
    total: 85000,
  },
  {
    id: "OT-1189",
    patente: "XYZ-789",
    fecha: "2024-01-02",
    servicio: "Cambio de Aceite",
    estado: "completada",
    total: 35000,
  },
  {
    id: "OT-1098",
    patente: "ABC-123",
    fecha: "2023-12-10",
    servicio: "Revisión de Frenos",
    estado: "completada",
    total: 120000,
  },
]

export default function ClienteDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [activeTab, setActiveTab] = useState("info")
  const [deleteDialog, setDeleteDialog] = useState(false)

  const handleDelete = () => {
    console.log("[v0] Deleting client:", mockCliente.id)
    alert("Cliente eliminado (simulación)")
    router.push("/clientes")
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "completada":
        return (
          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completada
          </Badge>
        )
      case "en_proceso":
        return (
          <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">
            <Clock className="mr-1 h-3 w-3" />
            En Proceso
          </Badge>
        )
      case "pendiente":
        return (
          <Badge variant="outline" className="border-muted-foreground/30">
            <AlertCircle className="mr-1 h-3 w-3" />
            Pendiente
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-hidden bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-14 items-center gap-3 px-3 sm:px-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-9 w-9 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="min-w-0 flex-1 truncate text-base font-bold text-foreground sm:text-lg">Detalle Cliente</h1>
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 active:scale-95">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-4xl space-y-4 p-3 pb-6 sm:space-y-5 sm:p-4">
          <Card>
            <div className="space-y-4 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground sm:text-xl">{mockCliente.nombre}</h2>
                    {mockCliente.estado === "activo" && (
                      <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                        Activo
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{mockCliente.rut}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <a href={`tel:${mockCliente.telefono}`} className="text-primary hover:underline">
                    {mockCliente.telefono}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <a href={`mailto:${mockCliente.email}`} className="truncate text-primary hover:underline">
                    {mockCliente.email}
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-foreground">{mockCliente.direccion}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Última visita: {mockCliente.ultimaVisita}</span>
                </div>
                <span className="text-sm font-medium text-primary">{mockCliente.totalOrdenes} órdenes</span>
              </div>
            </div>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info" className="text-xs sm:text-sm">
                Vehículos
              </TabsTrigger>
              <TabsTrigger value="ordenes" className="text-xs sm:text-sm">
                Historial
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Vehículos Registrados</h3>
                <Button size="sm" variant="outline" className="gap-2 active:scale-95 bg-transparent">
                  <Plus className="h-3.5 w-3.5" />
                  Agregar
                </Button>
              </div>
              {mockCliente.vehiculos.map((vehiculo) => (
                <Card key={vehiculo.patente}>
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                          <Car className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="text-sm font-bold text-foreground">
                            {vehiculo.marca} {vehiculo.modelo}
                          </p>
                          <Badge variant="outline" className="font-mono text-xs">
                            {vehiculo.patente}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="space-y-0.5">
                        <p className="text-muted-foreground">Año</p>
                        <p className="font-medium text-foreground">{vehiculo.año}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-muted-foreground">Color</p>
                        <p className="font-medium text-foreground">{vehiculo.color}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-muted-foreground">Kilómetros</p>
                        <p className="font-medium text-foreground">{vehiculo.km.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="ordenes" className="space-y-2">
              {mockOrdenes.map((orden) => (
                <Card key={orden.id}>
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-primary">{orden.id}</span>
                          {getEstadoBadge(orden.estado)}
                        </div>
                        <p className="text-sm text-foreground">{orden.servicio}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{orden.fecha}</span>
                          <span>•</span>
                          <Badge variant="outline" className="font-mono text-xs">
                            {orden.patente}
                          </Badge>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-base font-bold text-foreground">${orden.total.toLocaleString()}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 active:scale-95 bg-transparent"
                      onClick={() => router.push(`/ordenes/${orden.id.toLowerCase()}`)}
                    >
                      <Eye className="h-4 w-4" />
                      Ver Detalle
                    </Button>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          <Card className="border-destructive/30">
            <div className="space-y-3 p-4">
              <h3 className="text-sm font-semibold text-destructive">Zona de Peligro</h3>
              <p className="text-xs text-muted-foreground">
                Eliminar este cliente borrará toda su información incluyendo vehículos y órdenes de trabajo.
              </p>
              <Button
                variant="destructive"
                size="sm"
                className="w-full gap-2 active:scale-95"
                onClick={() => setDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
                Eliminar Cliente
              </Button>
            </div>
          </Card>
        </div>
      </ScrollArea>

      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="Eliminar Cliente"
        description={`¿Estás seguro de eliminar a ${mockCliente.nombre}? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        icon={<Trash2 className="h-12 w-12 text-destructive" />}
        destructive
      />
    </div>
  )
}
