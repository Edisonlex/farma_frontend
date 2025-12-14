import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Análisis - PharmaCare",
  description: "Predicciones, tendencias y riesgos de inventario",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="w-full">{children}</section>;
}