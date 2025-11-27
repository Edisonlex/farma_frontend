"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Pill } from "lucide-react";
import { motion } from "framer-motion";
import { useInventory } from "@/context/inventory-context";
import { CartItem } from "@/context/sales-context";
import { useToast } from "@/hooks/use-toast";

interface ProductSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
}

export function ProductSearch({
  searchTerm,
  setSearchTerm,
  cart,
  setCart,
}: ProductSearchProps) {
  const { toast } = useToast();
  const { medications } = useInventory();

  const filteredMedications = medications.filter(
    (med) =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (medication: any) => {
    const existingItem = cart.find((item) => item.id === medication.id);

    if (existingItem) {
      if (existingItem.quantity >= medication.quantity) {
        toast({
          title: "Stock insuficiente",
          description: `Solo hay ${medication.quantity} unidades disponibles`,
          variant: "destructive",
        });
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === medication.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: medication.id,
          name: medication.name,
          price: medication.price,
          quantity: 1,
          stock: medication.quantity,
        },
      ]);
    }

    toast({
      title: "✅ Producto agregado",
      description: `${medication.name} agregado al carrito`,
    });
  };

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Buscar Medicamentos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o principio activo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-border/50 focus:border-primary/50"
          />
        </div>

        <div className="max-h-96 overflow-y-auto space-y-3">
          {filteredMedications.map((medication) => (
            <motion.div
              key={medication.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 border border-border/30 rounded-xl bg-background/50 hover:bg-accent/5 transition-colors group"
            >
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/5 mt-0.5">
                    <Pill className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {medication.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {medication.activeIngredient}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="ghost" className="font-medium">
                        ${medication.price.toFixed(2)}
                      </Badge>
                      <Badge
                        variant={
                          medication.quantity > 10 ? "secondary" : "destructive"
                        }
                        className="font-medium"
                      >
                        Stock: {medication.quantity}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => addToCart(medication)}
                disabled={medication.quantity === 0}
                className="shrink-0 bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
