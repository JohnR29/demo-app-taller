"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const filters = [
  { id: "todas", label: "Todas" },
  { id: "en-progreso", label: "En Progreso" },
  { id: "pendiente", label: "Pendientes" },
  { id: "completada", label: "Completadas" },
]

export function OrdersFilter() {
  const [activeFilter, setActiveFilter] = useState("todas")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por patente, cliente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-secondary pl-9"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "shrink-0 rounded-full",
              activeFilter === filter.id
                ? "bg-primary/20 text-primary hover:bg-primary/30"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
