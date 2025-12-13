"use client"

import { Check, MapPin } from "lucide-react"
import { useBranch } from "@/contexts/branch-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { designTokens } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

export function BranchSelector() {
  const { selectedBranchId, setSelectedBranchId, availableBranches, isGlobalView } = useBranch()

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <MapPin className={cn(designTokens.icon.sm, "text-primary shrink-0")} />
      <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
        <SelectTrigger className={cn(designTokens.input.base, "w-[140px] sm:w-[180px]")}>
          <SelectValue placeholder="Selecciona sucursal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <span className={designTokens.typography.body}>Todas las Sucursales</span>
              {isGlobalView && <Check className={cn(designTokens.icon.xs, "text-primary")} />}
            </div>
          </SelectItem>
          {availableBranches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className={designTokens.typography.body}>{branch.name}</p>
                  <p className={cn(designTokens.typography.bodyMd, "text-muted-foreground")}>{branch.code}</p>
                </div>
                {selectedBranchId === branch.id && <Check className={cn(designTokens.icon.xs, "text-primary")} />}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
