// components/management/suppliers-page.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { Truck } from "lucide-react";
import { useInventory } from "@/context/inventory-context";
import { SupplierStats } from "./SupplierStats";
import { SupplierDialog } from "./SupplierDialog";
import { SupplierList } from "./SupplierList";
import { SupplierSearch } from "./SupplierSearch";
import type { Supplier } from "@/lib/types";


// Función para normalizar texto (eliminar tildes y convertir a minúsculas)
const normalizeText = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export function SuppliersPage() {
  const { suppliers, deleteSupplier } = useInventory();
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

  // Búsqueda mejorada con normalización de texto
  const filteredSuppliers = useMemo(() => {
    if (!search.trim()) return suppliers;

    const normalizedSearch = normalizeText(search);

    return suppliers.filter((sup) => {
      const normalizedName = normalizeText(sup.name || "");
      const normalizedContact = normalizeText(sup.contact || "");
      const normalizedEmail = normalizeText(sup.email || "");

      return (
        normalizedName.includes(normalizedSearch) ||
        normalizedContact.includes(normalizedSearch) ||
        normalizedEmail.includes(normalizedSearch)
      );
    });
  }, [suppliers, search]);

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowDialog(true);
  };

  const handleDeleteClick = (supplierData: Supplier) => {
    setSupplierToDelete(supplierData);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (supplierToDelete) {
      deleteSupplier(supplierToDelete.id);
      setShowDeleteModal(false);
      setSupplierToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSupplierToDelete(null);
  };

  const handleSaveSupplier = (supplierData: any) => {
    setEditingSupplier(null);
    setShowDialog(false);
  };

  const stats = {
    total: suppliers.length,
    withContact: suppliers.filter((sup) => sup.contact).length,
    withEmail: suppliers.filter((sup) => sup.email).length,
    withPhone: suppliers.filter((sup) => sup.phone).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Gestión de Proveedores"
        subtitle={`${stats.total} proveedores registrados`}
        icon={<Truck className="h-5 w-5 text-primary" />}
      />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 space-y-6">
            <SupplierStats stats={stats} />

            <SupplierSearch
              search={search}
              onSearchChange={setSearch}
              onNewSupplier={() => setShowDialog(true)}
            />

            <SupplierList
              suppliers={filteredSuppliers}
              onEditSupplier={handleEditSupplier}
              onDeleteSupplier={handleDeleteClick}
            />

            <SupplierDialog
              open={showDialog}
              onOpenChange={setShowDialog}
              supplier={editingSupplier ?? undefined}
              onSave={handleSaveSupplier}
            />

            <DeleteConfirmationModal
              isOpen={showDeleteModal}
              onClose={handleCancelDelete}
              onConfirm={handleConfirmDelete}
              itemName={supplierToDelete?.name}
              title="¿Eliminar proveedor?"
              description="¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer."
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
