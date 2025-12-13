"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText, MapPin, DollarSign, Calendar, Car, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { designTokens } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

const mockVehiculos = [
  {
    id: "1",
    patente: "ABC-123",
    marca: "Toyota",
    modelo: "Corolla",
    año: 2020,
    color: "Blanco",
    historial: [
      {
        id: "1",
        otId: "OT-001",
        fecha: "15 de Noviembre, 2024",
        taller: "Taller Mecánico Los Expertos",
        servicio: "Cambio de Aceite y Filtro",
        costo: 45000,
        estado: "completado",
      },
      {
        id: "2",
        otId: "OT-004",
        fecha: "22 de Octubre, 2024",
        taller: "AutoService Premium",
        servicio: "Reparación de Frenos",
        costo: 120000,
        estado: "completado",
      },
      {
        id: "3",
        otId: "OT-008",
        fecha: "5 de Octubre, 2024",
        taller: "Mecánica Integral",
        servicio: "Revisión Preventiva",
        costo: 65000,
        estado: "completado",
      },
    ],
  },
  {
    id: "2",
    patente: "XYZ-789",
    marca: "Honda",
    modelo: "Civic",
    año: 2022,
    color: "Gris",
    historial: [
      {
        id: "1",
        otId: "OT-002",
        fecha: "1 de Diciembre, 2024",
        taller: "TurboFix Motors",
        servicio: "Mantención General",
        costo: 55000,
        estado: "completado",
      },
      {
        id: "2",
        otId: "OT-005",
        fecha: "15 de Noviembre, 2024",
        taller: "Taller Express",
        servicio: "Rotación de Neumáticos",
        costo: 35000,
        estado: "completado",
      },
    ],
  },
  {
    id: "3",
    patente: "DEF-456",
    marca: "Hyundai",
    modelo: "Tucson",
    año: 2019,
    color: "Negro",
    historial: [
      {
        id: "1",
        otId: "OT-003",
        fecha: "20 de Noviembre, 2024",
        taller: "Mecánica Integral",
        servicio: "Cambio de Batería",
        costo: 90000,
        estado: "completado",
      },
      {
        id: "2",
        otId: "OT-006",
        fecha: "10 de Octubre, 2024",
        taller: "AutoService Premium",
        servicio: "Alineación y Balanceo",
        costo: 75000,
        estado: "completado",
      },
      {
        id: "3",
        otId: "OT-007",
        fecha: "25 de Septiembre, 2024",
        taller: "Taller Mecánico Los Expertos",
        servicio: "Cambio de Aceite",
        costo: 40000,
        estado: "completado",
      },
    ],
  },
]

export default function HistorialVehiculoPage() {
  const [selectedVehiculo, setSelectedVehiculo] = useState<string | null>(null)
  const vehiculoSeleccionado = mockVehiculos.find((v) => v.id === selectedVehiculo)

  if (!vehiculoSeleccionado) {
    return (
      <PageWrapper
        title="Mis Vehículos"
        icon={FileText}
        backHref="/portal"
      >
        <div className={designTokens.spacing.section}>
          <div className="space-y-1 pb-1.5">
            <h2 className={designTokens.typography.h3}>Selecciona vehículo</h2>
            <p className={designTokens.typography.body}>{mockVehiculos.length} registrados</p>
          </div>

          <div className="space-y-1.5">
            {mockVehiculos.map((vehiculo) => (
              <button
                key={vehiculo.id}
                onClick={() => setSelectedVehiculo(vehiculo.id)}
                className={cn(designTokens.card.base, designTokens.card.hover, designTokens.spacing.card, "w-full text-left")}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex min-w-0 flex-1 items-start gap-1.5">
                    <div className="mt-0.5 shrink-0 rounded bg-muted p-1">
                      <Car className={designTokens.icon.sm} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className={cn(designTokens.typography.bodyMd, "truncate font-semibold")}>
                          {vehiculo.marca} {vehiculo.modelo}
                        </p>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {vehiculo.año}
                        </Badge>
                      </div>
                      <p className={designTokens.typography.body}>
                        {vehiculo.patente} • {vehiculo.color}
                      </p>
                      <p className={designTokens.typography.body}>{vehiculo.historial.length} servicios</p>
                    </div>
                  </div>
                  <ChevronRight className={cn(designTokens.icon.sm, "mt-0.5 shrink-0 text-muted-foreground")} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper
      title="Historial"
      icon={FileText}
      backHref="/portal"
      headerActions={
        <button
          onClick={() => setSelectedVehiculo(null)}
          className="text-xs font-medium text-primary hover:underline"
        >
          Volver
        </button>
      }
    >
      <div className={designTokens.spacing.section}>
        <SectionWrapper>
          <div className="flex items-start gap-1.5">
            <div className="shrink-0 rounded bg-muted p-1">
              <Car className={designTokens.icon.sm} />
            </div>
            <div className="min-w-0 flex-1">
              <p className={cn(designTokens.typography.h3, "uppercase")}>{vehiculoSeleccionado.patente}</p>
              <p className={designTokens.typography.body}>
                {vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo} {vehiculoSeleccionado.año}
              </p>
              <p className={designTokens.typography.body}>C: {vehiculoSeleccionado.color}</p>
            </div>
          </div>
        </SectionWrapper>

        <div className="space-y-1">
          <h3 className={designTokens.typography.h3}>Servicios</h3>
          {vehiculoSeleccionado.historial.length > 0 ? (
            <div className="space-y-1.5">
              {vehiculoSeleccionado.historial.map((item) => (
                <SectionWrapper key={item.id} contentClassName="space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0 flex-1">
                      <p className={cn(designTokens.typography.bodyMd, "truncate font-semibold")}>{item.servicio}</p>
                      <div className="flex items-center gap-0.5">
                        <Calendar className={designTokens.icon.xs} />
                        <span className={cn(designTokens.typography.body, "truncate")}>{item.fecha}</span>
                      </div>
                    </div>
                    <Link href={`/portal/ot/${item.otId}`} className="shrink-0">
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary shrink-0 text-xs hover:bg-primary/20 transition-colors cursor-pointer"
                      >
                        {item.otId}
                      </Badge>
                    </Link>
                  </div>

                  <div className="flex items-center gap-1 border-t border-border pt-1">
                    <div className="flex min-w-0 flex-1 items-center gap-0.5">
                      <MapPin className={cn(designTokens.icon.xs, "shrink-0 text-muted-foreground")} />
                      <span className={cn(designTokens.typography.body, "truncate")}>{item.taller}</span>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0 whitespace-nowrap">
                      <DollarSign className={designTokens.icon.xs} />
                      <span className={cn(designTokens.typography.body, "font-semibold")}>
                        {item.costo.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </SectionWrapper>
              ))}
            </div>
          ) : (
            <SectionWrapper className="border-dashed py-4 text-center">
              <FileText className={cn(designTokens.icon.lg, "mx-auto text-muted-foreground/30")} />
              <p className={cn(designTokens.typography.body, "mt-1")}>Sin historial</p>
            </SectionWrapper>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
