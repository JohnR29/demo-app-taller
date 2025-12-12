"use client"

import { useState } from "react"
import { Search, Camera, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function FloatingSearch() {
  const [query, setQuery] = useState("")
  const [isScanning, setIsScanning] = useState(false)

  const handleScan = () => {
    setIsScanning(true)
    // Simulate scan
    setTimeout(() => {
      setQuery("ABC-1234")
      setIsScanning(false)
    }, 1500)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por patente, cliente o OT..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 bg-secondary pl-10 pr-10 text-base placeholder:text-muted-foreground"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          size="icon"
          variant="secondary"
          className="h-12 w-12 shrink-0"
          onClick={handleScan}
          disabled={isScanning}
        >
          <Camera className={cn("h-5 w-5", isScanning && "animate-pulse")} />
        </Button>
      </div>
      {isScanning && (
        <div className="absolute inset-x-0 top-full z-10 mt-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-center text-sm text-primary">
          Escaneando...
        </div>
      )}
    </div>
  )
}
