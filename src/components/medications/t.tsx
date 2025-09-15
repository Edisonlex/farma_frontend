// components/medications/medication-dialog.tsx (corregido)
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Medication } from ".";
import { useInventory } from "@/context/inventory-context";


interface MedicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medication?: Medication | null;
  onSave: (medication: Medication | Omit<Medication, "id">) => void;
}

export function MedicationDialog({
  open,
  onOpenChange,
  medication,
  onSave,
}: MedicationDialogProps) {
  const { categories, suppliers, addCategory, addSupplier } = useInventory();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    batch: "",
    expiryDate: new Date(),
    quantity: 0,
    minStock: 0,
    supplier: "",
    category: "",
    activeIngredient: "",
    price: 0,
    location: "",
  });

  const [newCategory, setNewCategory] = useState("");
  const [newSupplier, setNewSupplier] = useState("");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);

  const isEditing = !!medication;

  useEffect(() => {
    if (medication) {
      setFormData({
        name: medication.name,
        batch: medication.batch,
        expiryDate: medication.expiryDate,
        quantity: medication.quantity,
        minStock: medication.minStock,
        supplier: medication.supplier,
        category: medication.category,
        activeIngredient: medication.activeIngredient,
        price: medication.price,
        location: medication.location,
      });
    } else {
      setFormData({
        name: "",
        batch: "",
        expiryDate: new Date(),
        quantity: 0,
        minStock: 0,
        supplier: "",
        category: "",
        activeIngredient: "",
        price: 0,
        location: "",
      });
    }
  }, [medication, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (isEditing && medication) {
        const updatedData: Partial<Medication> = {
          name: formData.name,
          batch: formData.batch,
          expiryDate: formData.expiryDate,
          quantity: formData.quantity,
          minStock: formData.minStock,
          supplier: formData.supplier,
          category: formData.category,
          activeIngredient: formData.activeIngredient,
          price: formData.price,
          location: formData.location,
        };

        onSave({
          ...medication,
          ...updatedData,
        });
      } else {
        onSave(formData);
      }
    } catch (error) {
      console.error("Error saving medication:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory({ name: newCategory.trim() });
      setFormData((prev) => ({ ...prev, category: newCategory.trim() }));
      setNewCategory("");
      setCategoryDialogOpen(false);
    }
  };

  const handleAddSupplier = () => {
    if (newSupplier.trim()) {
      addSupplier({ name: newSupplier.trim() });
      setFormData((prev) => ({ ...prev, supplier: newSupplier.trim() }));
      setNewSupplier("");
      setSupplierDialogOpen(false);
    }
  };

  return (
    <>
      {/* Diálogo principal de medicamento */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Medicamento" : "Agregar Nuevo Medicamento"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifica la información del medicamento seleccionado."
                : "Completa la información para agregar un nuevo medicamento al inventario."}
            </DialogDescription>
          </DialogHeader>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Medicamento *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="ej. Paracetamol 500mg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activeIngredient">Principio Activo *</Label>
                <Input
                  id="activeIngredient"
                  value={formData.activeIngredient}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      activeIngredient: e.target.value,
                    }))
                  }
                  placeholder="ej. Paracetamol"
                  required
                />
              </div>
            </div>

            {/* Category and Supplier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Categoría *</Label>
                  <Dialog
                    open={categoryDialogOpen}
                    onOpenChange={setCategoryDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <Plus className="w-3 h-3 mr-1" />
                        Nueva
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nueva Categoría</DialogTitle>
                        <DialogDescription>
                          Agrega una nueva categoría al sistema
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex space-x-2">
                        <Input
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Nombre de la categoría"
                        />
                        <Button onClick={handleAddCategory}>Agregar</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="border-border bg-background">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Proveedor *</Label>
                  <Dialog
                    open={supplierDialogOpen}
                    onOpenChange={setSupplierDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <Plus className="w-3 h-3 mr-1" />
                        Nuevo
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nuevo Proveedor</DialogTitle>
                        <DialogDescription>
                          Agrega un nuevo proveedor al sistema
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex space-x-2">
                        <Input
                          value={newSupplier}
                          onChange={(e) => setNewSupplier(e.target.value)}
                          placeholder="Nombre del proveedor"
                        />
                        <Button onClick={handleAddSupplier}>Agregar</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Select
                  value={formData.supplier}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, supplier: value }))
                  }
                >
                  <SelectTrigger className="border-border bg-background">
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Batch and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch">Lote *</Label>
                <Input
                  id="batch"
                  value={formData.batch}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, batch: e.target.value }))
                  }
                  placeholder="ej. PAR001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="ej. A1-B2"
                />
              </div>
            </div>

            {/* Quantities and Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      quantity: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minStock">Stock Mínimo *</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      minStock: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio Unitario *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  required
                />
              </div>
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label>Fecha de Vencimiento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? (
                      format(formData.expiryDate, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-border bg-background">
                  <Calendar
                    mode="single"
                    selected={formData.expiryDate}
                    onSelect={(date) =>
                      date &&
                      setFormData((prev) => ({ ...prev, expiryDate: date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : isEditing ? (
                  "Actualizar"
                ) : (
                  "Agregar"
                )}
              </Button>
            </div>
          </motion.form>
        </DialogContent>
      </Dialog>
    </>
  );
}
