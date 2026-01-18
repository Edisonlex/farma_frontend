import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdjustStockFormSchema } from "@/lib/schemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings,
  Plus,
  Minus,
  Package,
  AlertTriangle,
  Hash,
  FileText,
  Calculator,
  Info,
  CheckCircle,
} from "lucide-react";
import { cn, getDefaultImageForName } from "@/lib/utils";
import { useInventory } from "@/context/inventory-context";
import Image from "next/image";

interface AdjustmentFormProps {
  initialMedicationId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AdjustmentForm({
  initialMedicationId,
  onSuccess,
  onCancel,
}: AdjustmentFormProps) {
  const { medications, adjustStock } = useInventory();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(AdjustStockFormSchema),
    defaultValues: {
      medicationId: initialMedicationId || "",
      type: undefined as unknown as "increase" | "decrease",
      quantity: 0,
      reason: "",
    },
  });

  const selectedMedicationId = form.watch("medicationId");
  const selectedMedication = medications.find(
    (med) => med.id.toString() === selectedMedicationId
  );
  const type = form.watch("type");
  const quantity = form.watch("quantity");

  const calculateNewStock = () => {
    if (!selectedMedication || !quantity) return null;
    const current = selectedMedication.quantity;
    const qty = Number(quantity);
    if (type === "increase") return current + qty;
    if (type === "decrease") return Math.max(0, current - qty);
    return null;
  };

  const newStock = calculateNewStock();

  const onSubmit = async (values: any) => {
    if (
      values.type === "decrease" &&
      selectedMedication &&
      values.quantity > selectedMedication.quantity
    ) {
      form.setError("quantity", {
        type: "manual",
        message: `Stock insuficiente. Disponible: ${selectedMedication.quantity}`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await adjustStock(
        values.medicationId,
        values.type,
        Number(values.quantity),
        values.reason
      );
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border/50 bg-card shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Ajuste de Stock
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Realiza ajustes manuales al inventario de medicamentos
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Medicamento */}
              <FormField
                control={form.control}
                name="medicationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      Medicamento
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Seleccionar medicamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border-border">
                        {medications.map((med) => (
                          <SelectItem
                            key={med.id}
                            value={med.id.toString()}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                                <Image
                                  src={
                                    med.imageUrl ||
                                    getDefaultImageForName(med.name)
                                  }
                                  alt={med.name}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      getDefaultImageForName(med.name);
                                  }}
                                />
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="font-medium">{med.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  Stock: {med.quantity}
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Producto al que se aplicará el ajuste.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de Ajuste */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-primary" />
                      Tipo de Ajuste
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="increase">
                          <div className="flex items-center gap-2 text-green-600">
                            <Plus className="h-4 w-4" />
                            <span>Aumentar Stock (Entrada)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="decrease">
                          <div className="flex items-center gap-2 text-red-600">
                            <Minus className="h-4 w-4" />
                            <span>Disminuir Stock (Salida)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Define si se agregan o quitan unidades.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Cantidad */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary" />
                    Cantidad
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="0"
                        className="h-12 pl-10"
                        {...field}
                      />
                    </FormControl>
                    <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <FormDescription>
                    Número de unidades a ajustar.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Motivo */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Motivo del Ajuste
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: Corrección de inventario físico, caducidad, daño..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Explica por qué se realiza este cambio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resumen y Foto */}
            {selectedMedication && (
              <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border shrink-0">
                  <Image
                    src={
                      selectedMedication.imageUrl ||
                      getDefaultImageForName(selectedMedication.name)
                    }
                    alt={selectedMedication.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = getDefaultImageForName(
                        selectedMedication.name
                      );
                    }}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Resumen del Cambio
                  </h4>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                    <span className="text-muted-foreground">Actual:</span>
                    <span>{selectedMedication.quantity} unidades</span>

                    <span className="text-muted-foreground">Ajuste:</span>
                    <span
                      className={cn(
                        "font-medium",
                        type === "increase" ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {type === "increase" ? "+" : type === "decrease" ? "-" : ""}
                      {quantity || 0}
                    </span>

                    <span className="text-muted-foreground font-medium pt-1 border-t border-border/50">
                      Nuevo Stock:
                    </span>
                    <span
                      className={cn(
                        "font-bold pt-1 border-t border-border/50",
                        newStock !== null &&
                          newStock <= selectedMedication.minStock
                          ? "text-amber-600"
                          : "text-foreground"
                      )}
                    >
                      {newStock ?? "-"}
                      {newStock !== null &&
                        newStock <= selectedMedication.minStock && (
                          <AlertTriangle className="inline h-3 w-3 ml-1" />
                        )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Procesando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Aplicar Ajuste
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
