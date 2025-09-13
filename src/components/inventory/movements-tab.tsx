"use client";

import { useState } from "react";
import { MovementDialog } from "./movement-dialog";
import { useInventory } from "@/context/inventory-context";
import { MovementStats } from "./movements/MovementStats";
import { MovementFilters } from "./movements/MovementFilters";
import { MovementsList } from "./movements/MovementsList";

export function MovementsTab() {
  const { movements } = useInventory();
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Filtrar movimientos
  const filteredMovements = movements.filter((movement) => {
    const matchesSearch =
      movement.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.batch.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || movement.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setDateFilter("all");
  };

  return (
    <div className="space-y-6">
      <MovementStats
        movements={movements}
        filteredCount={filteredMovements.length}
      />

      <MovementFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onShowDialog={() => setShowDialog(true)}
        onClearFilters={clearFilters}
        hasActiveFilters={searchTerm !== "" || typeFilter !== "all"}
      />

      <MovementsList
        movements={filteredMovements}
        searchTerm={searchTerm}
        typeFilter={typeFilter}
        onClearFilters={clearFilters}
      />

      <MovementDialog open={showDialog} onOpenChange={setShowDialog} />
    </div>
  );
}
