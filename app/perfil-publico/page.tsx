"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { PublicPreview } from "@/components/profile/public-preview"
import { LocationManager } from "@/components/profile/location-manager"
import { SpecialtySelector } from "@/components/profile/specialty-selector"
import { ReputationModule } from "@/components/profile/reputation-module"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Save, Globe, AlertTriangle, Undo2 } from "lucide-react"

export default function PerfilPublicoPage() {
  const [address, setAddress] = useState("Av. Providencia 1234, Santiago, Región Metropolitana")
  const [selectedSpecialties, setSelectedSpecialties] = useState(["frenos", "suspension", "aceites"])
  const [originalAddress] = useState(address)
  const [originalSpecialties] = useState(selectedSpecialties)
  const [hasChanges, setHasChanges] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const specialtyLabels = {
    frenos: "Frenos",
    "motor-diesel": "Motor Diésel",
    suspension: "Suspensión",
    electricidad: "Electricidad",
    transmision: "Transmisión",
    "aire-acondicionado": "Aire Acondicionado",
    aceites: "Cambio de Aceites",
    baterias: "Baterías",
  }

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress)
    setHasChanges(
      newAddress !== originalAddress || JSON.stringify(selectedSpecialties) !== JSON.stringify(originalSpecialties),
    )
  }

  const handleSpecialtiesChange = (newSpecialties: string[]) => {
    setSelectedSpecialties(newSpecialties)
    setHasChanges(address !== originalAddress || JSON.stringify(newSpecialties) !== JSON.stringify(originalSpecialties))
  }

  const handleSave = () => {
    setShowSaveDialog(true)
  }

  const confirmSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setShowSaveDialog(false)
      setHasChanges(false)
      console.log("[v0] Profile saved successfully")
      alert("Perfil público actualizado exitosamente")
    }, 1000)
  }

  const handleReset = () => {
    setShowResetDialog(true)
  }

  const confirmReset = () => {
    setAddress(originalAddress)
    setSelectedSpecialties(originalSpecialties)
    setHasChanges(false)
    setShowResetDialog(false)
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-4 p-3 pb-24 sm:space-y-6 sm:p-4 md:p-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6" />
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">Mi Perfil Público</h1>
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">Gestiona cómo se ve tu taller en el marketplace</p>
        </div>

        {hasChanges && (
          <div className="flex items-center gap-2 rounded-lg border border-warning/50 bg-warning/10 p-3 text-sm">
            <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
            <span className="min-w-0 flex-1 text-xs text-foreground sm:text-sm">Tienes cambios sin guardar</span>
          </div>
        )}

        <PublicPreview
          name="Taller Mecánico Los Expertos"
          address={address}
          phone="+56 9 1234 5678"
          rating={4.8}
          reviewCount={127}
          specialties={selectedSpecialties.map((id) => specialtyLabels[id as keyof typeof specialtyLabels])}
        />

        <LocationManager address={address} onAddressChange={handleAddressChange} />

        <SpecialtySelector selected={selectedSpecialties} onChange={handleSpecialtiesChange} />

        <ReputationModule averageRating={4.8} totalReviews={127} recentReviews={[]} />

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Button
            variant="outline"
            size="lg"
            className="min-h-[48px] w-full transition-all hover:bg-muted active:scale-95 sm:w-auto sm:flex-1 bg-transparent"
            onClick={handleReset}
            disabled={!hasChanges}
          >
            <Undo2 className="mr-2 h-4 w-4" />
            Descartar Cambios
          </Button>
          <Button
            className="min-h-[48px] w-full transition-all active:scale-95 disabled:opacity-50 sm:w-auto sm:flex-1"
            size="lg"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        title="Guardar Cambios"
        description="Los cambios se reflejarán inmediatamente en tu perfil público del marketplace. ¿Deseas continuar?"
        confirmLabel="Guardar"
        cancelLabel="Cancelar"
        onConfirm={confirmSave}
        icon={<Save className="h-12 w-12 text-primary" />}
      />

      <ConfirmDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        title="Descartar Cambios"
        description="Se perderán todos los cambios que no hayas guardado. ¿Estás seguro?"
        confirmLabel="Descartar"
        cancelLabel="Volver"
        onConfirm={confirmReset}
        variant="destructive"
        icon={<AlertTriangle className="h-12 w-12 text-destructive" />}
      />
    </AppLayout>
  )
}
