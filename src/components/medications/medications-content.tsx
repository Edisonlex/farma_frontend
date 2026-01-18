"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { MedicationFilters } from "./medication-filters";
import { MedicationsTable } from "./medications-table";
import { MedicationDialog } from "./medication-dialog";
import type { Medication } from "@/lib/types";

interface MedicationsContentProps {
  showFilters: boolean;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  medications: Medication[];
  filteredMedications: Medication[];
  canManage: boolean;
  canViewInventory: boolean;
  openEditDialog: (medication: Medication) => void;
  handleDeleteMedication: (id: string) => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingMedication: Medication | null;
  handleSaveMedication: (
    medication: Medication | Omit<Medication, "id">,
  ) => void;
}

export function MedicationsContent({
  showFilters,
  categories,
  selectedCategory,
  setSelectedCategory,
  medications,
  filteredMedications,
  canManage,
  canViewInventory,
  openEditDialog,
  handleDeleteMedication,
  dialogOpen,
  setDialogOpen,
  editingMedication,
  handleSaveMedication,
}: MedicationsContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 overflow-hidden"
        >
          <MedicationFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            medications={medications}
          />
        </motion.div>
      )}

      {/* Medications Table */}
      <Card className="overflow-x-auto border border-border/60 shadow-md rounded-xl">
        <CardHeader className="px-4 py-3 sm:px-6 sm:py-4 border-b bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="text-lg sm:text-xl tracking-tight">
            Lista de Medicamentos
          </CardTitle>
          <CardDescription className="text-sm sm:text-base leading-relaxed">
            Gestiona el inventario completo de medicamentos.
            {canViewInventory && (
              <>
                {" "}
                Para control de stock y movimientos, visita{" "}
                <Link
                  href="/inventario"
                  className="text-primary hover:underline font-medium"
                >
                  Control de Inventario
                </Link>
                .
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="min-w-0">
            <MedicationsTable
              medications={filteredMedications}
              onEdit={canManage ? openEditDialog : undefined}
              onDelete={canManage ? handleDeleteMedication : undefined}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <MedicationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        medication={editingMedication}
        onSave={handleSaveMedication}
      />
    </motion.div>
  );
}
