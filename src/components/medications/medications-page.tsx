// medications-page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { hasPermission } from "@/lib/auth";
import { PageHeader } from "../shared/page-header";
import { BriefcaseMedical } from "lucide-react";
import { ActionsBar } from "./actions-bar";
import { MedicationsContent } from "./medications-content";
import { useInventory } from "@/context/inventory-context"; // Importar el contexto
import type { Medication } from "@/lib/types";

export function MedicationsPage() {
  const { user } = useAuth();
  const { medications, addMedication, updateMedication } = useInventory(); // Usar el contexto

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(
    null
  );

  const canManage = Boolean(
    user && hasPermission(user.role, "manage_medications")
  );
  const canViewInventory = Boolean(
    user &&
      (hasPermission(user.role, "manage_inventory") ||
        hasPermission(user.role, "view_inventory"))
  );

  const searchParams = useSearchParams();
  useEffect(() => {
    const s = searchParams.get("search");
    if (s) setSearchTerm(s);
  }, [searchParams]);

  const filteredMedications = medications.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.batch.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || med.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(
    new Set(medications.map((med) => med.category))
  );

  const handleSaveMedication = (
    medicationData: Medication | Omit<Medication, "id">
  ) => {
    if ("id" in medicationData) {
      // Es una edición (tiene id)
      updateMedication(medicationData.id, medicationData);
      setEditingMedication(null);
    } else {
      // Es una adición nueva (no tiene id)
      addMedication(medicationData);
    }
    setDialogOpen(false);
  };

  const handleDeleteMedication = (id: string) => {
    // Aquí deberías implementar la lógica para eliminar medicamentos
    // según tu contexto actual
    console.log("Eliminar medicamento:", id);
  };

  const openEditDialog = (medication: Medication) => {
    setEditingMedication(medication);
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingMedication(null);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Gestión de Medicamentos"
        subtitle={`${filteredMedications.length} de ${medications.length} medicamentos en total`}
        icon={<BriefcaseMedical className="h-6 w-6 text-white" />}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <ActionsBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          canManage={canManage}
          canViewInventory={canViewInventory}
          openAddDialog={openAddDialog}
          filteredMedications={filteredMedications}
        />

        <MedicationsContent
          showFilters={showFilters}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          medications={medications}
          filteredMedications={filteredMedications}
          canManage={canManage}
          canViewInventory={canViewInventory}
          openEditDialog={openEditDialog}
          handleDeleteMedication={handleDeleteMedication}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          editingMedication={editingMedication}
          handleSaveMedication={handleSaveMedication}
        />
      </main>
    </div>
  );
}
