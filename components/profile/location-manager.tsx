"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Map } from "lucide-react"

interface LocationManagerProps {
  address: string
  onAddressChange: (address: string) => void
}

export function LocationManager({ address, onAddressChange }: LocationManagerProps) {
  const [showMapSimulation, setShowMapSimulation] = useState(false)
  const [isMapPressed, setIsMapPressed] = useState(false)

  const handleMapToggle = () => {
    setIsMapPressed(true)
    setTimeout(() => {
      setIsMapPressed(false)
      setShowMapSimulation(!showMapSimulation)
    }, 150)
  }

  return (
    <Card className="p-3 sm:p-4">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Ubicación del Taller</h3>
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="address" className="text-xs sm:text-sm">
              Dirección completa
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="Av. Principal 1234, Santiago"
              className="min-h-[44px] w-full"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            className={`min-h-[44px] w-full transition-all bg-transparent ${
              isMapPressed ? "scale-95" : "active:scale-95"
            }`}
            onClick={handleMapToggle}
          >
            <Map className="mr-2 h-4 w-4" />
            {showMapSimulation ? "Ocultar Mapa" : "Seleccionar en Mapa"}
          </Button>

          {showMapSimulation && (
            <div className="animate-in fade-in-50 slide-in-from-top-2 duration-300 overflow-hidden rounded-lg border border-border bg-muted/30">
              <div className="flex aspect-video items-center justify-center">
                <div className="text-center">
                  <Map className="mx-auto h-10 w-10 text-muted-foreground/50 sm:h-12 sm:w-12" />
                  <p className="mt-2 text-xs text-muted-foreground">Simulación de selector de mapa</p>
                  <p className="mt-1 text-xs text-muted-foreground/70">Lat: -33.4489, Lng: -70.6693</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
