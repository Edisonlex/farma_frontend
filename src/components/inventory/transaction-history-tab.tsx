"use client";

import { useState } from "react";
import { useInventory } from "@/context/inventory-context";
import { TransactionStats } from "./transaction/TransactionStats";
import { TransactionFilters } from "./transaction/TransactionFilters";
import { TransactionsList } from "./transaction/TransactionsList";



export function TransactionHistoryTab() {
  const { movements, adjustments } = useInventory();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  // Combinar movimientos y ajustes en un solo historial
  const transactionHistory = [
    ...movements.map((mov) => ({
      ...mov,
      type: "movement",
      subtype: mov.type,
    })),
    ...adjustments.map((adj) => ({
      ...adj,
      type: "adjustment",
      subtype: adj.type,
      batch: "N/A",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredTransactions = transactionHistory.filter((transaction) => {
    const matchesSearch =
      transaction.medication.toLowerCase().includes(search.toLowerCase()) ||
      transaction.reason.toLowerCase().includes(search.toLowerCase()) ||
      transaction.batch.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;

    // Filtro por fecha
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const transactionDate = new Date(transaction.date);
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
