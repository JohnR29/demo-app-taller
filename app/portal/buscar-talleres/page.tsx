"use client"

import { useState } from "react"
import { WorkshopCard } from "@/components/marketplace/workshop-card"
import { DistanceSlider } from "@/components/shared/distance-slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Map, Search, SlidersHorizontal, X } from "lucide-react"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { designTokens } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

const mockWorkshops = [
  {
    id: "1",
    name: "Taller Mecánico Los Expertos",
    address: "Av. Providencia 1234, Santiago",
    distance: 1.2,
    rating: 4.8,
    reviewCount: 127,
    specialties: ["Frenos", "Suspensión", "Aceites", "Motor Diésel"],
    phone: "+56912345678",
    isOpen: true,
  },
  {
    id: "2",
    name: "AutoService Premium",
    address: "Calle Los Aromos 567, Providencia",
    distance: 2.5,
    rating: 4.6,
    reviewCount: 89,
    specialties: ["Electricidad", "Transmisión", "Aire Acondicionado"],
    phone: "+56987654321",
    isOpen: true,
  },
  {
    id: "3",
    name: "Mecánica Integral",
    address: "Av. Apoquindo 3456, Las Condes",
    distance: 3.8,
    rating: 4.9,
    reviewCount: 203,
    specialties: ["Frenos", "Suspensión", "Baterías", "Aceites", "Electricidad"],
    phone: "+56911223344",
    isOpen: false,
  },
  {
    id: "4",
    name: "TurboFix Motors",
    address: "Av. Vicuña Mackenna 2345, Ñuñoa",
    distance: 4.5,
    rating: 4.5,
    reviewCount: 156,
    specialties: ["Motor Diésel", "Transmisión", "Suspensión"],
    phone: "+56922334455",
    isOpen: true,
  },
  {
    id: "5",
    name: "Taller Express",
    address: "Calle San Diego 789, Santiago Centro",
    distance: 5.2,
    rating: 4.3,
    reviewCount: 67,
    specialties: ["Aceites", "Frenos", "Baterías"],
    phone: "+56933445566",
    isOpen: true,
  },
]

