"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface ConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmationText: string
  onConfirm: () => Promise<void>
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmationText,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)

  const isConfirmed = value === confirmationText

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
      setValue("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description}
            <br />
            <br />
            Tapez <strong>{confirmationText}</strong> pour confirmer.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input
          placeholder={confirmationText}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={!isConfirmed || loading}
            onClick={handleConfirm}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            Supprimer définitivement
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
