import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Usuarios - PharmaCare",
  description: "Administración de usuarios y roles",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="w-full">{children}</section>;
}
