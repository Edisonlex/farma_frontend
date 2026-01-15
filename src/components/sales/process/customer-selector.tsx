"use client";

import { useState } from "react";
import { Customer } from "@/context/sales-context";
import { Client } from "@/lib/types";
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

  const getClients = (): Client[] => {
    const stored = localStorage.getItem("pharmacy-clients");
    if (stored) {
      try {
        return JSON.parse(stored) as Client[];
      } catch {}
    }
    return mockClients;
  };

  const filteredClients = getClients().filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.document.includes(searchTerm)
  );

  const handleSelectCustomer = (client: Client) => {
    setCustomer({
      name: client.name,
      document: client.document,
      email: client.email || "",
      address: client.address || "",
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

          <div className="max-h-60 overflow-y-auto px-1">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start border border-border rounded-lg p-4 h-auto hover:bg-accent hover:text-accent-foreground mb-2"
                onClick={handleConsumidorFinal}
              >
                <User className="w-4 h-4 mr-2" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">Consumidor Final</span>
                  <span className="text-xs text-muted-foreground">
                    Venta rápida sin datos
                  </span>
                </div>
              </Button>

              {filteredClients.map((client) => (
                <Button
                  key={client.id}
                  variant="ghost"
                  className="w-full justify-start h-auto p-4 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground mb-2"
                  onClick={() => handleSelectCustomer(client)}
                >
                  <div className="text-left w-full">
                    <p className="font-medium">{client.name}</p>
                    <div className="flex justify-between items-center w-full mt-1">
                      <p className="text-xs text-muted-foreground">
                        {client.document}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {client.email}
                      </p>
                    </div>
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
