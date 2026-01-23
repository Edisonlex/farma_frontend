"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CartItem, Customer, useSales } from "@/context/sales-context";
import { ProductSearch } from "./register/product-search";
import { ShoppingCarta } from "./register/shopping-cart";
import { CustomerDialog } from "./register/customer-dialog";
import { CheckoutDialog } from "./register/checkout-dialog";
import { useBusiness } from "@/context/business-context";
import { ClientDialog } from "@/components/clients/client-dialog";
import { useInventory } from "@/context/inventory-context";



export function SalesRegister() {
  const { toast } = useToast();
  const { addSale } = useSales();
  const { addMovement } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({});
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [showCreateClientDialog, setShowCreateClientDialog] = useState(false);
  const { businessInfo } = useBusiness();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalDiscount = cart.reduce(
    (sum, item) => sum + (item.discount || 0) * item.quantity,
    0
  );
  const tax = (subtotal - totalDiscount) * 0.15;
  const total = subtotal - totalDiscount + tax;

  useEffect(() => {
    const timer = setInterval(() => {
      setCart((prev) => prev.filter((item) => !item.ephemeral || item.ephemeral.expiresAt > new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Actualiza la función processSale para usar la información de la empresa
  const processSale = () => {
    if (cart.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos al carrito antes de procesar la venta",
        variant: "destructive",
      });
      return;
    }

    const saleData = {
      customer,
      items: [...cart],
      subtotal,
      discount: totalDiscount,
      tax,
      total,
      paymentMethod,
      cashier: "Usuario Actual",
    };

    // Intentar registrar la venta
    const saleId = addSale(saleData);

    // Si addSale retorna undefined/null, es que falló la validación. No limpiamos el carrito.
    if (!saleId) {
      return;
    }

    // Si tuvo éxito, registramos los movimientos de inventario y limpiamos
    cart.forEach((item) => {
      addMovement("salida", item.id, item.quantity, "Venta punto de venta");
    });

    setCart([]);
    setCustomer({});
    setShowCheckoutDialog(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 pb-24 sm:pb-0">
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
        onShowCustomerDialog={() => setShowCheckoutDialog(true)}
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
        setCustomer={setCustomer}
        onProcessSale={processSale}
        onAddNewCustomer={() => {
          setShowCreateClientDialog(true);
        }}
      />

      <ClientDialog
        open={showCreateClientDialog}
        onOpenChange={(open) => setShowCreateClientDialog(open)}
        onSave={(clientData: any) => {
          try {
            const stored = localStorage.getItem("pharmacy-clients");
            const list = stored ? JSON.parse(stored) : [];
            const newClient = {
              id: Date.now().toString(),
              ...clientData,
              createdAt: new Date(),
              lastPurchase: null,
              totalPurchases: 0,
              totalAmount: 0,
            };
            const updated = [...list, newClient];
            localStorage.setItem("pharmacy-clients", JSON.stringify(updated));
            setCustomer({
              name: newClient.name,
              document: newClient.document,
              email: newClient.email,
              address: newClient.address,
            });
            setShowCreateClientDialog(false);
            toast({ title: "Cliente creado", description: "Se agregó el cliente" });
          } catch {
            toast({
              title: "Error",
              description: "No se pudo guardar el cliente",
              variant: "destructive",
            });
          }
        }}
      />
    </div>
  );
}
