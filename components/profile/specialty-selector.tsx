"use client"

import { Card } from "@/components/ui/card"
import { SpecialtyTag } from "@/components/shared/specialty-tag"
import { Wrench, Zap, Disc, Droplet, Wind, Settings, Gauge, Battery } from "lucide-react"

const availableSpecialties = [
  { id: "frenos", label: "Frenos", icon: Disc },
  { id: "motor-diesel", label: "Motor Diésel", icon: Settings },
  { id: "suspension", label: "Suspensión", icon: Wrench },
  { id: "electricidad", label: "Electricidad", icon: Zap },
  { id: "transmision", label: "Transmisión", icon: Gauge },
  { id: "aire-acondicionado", label: "Aire Acondicionado", icon: Wind },
  { id: "aceites", label: "Cambio de Aceites", icon: Droplet },
  { id: "baterias", label: "Baterías", icon: Battery },
]

interface SpecialtySelectorProps {
  selected: string[]
  onChange: (selected: string[]) => void
}

export function SpecialtySelector({ selected, onChange }: SpecialtySelectorProps) {
  const toggleSpecialty = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <Card className="p-3 sm:p-4">
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Especialidades del Taller</h3>
          <p className="mt-1 text-xs text-muted-foreground">Selecciona los servicios que ofrece tu taller</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {availableSpecialties.map((specialty) => (
            <SpecialtyTag
              key={specialty.id}
              label={specialty.label}
              icon={specialty.icon}
              selected={selected.includes(specialty.id)}
              onClick={() => toggleSpecialty(specialty.id)}
              size="md"
            />
          ))}
        </div>

        <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
          <p className="text-xs font-medium text-muted-foreground">
            Seleccionadas: {selected.length} de {availableSpecialties.length}
          </p>
          {selected.length === 0 && <span className="text-xs text-warning">Selecciona al menos una</span>}
        </div>
      </div>
    </Card>
  )
}
