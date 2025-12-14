import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Clientes - PharmaCare",
  description: "Gestión y búsqueda de clientes",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="w-full">{children}</section>
}