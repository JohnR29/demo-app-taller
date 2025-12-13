"use client"

import Link from "next/link"
import { MapPin, Package, FileText, Calendar, ArrowRight, Car } from "lucide-react"
import { designTokens } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

export default function PortalHomePage() {
  const menuOptions = [
    {
      href: "/portal/buscar-talleres",
      icon: MapPin,
      color: "blue",
      title: "Encuentra tu Taller",
      description: "Busca el taller más cercano"
    },
    {
      href: "/portal/repuestos",
      icon: Package,
      color: "green",
      title: "Encuentra tu Repuesto",
      description: "Consulta disponibilidad y precios"
    },
    {
      href: "/portal/historial-vehiculo",
      icon: FileText,
      color: "purple",
      title: "Historial de Vehículo",
      description: "Consulta todas las reparaciones"
    },
    {
      href: "/portal/agendar-cita",
      icon: Calendar,
      color: "orange",
      title: "Agendar una Cita",
      description: "Reserva tu hora de servicio"
    }
  ]

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-lg items-center justify-between px-2 sm:px-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary">
              <Car className={cn(designTokens.icon.sm, "text-primary-foreground")} />
            </div>
            <span className={designTokens.typography.h2}>TallerMS</span>
          </div>
          <span className={cn(designTokens.typography.bodyMd, "text-muted-foreground")}>Portal Cliente</span>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="border-b border-border bg-card px-2 py-4 sm:px-4 sm:py-8">
          <div className="mx-auto max-w-lg space-y-2 sm:space-y-4 text-center">
            <h1 className={cn(designTokens.typography.h1, "text-balance")}>Bienvenido al Portal</h1>
            <p className={cn(designTokens.typography.body, "text-pretty text-muted-foreground")}>
              Accede a todas las funciones para gestionar tu vehículo, talleres y citas de servicio.
            </p>
          </div>
        </section>

        {/* Menú Rápido */}
        <section className="flex-1 px-2 py-3 sm:px-4 sm:py-6">
          <div className="mx-auto max-w-lg space-y-2 sm:space-y-4">
            <h2 className={cn(designTokens.typography.label, "text-muted-foreground")}>
              Funcionalidades Principales
            </h2>
            <div className="grid gap-2 sm:gap-3">
              {menuOptions.map((option) => {
                const Icon = option.icon
                return (
                  <Link
                    key={option.href}
                    href={option.href}
                    className={cn(
                      "flex items-center gap-2 sm:gap-4 rounded-xl border border-border bg-card",
                      designTokens.spacing.card,
                      "transition-colors hover:bg-secondary active:scale-95"
                    )}
                  >
                    <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-${option.color}-500/20`}>
                      <Icon className={cn(designTokens.icon.md, `text-${option.color}-500`)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={designTokens.typography.h3}>{option.title}</p>
                      <p className={cn(designTokens.typography.bodyMd, "text-muted-foreground")}>{option.description}</p>
                    </div>
                    <ArrowRight className={cn(designTokens.icon.sm, "shrink-0 text-muted-foreground")} />
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50 px-2 py-2 sm:px-4 sm:py-4">
          <div className="mx-auto max-w-lg text-center">
            <p className={cn(designTokens.typography.bodyMd, "text-muted-foreground")}>TallerMS - Sistema de Gestión de Taller</p>
            <a href="/login" className={cn(designTokens.typography.bodyMd, "mt-1 inline-block text-primary hover:underline")}>
              Acceso Personal del Taller
            </a>
          </div>
        </footer>
      </main>
    </div>
  )
}
