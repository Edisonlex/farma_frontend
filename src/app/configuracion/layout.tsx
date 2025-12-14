import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración - PharmaCare",
  description: "Ajustes del sistema y preferencias",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="w-full">{children}</section>;
}