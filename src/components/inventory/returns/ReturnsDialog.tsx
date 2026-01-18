"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInventory } from "@/context/inventory-context";
import {
  SupplierReturnSchema,
  createSupplierReturnSchema,
  CustomerReturnSchema,
} from "@/lib/schemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  RefreshCw,
  Package,
  AlertTriangle,
  FileText,
  Truck,
  User,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { getDefaultImageForName } from "@/lib/utils";
import Image from "next/image";

interface ReturnsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReturnsDialog({ open, onOpenChange }: ReturnsDialogProps) {
  const { medications, addMovement, processSupplierReturns } = useInventory();
  const [activeTab, setActiveTab] = useState("supplier");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <RefreshCw className="h-6 w-6 text-primary" />
            Gestión de Devoluciones
          </DialogTitle>
          <DialogDescription>
            Registra devoluciones a proveedores o de clientes.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="supplier" className="gap-2">
              <Truck className="h-4 w-4" />
              A Proveedor
            </TabsTrigger>
            <TabsTrigger value="customer" className="gap-2">
              <User className="h-4 w-4" />
              De Cliente
            </TabsTrigger>
          </TabsList>

          <TabsContent value="supplier" className="space-y-4 py-4">
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-amber-600 border-amber-200 hover:bg-amber-50"
                onClick={() => {
                  if (
                    confirm(
                      "¿Procesar automáticamente devoluciones para todos los productos vencidos?"
                    )
                  ) {
                    processSupplierReturns();
                    onOpenChange(false);
                  }
                }}
              >
                <AlertTriangle className="h-4 w-4" />
                Procesar Vencidos (Automático)
              </Button>
            </div>
            <SupplierReturnForm
              medications={medications}
              onSuccess={() => onOpenChange(false)}
              addMovement={addMovement}
            />
          </TabsContent>

          <TabsContent value="customer" className="py-4">
            <CustomerReturnForm
              medications={medications}
              onSuccess={() => onOpenChange(false)}
              addMovement={addMovement}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function SupplierReturnForm({
  medications,
  onSuccess,
  addMovement,
}: {
  medications: any[];
  onSuccess: () => void;
  addMovement: any;
}) {
  const form = useForm({
    resolver: async (data, context, options) => {
      const selectedMed = medications.find(
        (m) => m.id.toString() === data.medicationId
      );
      const available = selectedMed ? selectedMed.quantity : 0;
      return zodResolver(createSupplierReturnSchema(available))(
        data,
        context,
        options
      );
    },
    defaultValues: {
      medicationId: "",
      type: undefined,
      quantity: 1,
      reason: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  const onSubmit = (data: any) => {
    try {
      const med = medications.find((m) => m.id.toString() === data.medicationId);
      const typeLabel = {
        expired: "Producto Vencido",
        defective: "Producto Defectuoso",
        error: "Error en Pedido",
        recall: "Retiro del Mercado (Recall)",
      }[data.type as string];

      addMovement(
        "salida",
        data.medicationId,
        Number(data.quantity),
        `Devolución a Proveedor: ${typeLabel}. ${data.reason || ""}`
      );
      toast.success("Devolución registrada correctamente");
      onSuccess();
    } catch (error) {
      toast.error("Error al registrar la devolución");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="medicationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medicamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-background border-border">
                  {medications.map((med) => (
                    <SelectItem key={med.id} value={med.id.toString()}>
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                          <Image
                            src={med.imageUrl || getDefaultImageForName(med.name)}
                            alt={med.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = getDefaultImageForName(med.name);
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
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivo de Devolución</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar motivo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="expired">Producto Vencido</SelectItem>
                    <SelectItem value="defective">Producto Defectuoso</SelectItem>
                    <SelectItem value="error">Error en Pedido</SelectItem>
                    <SelectItem value="recall">Retiro del Mercado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad a Devolver</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas Adicionales</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalles adicionales sobre la devolución..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Registrar Devolución
          </Button>
        </div>
      </form>
    </Form>
  );
}

function CustomerReturnForm({
  medications,
  onSuccess,
  addMovement,
}: {
  medications: any[];
  onSuccess: () => void;
  addMovement: any;
}) {
  const form = useForm({
    resolver: zodResolver(CustomerReturnSchema),
    defaultValues: {
      medicationId: "",
      quantity: 1,
      invoice: "",
      condition: false,
      reason: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  const onSubmit = (data: any) => {
    try {
      addMovement(
        "entrada",
        data.medicationId,
        Number(data.quantity),
        `Devolución de Cliente. Factura: ${data.invoice}. ${data.reason || ""}`
      );
      toast.success("Devolución de cliente registrada");
      onSuccess();
    } catch (error) {
      toast.error("Error al registrar la devolución");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-800 mb-4">
          <p className="font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Política de Devoluciones
          </p>
          <ul className="list-disc list-inside mt-1 ml-1 space-y-1 text-xs">
            <li>Solo productos no abiertos y con factura.</li>
            <li>No se aceptan devoluciones de medicamentos controlados.</li>
            <li>Máximo 7 días después de la compra.</li>
          </ul>
        </div>

        <FormField
          control={form.control}
          name="medicationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medicamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-background border-border">
                  {medications.map((med) => (
                    <SelectItem key={med.id} value={med.id.toString()}>
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                          <Image
                            src={med.imageUrl || getDefaultImageForName(med.name)}
                            alt={med.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = getDefaultImageForName(med.name);
                            }}
                          />
                        </div>
                        <span>{med.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="invoice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Factura</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 001-001-123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad Recibida</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Condición del Producto
                </FormLabel>
                <FormDescription>
                  Certifico que el producto está sellado, intacto y en condiciones de reventa.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo / Observaciones</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Razón de la devolución..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Aceptar Devolución
          </Button>
        </div>
      </form>
    </Form>
  );
}
