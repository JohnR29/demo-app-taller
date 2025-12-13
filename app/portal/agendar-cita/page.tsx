"use client"

import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { designTokens } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

export default function AgendarCitaPage() {
  return (
    <PageWrapper title="Agendar una Cita" icon={Calendar} backHref="/portal">
      <div className={designTokens.spacing.section}>
        {/* Seleccionar Taller */}
        <SectionWrapper title="Elige tu Taller">
          <div className="space-y-1">
            <Label htmlFor="taller" className={designTokens.input.label}>
              Taller
            </Label>
            <Select>
              <SelectTrigger id="taller" className={designTokens.input.base}>
                <SelectValue placeholder="Selecciona un taller" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Taller Mecánico Los Expertos - 1.2 km</SelectItem>
                <SelectItem value="2">AutoService Premium - 2.5 km</SelectItem>
                <SelectItem value="3">Mecánica Integral - 3.8 km</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </SectionWrapper>

        {/* Seleccionar Servicio */}
        <SectionWrapper title="Tipo de Servicio">
          <div className="space-y-1">
            <Label htmlFor="servicio" className={designTokens.input.label}>
              Servicio
            </Label>
            <Select>
              <SelectTrigger id="servicio" className={designTokens.input.base}>
                <SelectValue placeholder="¿Qué necesitas?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aceite">Cambio de Aceite</SelectItem>
                <SelectItem value="frenos">Revisión de Frenos</SelectItem>
                <SelectItem value="suspension">Suspensión</SelectItem>
                <SelectItem value="bateria">Cambio de Batería</SelectItem>
                <SelectItem value="diagnostico">Diagnóstico General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </SectionWrapper>

        {/* Fecha y Hora */}
        <SectionWrapper title="Fecha y Hora">
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="fecha" className={designTokens.input.label}>
                Fecha
              </Label>
              <Input id="fecha" type="date" className={designTokens.input.base} />
            </div>

            <div className="space-y-1">
              <Label className={designTokens.input.label}>Hora</Label>
              <div className="grid grid-cols-3 gap-1">
                {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map((time) => (
                  <button
                    key={time}
                    className={cn(
                      designTokens.card.base,
                      designTokens.button.sm,
                      "transition-all active:scale-95 hover:bg-primary/10 hover:border-primary"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Información de Contacto */}
        <SectionWrapper title="Tus Datos">
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="nombre" className={designTokens.input.label}>
                Nombre
              </Label>
              <Input id="nombre" placeholder="Juan Pérez" className={designTokens.input.base} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="telefono" className={designTokens.input.label}>
                Teléfono
              </Label>
              <Input id="telefono" placeholder="+56912345678" className={designTokens.input.base} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className={designTokens.input.label}>
                Email
              </Label>
              <Input id="email" type="email" placeholder="juan@example.com" className={designTokens.input.base} />
            </div>
          </div>
        </SectionWrapper>

        {/* Botones */}
        <div className="flex gap-1 pt-1">
          <Button variant="outline" className={cn(designTokens.button.md, "w-full")}>
            Cancelar
          </Button>
          <Button className={cn(designTokens.button.md, "flex-1")}>Confirmar Cita</Button>
        </div>
      </div>
    </PageWrapper>
  )
}
