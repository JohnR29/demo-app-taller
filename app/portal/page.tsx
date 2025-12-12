"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Package, Calendar, Car, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PortalHomePage() {
  const [patente, setPatente] = useState("")

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Car className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">TallerMS</span>
          </div>
          <span className="text-xs text-muted-foreground">Portal Cliente</span>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="border-b border-border bg-card px-4 py-8">
          <div className="mx-auto max-w-lg space-y-4 text-center">
            <h1 className="text-balance text-2xl font-bold">Bienvenido al Portal de Clientes</h1>
            <p className="text-pretty text-muted-foreground">
              Consulta el historial de tu vehículo, busca repuestos disponibles o agenda una cita de servicio.
            </p>
          </div>
        </section>

        {/* Search by Plate */}
        <section className="px-4 py-6">
          <div className="mx-auto max-w-lg space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Consultar mi Vehículo
            </h2>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="patente">Patente del Vehículo</Label>
                <Input
                  id="patente"
                  placeholder="ABC-123"
                  value={patente}
                  onChange={(e) => setPatente(e.target.value.toUpperCase())}
                  className="bg-secondary font-mono text-lg uppercase"
                />
              </div>
              <Button className="w-full gap-2" size="lg" disabled={patente.length < 5}>
                <Search className="h-5 w-5" />
                Consultar Historial
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="flex-1 px-4 py-6">
          <div className="mx-auto max-w-lg space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Acciones Rápidas</h2>
            <div className="grid gap-3">
              <Link
                href="/portal/repuestos"
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">Buscar Repuestos</p>
                  <p className="text-sm text-muted-foreground">Consulta disponibilidad y precios</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Link>

              <Link
                href="/portal/agendar"
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">Agendar Cita</p>
                  <p className="text-sm text-muted-foreground">Reserva tu hora de servicio</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50 px-4 py-4">
          <div className="mx-auto max-w-lg text-center text-xs text-muted-foreground">
            <p>TallerMS - Sistema de Gestión de Taller</p>
            <Link href="/login" className="mt-1 inline-block text-primary hover:underline">
              Acceso Personal del Taller
            </Link>
          </div>
        </footer>
      </main>
    </div>
  )
}
