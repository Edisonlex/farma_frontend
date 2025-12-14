import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alertas - PharmaCare",
  description: "Alertas del sistema y estado de inventario",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="w-full">{children}</section>;
}