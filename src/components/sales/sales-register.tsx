"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CartItem, Customer, useSales } from "@/context/sales-context";
import { ProductSearch } from "./register/product-search";
import { ShoppingCarta } from "./register/shopping-cart";
import { CustomerDialog } from "./register/customer-dialog";
import { CheckoutDialog } from "./register/checkout-dialog";


export function SalesRegister() {
  const { toast } = useToast();
  const { addSale } = useSales();
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({});
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalDiscount = cart.reduce(
    (sum, item) => sum + (item.discount || 0) * item.quantity,
    0
  );
  const tax = (subtotal - totalDiscount) * 0.18;
  const total = subtotal - totalDiscount + tax;

  const processSale = () => {
    if (cart.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos al carrito antes de procesar la venta",
        variant: "destructive",
      });
      return;
    }

    addSale({
      customer,
      items: [...cart],
      subtotal,
      discount: totalDiscount,
      tax,
      total,
      paymentMethod,
      cashier: "Usuario Actual",
    });

    setCart([]);
    setCustomer({});
    setShowCheckoutDialog(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Product Search */}
      <div className="lg:col-span-2">
        <ProductSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          cart={cart}
          setCart={setCart}
        />
      </div>

      {/* Shopping Cart */}
      <div>
        <ShoppingCarta
          cart={cart}
          setCart={setCart}
          subtotal={subtotal}
          totalDiscount={totalDiscount}
          tax={tax}
          total={total}
          customer={customer}
          onShowCustomerDialog={() => setShowCustomerDialog(true)}
          onShowCheckoutDialog={() => setShowCheckoutDialog(true)}
        />
      </div>

      {/* Dialogs */}
      <CustomerDialog
        open={showCustomerDialog}
        onOpenChange={setShowCustomerDialog}
        customer={customer}
        setCustomer={setCustomer}
      />

      <CheckoutDialog
        open={showCheckoutDialog}
        onOpenChange={setShowCheckoutDialog}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        total={total}
        customer={customer}
        onProcessSale={processSale}
      />
    </div>
  );
}
