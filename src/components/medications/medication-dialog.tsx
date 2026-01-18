"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { cn, getDefaultImageForName } from "@/lib/utils";
import type { Medication } from "@/lib/types";
import { useInventory } from "@/context/inventory-context";
import { CategoryDialog } from "../management/CategoryDialog";
import { SupplierDialog } from "../suppliers/SupplierDialog";
// Importar los diálogos completos
import { useZodForm } from "@/hooks/use-zod-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MedicationCreateSchema, MedicationUpdateSchema } from "@/lib/schemas";

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
  const { categories, suppliers } = useInventory();
  const [loading, setLoading] = useState(false);
  const isEditing = !!medication;

  const generateBatch = (name: string) => {
    const prefix =
      (name || "")
        .replace(/[^A-Za-z]/g, "")
        .slice(0, 3)
        .toUpperCase() || "LOT";
    const suffix = Date.now().toString().slice(-5);
    return `${prefix}${suffix}`;
  };

  const form = useZodForm<{
    name: string;
    batch: string;
    expiryDate: Date;
    quantity: number;
    minStock: number;
    supplier: string;
    category: string;
    activeIngredient?: string;
    price: number;
    location: string;
    imageUrl?: string;
  }>(isEditing ? MedicationUpdateSchema : MedicationCreateSchema, {
    defaultValues: {
      name: "",
      batch: "",
      expiryDate: new Date(),
      quantity: 0,
      minStock: 0,
      supplier: "",
      category: "",
      activeIngredient: undefined,
      price: 0,
      location: "",
      imageUrl: "",
    },
  });

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Para forzar re-render

  useEffect(() => {
    if (medication) {
      form.reset({
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
        imageUrl: medication.imageUrl || "",
      });
    } else {
      form.reset({
        name: "",
        batch: generateBatch(""),
        expiryDate: new Date(),
        quantity: 0,
        minStock: 0,
        supplier: "",
        category: "",
        activeIngredient: undefined,
        price: 0,
        location: "",
        imageUrl: "",
      });
    }
  }, [medication, open, form]);

  useEffect(() => {
    const subscription = form.watch((value, { name: changed }) => {
      if (!isEditing && changed === "name") {
        const current = value?.name || "";
        form.setValue("batch", generateBatch(current), {
          shouldValidate: false,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, isEditing]);

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (isEditing && medication) {
        const v = MedicationUpdateSchema.safeParse(values);
        if (!v.success) return;
        onSave({ ...medication, ...v.data });
      } else {
        const v = MedicationCreateSchema.safeParse(values);
        if (!v.success) return;
        onSave(v.data);
      }
    } catch (error) {
      console.error("Error saving medication:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySave = (categoryData: any) => {
    // Forzar re-render para actualizar la lista de categorías
    setRefreshKey((prev) => prev + 1);
  };

  const handleSupplierSave = (supplierData: any) => {
    // Forzar re-render para actualizar la lista de proveedores
    setRefreshKey((prev) => prev + 1);
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
              Requiere categoría y proveedor, cantidades válidas y fecha de
              vencimiento; el lote se autogenera y el precio debe ser mayor o
              igual a 0.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <motion.form
              key={refreshKey}
              onSubmit={form.handleSubmit(handleSubmit)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {Object.keys(form.formState.errors).length > 0 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Corrige los campos marcados:{" "}
                    {Object.values(form.formState.errors)
                      .map((e) => e?.message)
                      .filter(Boolean)
                      .join(" · ")}
                  </AlertDescription>
                </Alert>
              )}
              {Object.keys(form.formState.errors).length > 0 && (
                <div className="p-3 bg-muted rounded-lg text-xs">
                  <p className="font-medium mb-1">Consejos</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Cantidad/Stock mínimo: enteros ≥ 0</li>
                    <li>Precio: usa punto para decimales (ej. 12.50)</li>
                    <li>Fecha de vencimiento: seleccionar en el calendario</li>
                  </ul>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Medicamento *</FormLabel>
                      <FormControl>
                        <Input placeholder="ej. Paracetamol 500mg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nombre comercial completo incluyendo concentración.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Category and Supplier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Categoría *</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      type="button"
                      onClick={() => setCategoryDialogOpen(true)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Nueva
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="border-border bg-background">
                              <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background border-border">
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Clasifica para reportes y análisis
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Proveedor *</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      type="button"
                      onClick={() => setSupplierDialogOpen(true)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Nuevo
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="border-border bg-background">
                              <SelectValue placeholder="Seleccionar proveedor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background border-border">
                            {suppliers.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id}>
                                {supplier.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Proveedor principal del producto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Lote (autogenerado) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="batch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lote *</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormDescription>
                        Se autogenera a partir del nombre
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Quantities and Price */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Stock físico actual (unidades)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Mínimo *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Alerta si stock &lt; este valor
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio Unitario *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        USD, usa punto para decimales
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Vencimiento *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-border bg-background">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => date && field.onChange(date)}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            captionLayout="dropdown"
                            fromYear={new Date().getFullYear()}
                            toYear={new Date().getFullYear() + 10}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Asegura alertas de vencimiento
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Activo y Ubicación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="activeIngredient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Principio Activo (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="ej. Acetaminofén" {...field} />
                      </FormControl>
                      <FormDescription>
                        Para búsquedas y análisis clínico
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación en almacén *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Estante A-3, Caja 12..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Ayuda a la trazabilidad y picking
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Imagen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagen del producto (URL)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Usa una URL segura (https). Opcional.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-center">
                  <img
                    src={
                      form.watch("imageUrl") ||
                      getDefaultImageForName(form.watch("name") || "")
                    }
                    alt="Vista previa"
                    className="w-24 h-24 rounded-md object-cover border border-border/40"
                    onError={(e) => {
                      e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(
                        form.watch("name") || "med",
                      )}/120/120`;
                    }}
                  />
                </div>
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
          </Form>
        </DialogContent>
      </Dialog>

      {/* Diálogos modales para categoría y proveedor */}
      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onSave={handleCategorySave}
      />

      <SupplierDialog
        open={supplierDialogOpen}
        onOpenChange={setSupplierDialogOpen}
        onSave={handleSupplierSave}
      />
    </>
  );
}
