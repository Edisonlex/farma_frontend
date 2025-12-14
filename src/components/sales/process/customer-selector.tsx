"use client";

import { useState } from "react";
import { Customer } from "@/context/sales-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, User } from "lucide-react";
import { mockClients } from "@/lib/mock-data";

interface CustomerSelectorProps {
  customer: Customer;
  setCustomer: (customer: Customer) => void;
  onAddNewCustomer: () => void;
}

export function CustomerSelector({
  customer,
  setCustomer,
  onAddNewCustomer,
}: CustomerSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getClients = () => {
    const stored = localStorage.getItem("pharmacy-clients");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return mockClients;
  };

  const filteredClients = getClients().filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.document.includes(searchTerm)
  );

  const handleSelectCustomer = (client: any) => {
    setCustomer({
      name: client.name,
      document: client.document,
      email: client.email,
      address: client.address,
    });
    setIsDialogOpen(false);
    setSearchTerm("");
  };

  const handleConsumidorFinal = () => {
    setCustomer({
      name: "Consumidor Final",
      document: "",
      email: "",
      address: "",
    });
    setIsDialogOpen(false);
    setSearchTerm("");
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <User className="w-4 h-4 mr-2" />
          {customer.name || "Seleccionar cliente"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seleccionar cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o documento..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleConsumidorFinal}
              >
                <User className="w-4 h-4 mr-2" />
                Consumidor Final
              </Button>

              {filteredClients.map((client) => (
                <Button
                  key={client.id}
                  variant="ghost"
                  className="w-full justify-start h-auto py-3"
                  onClick={() => handleSelectCustomer(client)}
                >
                  <div className="text-left">
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {client.document} • {client.email}
                    </p>
                  </div>
                </Button>
              ))}

              {filteredClients.length === 0 && searchTerm && (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No se encontraron clientes</p>
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => {
                      setIsDialogOpen(false);
                      onAddNewCustomer();
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Agregar nuevo cliente
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setIsDialogOpen(false);
                onAddNewCustomer();
              }}
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Agregar nuevo cliente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
