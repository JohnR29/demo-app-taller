"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Car, Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StockChip } from "@/components/portal/stock-chip"
import { Badge } from "@/components/ui/badge"

interface Repuesto {
  id: string
  nombre: string
  precio: number
  enStock: boolean
  categoria: string
  compatibilidad: string[]
}

const mockRepuestos: Repuesto[] = [
  {
    id: "1",
    nombre: "Aceite Motor 5W-30 Mobil",
    precio: 15000,
    enStock: true,
    categoria: "Aceites",
    compatibilidad: ["Toyota", "Honda", "Nissan"],
  },
  {
    id: "2",
    nombre: "Filtro de Aceite Toyota Corolla",
    precio: 8500,
    enStock: true,
    categoria: "Filtros",
    compatibilidad: ["Toyota"],
  },
  {
    id: "3",
    nombre: "Pastillas de Freno Brembo",
    precio: 45000,
    enStock: true,
    categoria: "Frenos",
    compatibilidad: ["Toyota", "Honda", "Mazda"],
  },
  {
    id: "4",
    nombre: "Batería Bosch 12V 60Ah",
    precio: 95000,
    enStock: true,
    categoria: "Eléctricos",
    compatibilidad: ["Universal"],
  },
  {
    id: "5",
    nombre: "Aceite Transmisión ATF",
    precio: 22000,
    enStock: false,
    categoria: "Aceites",
    compatibilidad: ["Toyota", "Honda"],
  },
  {
    id: "6",
    nombre: "Kit Distribución Honda Civic",
    precio: 180000,
    enStock: false,
    categoria: "Motor",
    compatibilidad: ["Honda"],
  },
  {
    id: "7",
    nombre: "Amortiguador Delantero KYB",
    precio: 65000,
    enStock: true,
    categoria: "Suspensión",
    compatibilidad: ["Toyota", "Nissan"],
  },
]

const marcas = ["Toyota", "Honda", "Nissan", "Mazda", "Chevrolet", "Hyundai", "Kia"]
const anios = Array.from({ length: 20 }, (_, i) => (2024 - i).toString())

export default function RepuestosPortalPage() {
  const [busqueda, setBusqueda] = useState("")
  const [marca, setMarca] = useState("")
  const [anio, setAnio] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const filteredRepuestos = mockRepuestos.filter((r) => {
    const matchBusqueda = r.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const matchMarca = !marca || r.compatibilidad.includes(marca) || r.compatibilidad.includes("Universal")
    return matchBusqueda && matchMarca
  })

  const hasFilters = marca || anio

  const clearFilters = () => {
    setMarca("")
    setAnio("")
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
          <h1 className="min-w-0 flex-1 truncate text-lg font-semibold">Buscar Repuestos</h1>
          <Button
            variant="outline"
            size="icon"
            className="relative shrink-0 bg-transparent"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            {hasFilters && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />}
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Search */}
        <section className="border-b border-border bg-card px-4 py-3">
          <div className="mx-auto max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar repuesto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="bg-secondary pl-9"
              />
            </div>
          </div>
        </section>

        {/* Filters Panel */}
        {showFilters && (
          <section className="border-b border-border bg-card/50 px-4 py-4">
            <div className="mx-auto max-w-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Filtrar por Vehículo
                </h3>
                {hasFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 gap-1 text-xs">
                    <X className="h-3 w-3" />
                    Limpiar
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select value={marca} onValueChange={setMarca}>
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
                <Select value={anio} onValueChange={setAnio}>
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
          </section>
        )}

        {/* Active Filters */}
        {hasFilters && !showFilters && (
          <section className="border-b border-border px-4 py-2">
            <div className="mx-auto flex max-w-lg flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Filtros:</span>
              {marca && (
                <Badge variant="secondary" className="gap-1">
                  <Car className="h-3 w-3" />
                  {marca}
                </Badge>
              )}
              {anio && <Badge variant="secondary">{anio}</Badge>}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
                Limpiar
              </Button>
            </div>
          </section>
        )}

        {/* Results */}
        <section className="flex-1 px-4 py-4">
          <div className="mx-auto max-w-lg space-y-3">
            <p className="text-sm text-muted-foreground">{filteredRepuestos.length} repuestos encontrados</p>

            {filteredRepuestos.map((repuesto) => (
              <div
                key={repuesto.id}
                className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{repuesto.nombre}</p>
                      <p className="text-xs text-muted-foreground">{repuesto.categoria}</p>
                    </div>
                    <StockChip enStock={repuesto.enStock} />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-primary">${repuesto.precio.toLocaleString()}</p>
                    {!repuesto.enStock && (
                      <Link href={`/portal/cotizacion?repuesto=${encodeURIComponent(repuesto.nombre)}`}>
                        <Button size="sm" variant="outline">
                          Solicitar Cotización
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredRepuestos.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No se encontraron repuestos</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
