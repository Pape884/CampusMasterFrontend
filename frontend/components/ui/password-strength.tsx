"use client"

import { cn } from "@/lib/utils"

interface PasswordStrengthIndicatorProps {
  strength: number // 0-5
}

export function PasswordStrengthIndicator({ strength }: PasswordStrengthIndicatorProps) {
  const getStrengthLabel = (strength: number): string => {
    if (strength <= 1) return "Très faible"
    if (strength === 2) return "Faible"
    if (strength === 3) return "Moyen"
    if (strength === 4) return "Fort"
    return "Très fort"
  }

  const getStrengthColor = (strength: number): string => {
    if (strength <= 1) return "bg-red-500"
    if (strength === 2) return "bg-orange-500"
    if (strength === 3) return "bg-yellow-500"
    if (strength === 4) return "bg-green-500"
    return "bg-green-600"
  }

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-2 flex-1 rounded-full transition-all",
              index < strength 
                ? getStrengthColor(strength) 
                : "bg-gray-200"
            )}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{getStrengthLabel(strength)}</span>
        <span>{strength}/5</span>
      </div>
    </div>
  )
}