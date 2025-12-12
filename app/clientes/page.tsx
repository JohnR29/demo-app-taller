"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Search, Plus, Phone, Mail, Car, ChevronRight, Calendar } from "lucide-react"

const mockClientes = [
  {
    id: "1",
    nombre: "Carlos Muñoz Soto",
    rut: "12.345.678-9",
    telefono: "+56912345678",
    email: "carlos.munoz@email.com",
    vehiculos: [
      { patente: "ABC-123", marca: "Toyota", modelo: "Corolla", año: 2020 },
      { patente: "XYZ-789", marca: "Honda", modelo: "Civic", año: 2019 },
    ],
    ultimaVisita: "Hace 3 días",
    totalOrdenes: 12,
    estado: "activo",
  },
  {
    id: "2",
    nombre: "María González Pérez",
    rut: "13.456.789-0",
    telefono: "+56987654321",
    email: "maria.gonzalez@email.com",
    vehiculos: [{ patente: "DEF-456", marca: "Mazda", modelo: "3", año: 2021 }],
    ultimaVisita: "Hace 1 semana",
    totalOrdenes: 8,
    estado: "activo",
  },
  {
    id: "3",
    nombre: "Juan Pérez Rojas",
    rut: "14.567.890-1",
    telefono: "+56911223344",
    email: "juan.perez@email.com",
    vehiculos: [{ patente: "GHI-789", marca: "Chevrolet", modelo: "Spark", año: 2018 }],
    ultimaVisita: "Hace 2 semanas",
    totalOrdenes: 15,
    estado: "activo",
  },
  {
    id: "4",
    nombre: "Ana Silva Campos",
    rut: "15.678.901-2",
    telefono: "+56922334455",
    email: "ana.silva@email.com",
    vehiculos: [{ patente: "JKL-012", marca: "Nissan", modelo: "Versa", año: 2022 }],
    ultimaVisita: "Hace 1 mes",
    totalOrdenes: 4,
    estado: "inactivo",
  },
  {
    id: "5",
    nombre: "Pedro Torres Díaz",
    rut: "16.789.012-3",
    telefono: "+56933445566",
    email: "pedro.torres@email.com",
    vehiculos: [
      { patente: "MNO-345", marca: "Ford", modelo: "Focus", año: 2017 },
      { patente: "PQR-678", marca: "Kia", modelo: "Rio", año: 2019 },
      { patente: "STU-901", marca: "Hyundai", modelo: "Accent", año: 2020 },
    ],
    ultimaVisita: "Hace 5 días",
    totalOrdenes: 20,
    estado: "vip",
  },
]

export default function ClientesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredClientes = mockClientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cliente.rut.includes(searchQuery) ||
      cliente.vehiculos.some((v) => v.patente.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-hidden bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-14 items-center gap-3 px-3 sm:px-4">
          <Users className="h-5 w-5 shrink-0 text-primary" />
          <h1 className="min-w-0 flex-1 truncate text-base font-bold text-foreground sm:text-lg">Clientes</h1>
          <Button size="sm" className="gap-2 active:scale-95" asChild>
            <Link href="/clientes/nuevo">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nuevo</span>
            </Link>
          </Button>
        </div>
      </header>

      <div className="border-b border-border bg-card px-3 py-3 sm:px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, RUT o patente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-h-[44px] pl-9"
          />
        </div>
      </div>

      <div className="border-b border-border bg-muted/30 px-3 py-2 sm:px-4">
        <p className="text-xs text-muted-foreground sm:text-sm">
          {filteredClientes.length} {filteredClientes.length === 1 ? "cliente" : "clientes"}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2.5 p-3 sm:space-y-3 sm:p-4">
          {filteredClientes.map((cliente) => (
            <Card key={cliente.id} className="overflow-hidden transition-shadow hover:shadow-lg">
              <Link href={`/clientes/${cliente.id}`}>
                <div className="space-y-3 p-3 sm:space-y-4 sm:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-foreground sm:text-base">{cliente.nombre}</h3>
                        {cliente.estado === "vip" && (
                          <Badge variant="default" className="bg-amber-500/20 text-amber-500">
                            VIP
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground sm:text-sm">{cliente.rut}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                  </div>

                  <div className="space-y-1.5 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span>{cliente.telefono}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{cliente.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Car className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">
                        {cliente.vehiculos.length} {cliente.vehiculos.length === 1 ? "vehículo" : "vehículos"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cliente.vehiculos.map((vehiculo) => (
                        <Badge key={vehiculo.patente} variant="outline" className="font-mono text-xs">
                          {vehiculo.patente}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{cliente.ultimaVisita}</span>
                    </div>
                    <span className="text-xs font-medium text-primary">{cliente.totalOrdenes} órdenes</span>
                  </div>
                </div>
              </Link>
            </Card>
          ))}

          {filteredClientes.length === 0 && (
            <div className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-sm font-medium text-foreground">No se encontraron clientes</p>
              <p className="mt-1 text-xs text-muted-foreground">Intenta con otro término de búsqueda</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
