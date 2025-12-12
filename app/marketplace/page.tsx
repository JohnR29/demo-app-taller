"use client"

import { useState } from "react"
import { WorkshopCard } from "@/components/marketplace/workshop-card"
import { DistanceSlider } from "@/components/shared/distance-slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Map, Search, SlidersHorizontal, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

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

export default function MarketplacePage() {
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
    // Additional filtering logic for vehicle search can be added here if needed
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
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-hidden bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-4">
          <Map className="h-5 w-5 shrink-0 text-primary" />
          <h1 className="min-w-0 truncate text-base font-bold text-foreground sm:text-lg">Buscar Talleres</h1>
        </div>
      </header>

      <div className="border-b border-border bg-card px-3 py-3 sm:px-4">
        <div className="space-y-3">
          <div className="flex gap-2 rounded-lg bg-secondary p-1">
            <button
              onClick={() => setSearchMode("name")}
              className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-all active:scale-95 sm:text-sm ${
                searchMode === "name" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Por Nombre
            </button>
            <button
              onClick={() => setSearchMode("vehicle")}
              className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-all active:scale-95 sm:text-sm ${
                searchMode === "vehicle" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Por Vehículo
            </button>
          </div>

          {searchMode === "name" && (
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar talleres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="min-h-[44px] pl-9"
                />
              </div>
              <Button
                variant={showFilters ? "default" : "outline"}
                size="icon"
                onClick={handleFilterToggle}
                className={`h-[44px] w-[44px] shrink-0 transition-all ${filterPressed ? "scale-95" : "active:scale-95"}`}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          )}

          {searchMode === "vehicle" && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Input
                  placeholder="Marca"
                  value={vehicleSearch.marca}
                  onChange={(e) => setVehicleSearch({ ...vehicleSearch, marca: e.target.value })}
                  className="min-h-[44px]"
                />
                <Input
                  placeholder="Modelo"
                  value={vehicleSearch.modelo}
                  onChange={(e) => setVehicleSearch({ ...vehicleSearch, modelo: e.target.value })}
                  className="min-h-[44px]"
                />
                <Input
                  placeholder="Año"
                  type="number"
                  value={vehicleSearch.año}
                  onChange={(e) => setVehicleSearch({ ...vehicleSearch, año: e.target.value })}
                  className="min-h-[44px] col-span-2 sm:col-span-1"
                />
              </div>
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={handleFilterToggle}
                className="w-full min-h-[44px] transition-all active:scale-95"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {showFilters ? "Ocultar Filtros" : "Más Filtros"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="border-b border-border bg-muted/30 px-3 py-3 sm:px-4 sm:py-4">
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground sm:text-sm">Especialidad</label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className="min-h-[44px]">
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
              className={`min-h-[44px] w-full transition-all ${
                clearPressed ? "scale-95 bg-muted" : "hover:bg-muted active:scale-95"
              }`}
              onClick={handleClearFilters}
            >
              <X className="mr-2 h-4 w-4" />
              Limpiar filtros
            </Button>
          </div>
        </div>
      )}

      <div className="hidden border-b border-border bg-muted/50 lg:block">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <Map className="mx-auto h-16 w-16 text-muted-foreground/30" />
            <p className="mt-3 text-sm text-muted-foreground">{filteredWorkshops.length} talleres en el área</p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="border-b border-border bg-muted/30 px-3 py-2 sm:px-4">
          <p className="text-xs text-muted-foreground sm:text-sm">
            {filteredWorkshops.length} {filteredWorkshops.length === 1 ? "taller encontrado" : "talleres encontrados"}
            {searchMode === "vehicle" && vehicleSearch.marca && (
              <span className="ml-1 font-medium text-foreground">
                para {vehicleSearch.marca} {vehicleSearch.modelo} {vehicleSearch.año}
              </span>
            )}
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)] lg:h-[calc(100vh-520px)]">
          <div className="space-y-2.5 p-3 sm:space-y-3 sm:p-4">
            {filteredWorkshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} onSchedule={() => {}} />
            ))}

            {filteredWorkshops.length === 0 && (
              <div className="py-12 text-center">
                <Map className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-sm font-medium text-foreground">No se encontraron talleres</p>
                <p className="mt-1 text-xs text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
