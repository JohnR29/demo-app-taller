"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const categories = [
  { id: "todos", label: "Todos" },
  { id: "aceites", label: "Aceites" },
  { id: "filtros", label: "Filtros" },
  { id: "frenos", label: "Frenos" },
  { id: "electricos", label: "Eléctricos" },
]

export function InventoryFilter() {
  const [activeCategory, setActiveCategory] = useState("todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [showLowStock, setShowLowStock] = useState(false)

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por SKU o nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-secondary pl-9"
          />
        </div>
        <Button
          variant={showLowStock ? "default" : "outline"}
          size="icon"
          onClick={() => setShowLowStock(!showLowStock)}
          className={cn(!showLowStock && "bg-transparent")}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {showLowStock && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2 text-center text-sm text-destructive">
          Mostrando solo productos con stock bajo
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "shrink-0 rounded-full",
              activeCategory === category.id
                ? "bg-primary/20 text-primary hover:bg-primary/30"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
