"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RatingStars } from "@/components/shared/rating-stars"
import { SpecialtyTag } from "@/components/shared/specialty-tag"
import { MapPin, Phone, ChevronDown, ChevronUp, ChevronRight } from "lucide-react"

interface Workshop {
  id: string
  name: string
  address: string
  distance: number
  rating: number
  reviewCount: number
  specialties: string[]
  phone: string
  isOpen: boolean
}

interface WorkshopCardProps {
  workshop: Workshop
  onSchedule: (workshopId: string) => void
}

export function WorkshopCard({ workshop, onSchedule }: WorkshopCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCallingPressed, setIsCallingPressed] = useState(false)

  const handleCall = () => {
    setIsCallingPressed(true)
    setTimeout(() => setIsCallingPressed(false), 200)
  }

  return (
    <Card className="min-w-0 overflow-hidden transition-shadow hover:shadow-lg">
      <div className="space-y-3 p-3 sm:space-y-4 sm:p-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold text-foreground sm:text-base">{workshop.name}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <RatingStars rating={workshop.rating} size="sm" showValue />
                <span className="text-xs text-muted-foreground">({workshop.reviewCount})</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-base font-bold text-primary sm:text-lg">{workshop.distance} km</div>
              <span className={workshop.isOpen ? "text-xs font-medium text-success" : "text-xs text-muted-foreground"}>
                {workshop.isOpen ? "Abierto" : "Cerrado"}
              </span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground sm:text-sm">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          <span className={isExpanded ? "" : "line-clamp-1"}>{workshop.address}</span>
        </div>

        {/* Specialties */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {(isExpanded ? workshop.specialties : workshop.specialties.slice(0, 3)).map((specialty) => (
              <SpecialtyTag key={specialty} label={specialty} size="sm" />
            ))}
            {!isExpanded && workshop.specialties.length > 3 && (
              <span className="flex h-6 items-center px-2 text-xs text-muted-foreground">
                +{workshop.specialties.length - 3} más
              </span>
            )}
          </div>

          {workshop.specialties.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex w-full items-center justify-center gap-1 rounded-md py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10 active:bg-primary/20"
            >
              {isExpanded ? (
                <>
                  Ver menos <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  Ver todas las especialidades <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`min-h-[44px] flex-1 transition-all ${
              isCallingPressed ? "scale-95 bg-muted" : "bg-transparent hover:bg-accent active:scale-95"
            }`}
            asChild
          >
            <a href={`tel:${workshop.phone}`} onClick={handleCall}>
              <Phone className="mr-1.5 h-3.5 w-3.5 sm:mr-2" />
              <span className="text-xs sm:text-sm">Llamar</span>
            </a>
          </Button>
          <Button size="sm" className="min-h-[44px] flex-1 hover:opacity-90 active:scale-95" asChild>
            <Link href={`/marketplace/${workshop.id}`}>
              <span className="text-xs sm:text-sm">Ver Detalle</span>
              <ChevronRight className="ml-1.5 h-3.5 w-3.5 sm:ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
