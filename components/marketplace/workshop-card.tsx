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
      <div className="space-y-2 p-2 sm:space-y-3 sm:p-3">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-1.5">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-xs font-bold text-foreground sm:text-sm">{workshop.name}</h3>
              <div className="mt-0.5 flex flex-wrap items-center gap-1 sm:gap-1.5">
                <RatingStars rating={workshop.rating} size="sm" showValue />
                <span className="text-xs text-muted-foreground">({workshop.reviewCount})</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-sm font-bold text-primary sm:text-base">{workshop.distance} km</div>
              <span className={workshop.isOpen ? "text-xs font-medium text-success" : "text-xs text-muted-foreground"}>
                {workshop.isOpen ? "Abierto" : "Cerrado"}
              </span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground sm:text-xs">
          <MapPin className="mt-0.5 h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
          <span className={isExpanded ? "" : "line-clamp-1"}>{workshop.address}</span>
        </div>

        {/* Specialties */}
        <div className="space-y-1">
          <div className="flex flex-wrap gap-1">
            {(isExpanded ? workshop.specialties : workshop.specialties.slice(0, 2)).map((specialty) => (
              <SpecialtyTag key={specialty} label={specialty} size="sm" />
            ))}
            {!isExpanded && workshop.specialties.length > 2 && (
              <span className="flex h-5 items-center px-1.5 text-xs text-muted-foreground">
                +{workshop.specialties.length - 2}
              </span>
            )}
          </div>

          {workshop.specialties.length > 2 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex w-full items-center justify-center gap-0.5 rounded px-1 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 active:bg-primary/20"
            >
              {isExpanded ? (
                <>
                  Ver menos <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  Ver más <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className={`min-h-[36px] flex-1 text-xs transition-all ${
              isCallingPressed ? "scale-95 bg-muted" : "bg-transparent hover:bg-accent active:scale-95"
            }`}
            asChild
          >
            <a href={`tel:${workshop.phone}`} onClick={handleCall}>
              <Phone className="mr-1 h-3 w-3 sm:mr-1.5" />
              <span>Llamar</span>
            </a>
          </Button>
          <Button size="sm" className="min-h-[36px] flex-1 text-xs hover:opacity-90 active:scale-95" asChild>
            <Link href={`/portal/buscar-talleres`}>
              <span>Detalle</span>
              <ChevronRight className="ml-1 h-3 w-3 sm:ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
