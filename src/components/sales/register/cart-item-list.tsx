"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CartItem } from "@/context/sales-context";
import { useToast } from "@/hooks/use-toast";

interface CartItemListProps {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
}

export function CartItemList({ cart, setCart }: CartItemListProps) {
  const { toast } = useToast();

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    const item = cart.find((item) => item.id === id);
    if (item && newQuantity > item.stock) {
      toast({
        title: "Stock insuficiente",
        description: `Solo hay ${item.stock} unidades disponibles`,
        variant: "destructive",
      });
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido removido del carrito",
    });
  };

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      <AnimatePresence mode="popLayout">
        {cart.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 p-3 border border-border/30 rounded-lg bg-background/50"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">
                {item.name}
              </p>
              {item.ephemeral && (
                <Badge variant="secondary" className="mt-1 text-xs">Cotización</Badge>
              )}
              <p className="text-xs text-muted-foreground">
                ${item.price.toFixed(2)} c/u
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="h-8 w-8 p-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-8 text-center text-sm font-medium text-foreground">
                {item.quantity}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFromCart(item.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
