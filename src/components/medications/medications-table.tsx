"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package } from "lucide-react";
import type { Medication } from "@/lib/types";
import { MedicationDetailDialog } from "./medication-detail-dialog";

import { useMediaQuery } from "@/hooks/use-media-query";
import { MedicationsMobileView } from "./table/MedicationsMobileView";
import { MedicationsTableRow } from "./table/MedicationsTableRow";

interface MedicationsTableProps {
  medications: Medication[];
  onEdit?: (medication: Medication) => void;
  onDelete?: (id: string) => void;
}

export function MedicationsTable({
  medications,
  onEdit,
  onDelete,
}: MedicationsTableProps) {
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const openDetailDialog = (medication: Medication) => {
    setSelectedMedication(medication);
    setDetailDialogOpen(true);
  };

  if (medications.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-semibold mb-2">
          No se encontraron medicamentos
        </h3>
        <p className="text-muted-foreground">
          Intenta ajustar los filtros de búsqueda o agrega nuevos medicamentos.
        </p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <>
        <MedicationsMobileView
          medications={medications}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={openDetailDialog}
        />
        <MedicationDetailDialog
          medication={selectedMedication}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
        />
      </>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-semibold text-foreground/90 py-4 px-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span>Medicamento</span>
                    <svg
                      className="w-3 h-3 opacity-60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                    </svg>
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-foreground/90 py-4 px-4 text-sm">
                  Lote
                </TableHead>
                <TableHead className="font-semibold text-foreground/90 py-4 px-4 text-sm">
                  Categoría
                </TableHead>
                <TableHead className="font-semibold text-foreground/90 py-4 px-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span>Stock</span>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40"></div>
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-foreground/90 py-4 px-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span>Vencimiento</span>
                    <svg
                      className="w-3 h-3 opacity-60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-foreground/90 py-4 px-4 text-sm">
                  Proveedor
                </TableHead>
                <TableHead className="font-semibold text-foreground/90 py-4 px-4 text-sm text-right">
                  Precio
                </TableHead>
                <TableHead className="w-[60px] py-4 px-4">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-background">
              {medications.map((medication, index) => (
                <MedicationsTableRow
                  key={medication.id}
                  medication={medication}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onViewDetails={openDetailDialog}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <MedicationDetailDialog
        medication={selectedMedication}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </>
  );
}
