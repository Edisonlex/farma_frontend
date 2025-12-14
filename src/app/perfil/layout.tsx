import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfil - PharmaCare",
  description: "Información y preferencias del usuario",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="w-full">{children}</section>;
}