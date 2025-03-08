"use client"

import { AlertCircle, CheckCircle, Info, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
}

interface InfoModalProps extends ModalProps {
  onConfirm: () => void
}

export function SuccessModal({ isOpen, onClose, message }: ModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="flex flex-row items-center gap-4">
          <div className="bg-green-100 p-2 rounded-full">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <AlertDialogTitle>Operación Exitosa</AlertDialogTitle>
            <AlertDialogDescription>{message}</AlertDialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-2 top-2">
            <X className="h-4 w-4" />
          </Button>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Aceptar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}



export function InfoModal({ isOpen, onClose, message, onConfirm }: InfoModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="flex flex-row items-center gap-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <AlertDialogTitle>Información</AlertDialogTitle>
            <AlertDialogDescription>{message}</AlertDialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-2 top-2">
            <X className="h-4 w-4" />
          </Button>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function ErrorModal({ isOpen, onClose, message }: ModalProps) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader className="flex flex-row items-center gap-4">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle>Error</AlertDialogTitle>
              <AlertDialogDescription>{message}</AlertDialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-2 top-2">
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Aceptar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  

