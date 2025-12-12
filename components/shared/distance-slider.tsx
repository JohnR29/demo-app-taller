"use client"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface DistanceSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

export function DistanceSlider({ value, onChange, min = 1, max = 50, step = 1 }: DistanceSliderProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-foreground">Radio</Label>
        <span className="text-xs font-semibold text-primary">{value} km</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  )
}
