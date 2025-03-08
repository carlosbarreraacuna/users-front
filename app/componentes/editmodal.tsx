"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: any;
  onSave: (persona: any) => void;
}

export function EditModal({ isOpen, onClose, persona, onSave }: EditModalProps) {
  const [formData, setFormData] = useState(persona);

  useEffect(() => {
    setFormData(persona);
  }, [persona]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Persona</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label>Nombres</Label>
            <Input name="nombres" value={formData.nombres} onChange={handleChange} />
          </div>
          <div>
            <Label>Apellidos</Label>
            <Input name="apellidos" value={formData.apellidos} onChange={handleChange} />
          </div>
          <div>
            <Label>Correo</Label>
            <Input name="correo" value={formData.correo} onChange={handleChange} />
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input name="telefono" value={formData.telefono} onChange={handleChange} />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
