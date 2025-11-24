"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useClients } from "@/hooks/use-clients";
import { ClientDialog } from "./client-dialog";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/page-header";
import { Users } from "lucide-react";
import { ClientSearch } from "./client/ClientSearch";
import { ClientList } from "./client/ClientList";
import { ClientStats } from "./client/ClientStats";
// Cambia esta importación para usar el modal reutilizable
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";

export function ClientsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const { clients, addClient, updateClient, deleteClient, stats } = useClients();
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  useEffect(() => {}, []);

  const handleEditClient = (client: any) => {
    setEditingClient(client);
    setShowDialog(true);
  };

  const handleDeleteClick = (clientId: string) => {
    setClientToDelete(clientId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete);
      setShowDeleteModal(false);
      setClientToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setClientToDelete(null);
  };

  const handleSaveClient = (clientData: any) => {
    if (editingClient) {
      updateClient(editingClient.id, clientData);
    } else {
      addClient(clientData);
    }
    setEditingClient(null);
    setShowDialog(false);
  };

  const clearSearch = () => {
    setSearch("");
  };

  

  // Obtener el nombre del cliente a eliminar
  const clientToDeleteName = clientToDelete
    ? clients.find((c) => c.id === clientToDelete)?.name
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Gestión de Clientes"
        subtitle={`${stats.total} clientes registrados`}
        icon={<Users className="h-5 w-5 text-primary" />}
      />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 space-y-6">
            <ClientStats stats={stats} />

            <ClientSearch
              search={search}
              setSearch={setSearch}
              clearSearch={clearSearch}
              clientsCount={clients.length}
              onNewClient={() => setShowDialog(true)}
            />

            <ClientList
              clients={clients}
              search={search}
              onEditClient={handleEditClient}
              onDeleteClient={handleDeleteClick}
            />

            <ClientDialog
              open={showDialog}
              onOpenChange={(open) => {
                setShowDialog(open);
                if (!open) setEditingClient(null);
              }}
              client={editingClient}
              onSave={handleSaveClient}
            />

            {/* Usa el modal reutilizable con las props adecuadas */}
            <DeleteConfirmationModal
              isOpen={showDeleteModal}
              onClose={handleCancelDelete}
              onConfirm={handleConfirmDelete}
              itemName={clientToDeleteName}
              title="¿Eliminar cliente?"
              description="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
