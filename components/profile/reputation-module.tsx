"use client"

import { Card } from "@/components/ui/card"
import { RatingStars } from "@/components/shared/rating-stars"
import { Star, TrendingUp } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Review {
  id: string
  patente: string
  rating: number
  comment: string
  date: string
}

interface ReputationModuleProps {
  averageRating: number
  totalReviews: number
  recentReviews: Review[]
}

export function ReputationModule({ averageRating, totalReviews, recentReviews }: ReputationModuleProps) {
  const mockReviews: Review[] = [
    {
      id: "1",
      patente: "BCXY12",
      rating: 5,
      comment: "Excelente servicio, muy profesionales y rápidos.",
      date: "hace 2 días",
    },
    {
      id: "2",
      patente: "ZZWW88",
      rating: 4.5,
      comment: "Buen trabajo en la suspensión, precios justos.",
      date: "hace 5 días",
    },
    {
      id: "3",
      patente: "KLMN34",
      rating: 5,
      comment: "Resolvieron un problema eléctrico complejo sin problemas.",
      date: "hace 1 semana",
    },
    {
      id: "4",
      patente: "PQRS56",
      rating: 4,
      comment: "Bien, aunque tuve que esperar un poco más de lo esperado.",
      date: "hace 1 semana",
    },
    {
      id: "5",
      patente: "TUVW78",
      rating: 5,
      comment: "Siempre vuelvo aquí, confío plenamente en su trabajo.",
      date: "hace 2 semanas",
    },
  ]

  const displayReviews = recentReviews.length > 0 ? recentReviews : mockReviews

  return (
    <Card className="p-3 sm:p-4">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Reputación</h3>
          <Star className="h-4 w-4 shrink-0 text-warning" />
        </div>

        <div className="space-y-2 rounded-lg bg-muted/50 p-3 sm:p-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground sm:text-3xl">{averageRating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground sm:text-sm">/ 5.0</span>
          </div>
          <RatingStars rating={averageRating} size="md" />
          <p className="text-xs text-muted-foreground">{totalReviews} reseñas totales</p>
          <div className="flex items-center gap-1 text-xs text-success">
            <TrendingUp className="h-3 w-3" />
            <span>+15% este mes</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">Últimas Reseñas</h4>
          <ScrollArea className="h-[280px] pr-2 sm:pr-3">
            <div className="space-y-2 sm:space-y-3">
              {displayReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border border-border bg-card p-2.5 sm:p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-primary/20 px-1.5 py-0.5 text-xs font-mono font-semibold text-primary">
                          {review.patente}
                        </span>
                        <RatingStars rating={review.rating} size="sm" />
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">{review.comment}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground/70">{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  )
}
