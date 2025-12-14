import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proveedores - PharmaCare",
  description: "Gestión de proveedores y contactos",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="w-full">{children}</section>;
}