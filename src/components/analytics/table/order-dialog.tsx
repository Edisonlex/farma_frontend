"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PredictionData } from "@/lib/analytics-data";

interface OrderDialogProps {
  medication: PredictionData | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const providers = [
  { id: "provider1", name: "Farmacéutica Principal S.A." },
  { id: "provider2", name: "MediSupply Internacional" },
  { id: "provider3", name: "HealthCorp Distribución" },
  { id: "provider4", name: "BioFarma Suministros" },
];

export function OrderDialog({
  medication,
  isOpen,
  onOpenChange,
}: OrderDialogProps) {
  const [quantity, setQuantity] = useState(0);
  const [provider, setProvider] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  if (!medication) return null;

  const handleConfirmOrder = () => {
    if (quantity <= 0 || !provider) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Orden creada",
      description: `Orden de ${quantity} unidades de ${medication.medicationName} creada exitosamente.`,
    });

    onOpenChange(false);
  };

  const selectedProviderName =
    providers.find((p) => p.id === provider)?.name || "";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-accent" />
            </div>
            Crear Orden de Compra
          </DialogTitle>
          <DialogDescription>
            Complete los detalles para la orden de {medication.medicationName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Medicamento</Label>
            <div className="p-3 bg-muted rounded-lg font-medium">
              {medication.medicationName}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad a Ordenar</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                max="1000"
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label>Cantidad Recomendada</Label>
              <div className="p-3 bg-muted rounded-lg text-lg font-semibold">
                {medication.recommendedOrder}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">Proveedor</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar proveedor" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas adicionales</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agregue notas adicionales para esta orden..."
              rows={3}
            />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Resumen de la orden:</h4>
            <div className="text-sm space-y-1">
              <p>
                <strong>Medicamento:</strong> {medication.medicationName}
              </p>
              <p>
                <strong>Cantidad:</strong> {quantity} unidades
              </p>
              <p>
                <strong>Proveedor:</strong> {selectedProviderName}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <Badge variant="ghost">Pendiente</Badge>
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmOrder}>Confirmar Orden</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
