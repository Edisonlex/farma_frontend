"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Pill, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useInventory } from "@/context/inventory-context";
import { CartItem } from "@/context/sales-context";
import { useToast } from "@/hooks/use-toast";
import { DollarSign } from "lucide-react";
import { CartItemSchema } from "@/lib/schemas";

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

  const today = new Date();
  const filteredMedications = medications.filter(
    (med) =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      med.expiryDate > today &&
      med.quantity > 0
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
      const newItem = {
        id: String(medication.id),
        name: String(medication.name),
        price: Number(medication.price),
        quantity: 1,
        stock: Number(medication.quantity),
      };
      const v = CartItemSchema.safeParse(newItem);
      if (!v.success) {
        toast({ title: "Error de validación", description: "Producto inválido" });
        return;
      }
      setCart([...cart, v.data]);
    }

    toast({
      title: "✅ Producto agregado",
      description: `${medication.name} agregado al carrito`,
    });
  };

  const showPrice = (medication: any) => {
    const price = Number(medication.price);
    toast({
      title: "Precio",
      description: `${medication.name}: $${price.toFixed(2)}`,
    });
  };

  const addQuote = (medication: any) => {
    const exists = cart.find((item) => item.id === medication.id);
    if (exists) {
      toast({ title: "Ya en carrito", description: `${medication.name}` });
      return;
    }
    const ttlMs = 2 * 60 * 1000;
    const item = {
      id: String(medication.id),
      name: String(medication.name),
      price: Number(medication.price),
      quantity: 1,
      stock: Number(medication.quantity),
      ephemeral: { expiresAt: new Date(Date.now() + ttlMs) },
    };
    const v = CartItemSchema.safeParse(item);
    if (!v.success) {
      toast({ title: "Error de validación", description: "Producto inválido" });
      return;
    }
    setCart([...cart, item]);
    toast({ title: "Cotización agregada", description: `Expira en 2 minutos` });
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
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filteredMedications.length > 0) {
                addToCart(filteredMedications[0]);
              }
              if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p" && filteredMedications.length > 0) {
                showPrice(filteredMedications[0]);
              }
            }}
            className="pl-10 border-border/50 focus:border-primary/50"
          />
        </div>

        <div className="max-h-96 overflow-y-auto space-y-3">
          {filteredMedications.map((medication) => (
            <motion.div
              key={medication.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 border border-border rounded-xl bg-card hover:bg-accent/50 transition-all shadow-sm group"
            >
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <img src={medication.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(medication.name)}/64/64`} alt={medication.name} className="w-10 h-10 rounded-md object-cover" />
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {medication.name}
                    </h4>
                    
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
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => showPrice(medication)}
                  className="shrink-0"
                >
                  <DollarSign className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => addQuote(medication)}
                  className="shrink-0"
                >
                  <Clock className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => addToCart(medication)}
                  disabled={medication.quantity === 0}
                  className="shrink-0 bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
