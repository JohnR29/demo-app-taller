"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Save, Building, Bell, Palette, Shield, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const settingsSections = [
  {
    id: "empresa",
    label: "Empresa",
    icon: Building,
    description: "Datos del taller y facturación",
  },
  {
    id: "notificaciones",
    label: "Notificaciones",
    icon: Bell,
    description: "Alertas y recordatorios",
  },
  {
    id: "apariencia",
    label: "Apariencia",
    icon: Palette,
    description: "Tema y personalización",
  },
  {
    id: "seguridad",
    label: "Seguridad",
    icon: Shield,
    description: "Contraseña y acceso",
  },
]

export default function ConfiguracionPage() {
  const [activeSection, setActiveSection] = useState("empresa")
  const [settings, setSettings] = useState({
    nombreTaller: "AutoService Premium",
    rut: "76.123.456-7",
    direccion: "Av. Principal 1234, Santiago",
    telefono: "+56 2 2345 6789",
    notifEmail: true,
    notifStock: true,
    notifCitas: true,
    darkMode: true,
  })

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Configuración</h1>
          <p className="text-sm text-muted-foreground">Personaliza tu experiencia en TallerMS</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Settings Navigation */}
          <nav className="space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors",
                  activeSection === section.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <section.icon className="h-5 w-5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{section.label}</p>
                  <p className="text-xs opacity-70">{section.description}</p>
                </div>
                <ChevronRight className="h-4 w-4" />
              </button>
            ))}
          </nav>

          {/* Settings Content */}
          <div className="rounded-lg border border-border bg-card p-4 md:col-span-2 md:p-6">
            {activeSection === "empresa" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Datos de la Empresa</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombreTaller">Nombre del Taller</Label>
                    <Input
                      id="nombreTaller"
                      value={settings.nombreTaller}
                      onChange={(e) => setSettings({ ...settings, nombreTaller: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rut">RUT</Label>
                    <Input
                      id="rut"
                      value={settings.rut}
                      onChange={(e) => setSettings({ ...settings, rut: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={settings.direccion}
                      onChange={(e) => setSettings({ ...settings, direccion: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={settings.telefono}
                      onChange={(e) => setSettings({ ...settings, telefono: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "notificaciones" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Notificaciones</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">Notificaciones por Email</p>
                      <p className="text-sm text-muted-foreground">Recibe alertas en tu correo</p>
                    </div>
                    <Switch
                      checked={settings.notifEmail}
                      onCheckedChange={(checked) => setSettings({ ...settings, notifEmail: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">Alertas de Stock Bajo</p>
                      <p className="text-sm text-muted-foreground">Cuando un producto llega al mínimo</p>
                    </div>
                    <Switch
                      checked={settings.notifStock}
                      onCheckedChange={(checked) => setSettings({ ...settings, notifStock: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">Recordatorio de Citas</p>
                      <p className="text-sm text-muted-foreground">30 minutos antes de cada cita</p>
                    </div>
                    <Switch
                      checked={settings.notifCitas}
                      onCheckedChange={(checked) => setSettings({ ...settings, notifCitas: checked })}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "apariencia" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Apariencia</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">Modo Oscuro</p>
                      <p className="text-sm text-muted-foreground">Interfaz optimizada para taller</p>
                    </div>
                    <Switch
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "seguridad" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Seguridad</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                    <Input id="currentPassword" type="password" className="bg-secondary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <Input id="newPassword" type="password" className="bg-secondary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input id="confirmPassword" type="password" className="bg-secondary" />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
