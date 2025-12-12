"use client"

import { Card } from "@/components/ui/card"
import { RatingStars } from "@/components/shared/rating-stars"
import { SpecialtyTag } from "@/components/shared/specialty-tag"
import { MapPin, Phone, Clock } from "lucide-react"

interface PublicPreviewProps {
  name: string
  address: string
  phone: string
  rating: number
  reviewCount: number
  specialties: string[]
}

export function PublicPreview({ name, address, phone, rating, reviewCount, specialties }: PublicPreviewProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Vista Previa Pública</h3>
        <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs font-medium text-success">Activo</span>
      </div>

      <Card className="border-2 border-primary/30 bg-card p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-foreground">{name}</h4>
            <div className="flex items-center gap-2">
              <RatingStars rating={rating} size="sm" showValue />
              <span className="text-xs text-muted-foreground">({reviewCount} reseñas)</span>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0" />
              <span>Lun-Vie: 8:00-18:00, Sáb: 9:00-13:00</span>
            </div>
          </div>

          {/* Specialties */}
          {specialties.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Especialidades</p>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <SpecialtyTag key={specialty} label={specialty} size="sm" />
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
