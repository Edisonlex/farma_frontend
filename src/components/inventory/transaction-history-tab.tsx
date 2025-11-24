"use client";

import { useState } from "react";
import { useInventory } from "@/context/inventory-context";
import { TransactionStats } from "./transaction/TransactionStats";
import { TransactionFilters } from "./transaction/TransactionFilters";
import { TransactionsList } from "./transaction/TransactionsList";



export function TransactionHistoryTab() {
  const { movements } = useInventory();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  // Normalizar movimientos y ajustes a un formato común para la vista y exportaciones
  const transactionHistory = movements
    .map((mov) => {
      const isAdjustment = mov.type === "ajuste";
      return {
        id: mov.id,
        medication: mov.medicationName,
        type: (isAdjustment ? "adjustment" : "movement") as const,
        subtype: isAdjustment
          ? mov.quantity >= 0
            ? "increase"
            : "decrease"
          : mov.type,
        quantity: Math.abs(mov.quantity),
        reason: mov.reason,
        batch: "N/A",
        user: mov.userName,
        date: new Date(mov.date).toLocaleString("es-ES"),
        dateObj: new Date(mov.date),
      };
    })
    .sort((a, b) => {
      const da = a.dateObj as Date;
      const db = b.dateObj as Date;
      return db.getTime() - da.getTime();
    });

  const filteredTransactions = transactionHistory.filter((transaction) => {
    const matchesSearch =
      (transaction.medication || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (transaction.reason || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (transaction.batch || "N/A").toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;

    // Filtro por fecha
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const transactionDate = (transaction as any).dateObj
        ? (transaction as any).dateObj
        : new Date(transaction.date);
      if (dateFrom && transactionDate < dateFrom) matchesDate = false;
      if (dateTo && transactionDate > dateTo) matchesDate = false;
    }

    return matchesSearch && matchesType && matchesDate;
  });

  const hasActiveFilters =
    search !== "" || typeFilter !== "all" || dateFrom || dateTo;

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className="space-y-6">
      <TransactionStats transactions={filteredTransactions} />

      <TransactionFilters
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        hasActiveFilters={!!hasActiveFilters}
        onClearFilters={clearFilters}
        transactions={filteredTransactions}
      />

      <TransactionsList
        transactions={filteredTransactions}
        hasActiveFilters={!!hasActiveFilters}
        onClearFilters={clearFilters}
      />
    </div>
  );
}
