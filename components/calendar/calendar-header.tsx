"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CalendarHeader() {
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const getWeekRange = () => {
    const startOfWeek = new Date(currentWeek)
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    const formatDate = (date: Date) => date.toLocaleDateString("es-CL", { day: "numeric", month: "short" })

    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}, ${currentWeek.getFullYear()}`
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek)
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeek(newDate)
  }

  return (
    <div className="border-b border-border bg-background p-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Agendamiento</h1>
          <p className="text-sm text-muted-foreground">Vista semanal de citas</p>
        </div>
        <Link href="/citas/nueva">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nueva Cita</span>
          </Button>
        </Link>
      </div>

      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigateWeek("prev")} className="h-9 w-9">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm font-medium text-foreground">{getWeekRange()}</span>
        <Button variant="ghost" size="icon" onClick={() => navigateWeek("next")} className="h-9 w-9">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
