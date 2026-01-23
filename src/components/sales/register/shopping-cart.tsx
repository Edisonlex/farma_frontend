"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Trash2, User, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import { CartItem, Customer } from "@/context/sales-context";
import { CartItemList } from "./cart-item-list";
import { useToast } from "@/hooks/use-toast";

interface ShoppingCartProps {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  subtotal: number;
  totalDiscount: number;
  tax: number;
  total: number;
  customer: Customer;
  onShowCustomerDialog: () => void;
  onShowCheckoutDialog: () => void;
}

export function ShoppingCarta({
  cart,
  setCart,
  subtotal,
  totalDiscount,
  tax,
  total,
  customer,
  onShowCustomerDialog,
  onShowCheckoutDialog,
}: ShoppingCartProps) {
  const { toast } = useToast();

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Carrito vaciado",
      description: "Todos los productos han sido removidos",
    });
  };

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm lg:sticky lg:top-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-5/10">
              <ShoppingCart className="w-5 h-5 text-chart-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                Carrito de Compras
              </CardTitle>
              <CardDescription>
                {cart.length} producto{cart.length !== 1 ? "s" : ""} agregado
                {cart.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
          </div>
          {cart.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-muted-foreground"
          >
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>El carrito está vacío</p>
            <p className="text-sm">Agrega productos para continuar</p>
          </motion.div>
        ) : (
          <>
            <CartItemList cart={cart} setCart={setCart} />

            <Separator className="bg-border/30" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-foreground">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-chart-5">
                  <span>Descuento:</span>
                  <span>-${totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-foreground">
                <span>IVA (15%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator className="bg-border/30" />
              <div className="flex justify-between font-bold text-lg text-foreground">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={onShowCustomerDialog}
                  >
                    <User className="w-4 h-4 mr-2" />
                    {customer.name ? customer.name : "Agregar Cliente"}
                  </Button>
                </DialogTrigger>

                <DialogTrigger asChild>
                  <Button
                    className="w-full bg-chart-5 hover:bg-chart-5/90 h-12 text-lg font-semibold"
                    onClick={onShowCheckoutDialog}
                  >
                    <Receipt className="w-5 h-5 mr-2" />
                    Procesar Venta
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            {/* Barra de acciones fija en móviles */}
            {cart.length > 0 && (
              <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden p-3 bg-background/95 border-t shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <div className="font-semibold text-foreground">Total</div>
                    <div className="text-muted-foreground">${total.toFixed(2)}</div>
                  </div>
                  <Button
                    className="flex-1 h-12 bg-chart-5 hover:bg-chart-5/90 text-base font-semibold"
                    onClick={onShowCheckoutDialog}
                  >
                    <Receipt className="w-5 h-5 mr-2" />
                    Procesar Venta
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
