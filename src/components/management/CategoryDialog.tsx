// components/management/category/CategoryDialog.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useInventory } from "@/context/inventory-context";
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
import { CategoryCreateSchema, CategorySchema } from "@/lib/schemas";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: any;
  onSave: (categoryData: any) => void;
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSave,
}: CategoryDialogProps) {
  const [loading, setLoading] = useState(false);
  const { addCategory, updateCategory } = useInventory();
  const isEditing = !!category;
  const form = useZodForm<{ name: string; description?: string }>(
    isEditing ? CategorySchema.partial() : CategoryCreateSchema,
    {
      mode: "onChange",
      defaultValues: {
        name: "",
        description: "",
      },
    }
  );

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || "",
      });
    } else {
      form.reset({ name: "", description: "" });
    }
  }, [category, open, form]);

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (category) {
        updateCategory(category.id, values);
      } else {
        addCategory(values);
      }
      onSave(values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? "Editar Categoría" : "Nueva Categoría"}
          </DialogTitle>
          <DialogDescription>
            El nombre debe ser único y descriptivo. La descripción es opcional y
            se usa para análisis y filtros.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <li>Nombre único y descriptivo</li>
                  <li>Descripción: máximo 500 caracteres</li>
                </ul>
              </div>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la categoría" {...field} />
                  </FormControl>
                  <FormDescription>Nombre único y claro</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción de la categoría..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Detalles adicionales sobre el tipo de productos (máx. 500 caracteres).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {category ? "Actualizar" : "Crear"} Categoría
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
