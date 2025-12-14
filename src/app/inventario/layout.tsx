import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventario - PharmaCare",
  description: "Gestión del inventario de medicamentos y estados de stock",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="w-full">{children}</section>;
}