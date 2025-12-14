import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medicamentos - PharmaCare",
  description: "Listado y administración de medicamentos",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="w-full">{children}</section>;
}