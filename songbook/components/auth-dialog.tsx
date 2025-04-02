"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { LoginForm } from "@/components/login-form"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const handleSuccess = () => {
    // Cerrar el diálogo cuando el inicio de sesión o registro sea exitoso
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <LoginForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}