export default function BuscarTalleresPage() {
  const [distance, setDistance] = useState(10)
  const [specialty, setSpecialty] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPressed, setFilterPressed] = useState(false)
  const [clearPressed, setClearPressed] = useState(false)
  const [searchMode, setSearchMode] = useState<"name" | "vehicle">("name")
  const [vehicleSearch, setVehicleSearch] = useState({
    marca: "",
    modelo: "",
    año: "",
  })

  const filteredWorkshops = mockWorkshops.filter((workshop) => {
    if (workshop.distance > distance) return false
    if (specialty !== "all" && !workshop.specialties.includes(specialty)) return false
    if (searchMode === "name" && searchQuery && !workshop.name.toLowerCase().includes(searchQuery.toLowerCase()))
      return false
    return true
  })

  const handleFilterToggle = () => {
    setFilterPressed(true)
    setTimeout(() => {
      setFilterPressed(false)
      setShowFilters(!showFilters)
    }, 150)
  }

  const handleClearFilters = () => {
    setClearPressed(true)
    setTimeout(() => {
      setClearPressed(false)
      setSpecialty("all")
      setDistance(10)
      setSearchQuery("")
      setVehicleSearch({ marca: "", modelo: "", año: "" })
    }, 150)
  }

  return (
    <PageWrapper title="Buscar" icon={Map} backHref="/portal">
      <div className="border-b border-border bg-card px-2 py-2 sm:px-4 sm:py-3">
        <div className="space-y-2">
          <div className="flex gap-1 rounded-lg bg-secondary p-0.5">
            <button
              onClick={() => setSearchMode("name")}
              className={cn(
                "flex-1 rounded px-2 py-1.5 font-medium transition-all active:scale-95",
                designTokens.typography.bodyMd,
                searchMode === "name"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              Nombre
            </button>
            <button
              onClick={() => setSearchMode("vehicle")}
              className={cn(
                "flex-1 rounded px-2 py-1.5 font-medium transition-all active:scale-95",
                designTokens.typography.bodyMd,
                searchMode === "vehicle"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              Vehículo
            </button>
          </div>

          {searchMode === "name" && (
            <div className="flex gap-1">
              <div className="relative min-w-0 flex-1">
                <Search className={cn(designTokens.icon.sm, "absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground")} />
                <Input
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(designTokens.input.base, "pl-8")}
                />
              </div>
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={handleFilterToggle}
                className={cn(designTokens.button.sm, "w-[40px] shrink-0", filterPressed && "scale-95")}
              >
                <SlidersHorizontal className={designTokens.icon.sm} />
              </Button>
            </div>
          )}

          {searchMode === "vehicle" && (
            <div className="space-y-1.5">
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                <Input
                  placeholder="Marca"
                  value={vehicleSearch.marca}
                  onChange={(e) => setVehicleSearch({ ...vehicleSearch, marca: e.target.value })}
                  className={designTokens.input.base}
                />
                <Input
                  placeholder="Modelo"
                  value={vehicleSearch.modelo}
                  onChange={(e) => setVehicleSearch({ ...vehicleSearch, modelo: e.target.value })}
                  className={designTokens.input.base}
                />
                <Input
                  placeholder="Año"
                  type="number"
                  value={vehicleSearch.año}
                  onChange={(e) => setVehicleSearch({ ...vehicleSearch, año: e.target.value })}
                  className={cn(designTokens.input.base, "col-span-2 sm:col-span-1")}
                />
              </div>
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={handleFilterToggle}
                className={cn(designTokens.button.md, "w-full")}
              >
                <SlidersHorizontal className={cn(designTokens.icon.sm, "mr-1")} />
                {showFilters ? "Ocultar" : "Filtros"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="border-b border-border bg-muted/30 px-2 py-2 sm:px-4 sm:py-3">
          <div className="space-y-2 sm:space-y-3">
            <div className="space-y-1">
              <label className={cn(designTokens.input.label)}>Especialidad</label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className={designTokens.input.base}>
                  <SelectValue placeholder="Todas las especialidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las especialidades</SelectItem>
                  <SelectItem value="Frenos">Frenos</SelectItem>
                  <SelectItem value="Suspensión">Suspensión</SelectItem>
                  <SelectItem value="Aceites">Cambio de Aceites</SelectItem>
                  <SelectItem value="Motor Diésel">Motor Diésel</SelectItem>
                  <SelectItem value="Electricidad">Electricidad</SelectItem>
                  <SelectItem value="Transmisión">Transmisión</SelectItem>
                  <SelectItem value="Aire Acondicionado">Aire Acondicionado</SelectItem>
                  <SelectItem value="Baterías">Baterías</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DistanceSlider value={distance} onChange={setDistance} min={1} max={50} />

            <Button
              variant="ghost"
              size="sm"
              className={cn(designTokens.button.md, "w-full", clearPressed && "scale-95 bg-muted")}
              onClick={handleClearFilters}
            >
              <X className={cn(designTokens.icon.sm, "mr-1")} />
              Limpiar
            </Button>
          </div>
        </div>
      )}

      <div className="hidden border-b border-border bg-muted/50 lg:block">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <Map className={cn(designTokens.icon.lg, "mx-auto text-muted-foreground/30")} />
            <p className={cn(designTokens.typography.body, "mt-3 text-muted-foreground")}>
              {filteredWorkshops.length} talleres en el área
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="border-b border-border bg-muted/30 px-2 py-1.5 sm:px-4 sm:py-2">
          <p className={cn(designTokens.typography.bodyMd, "text-muted-foreground")}>
            {filteredWorkshops.length} {filteredWorkshops.length === 1 ? "taller" : "talleres"}
            {searchMode === "vehicle" && vehicleSearch.marca && (
              <span className="ml-1 font-medium text-foreground">
                {vehicleSearch.marca}
              </span>
            )}
          </p>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="space-y-2 p-2 sm:space-y-2.5 sm:p-3">
            {filteredWorkshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} onSchedule={() => {}} />
            ))}

            {filteredWorkshops.length === 0 && (
              <div className="py-12 text-center">
                <Map className={cn(designTokens.icon.lg, "mx-auto text-muted-foreground/30")} />
                <p className={cn(designTokens.typography.h3, "mt-4 text-foreground")}>No se encontraron talleres</p>
                <p className={cn(designTokens.typography.bodyMd, "mt-1 text-muted-foreground")}>
                  Intenta ajustar los filtros de búsqueda
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
