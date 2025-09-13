import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { ConditionalNav } from "@/components/navigation/ConditionalNav"
import { AlertsProvider } from "@/context/AlertsContext"
import { SalesProvider } from "@/context/sales-context"
import { ConfigurationProvider } from "@/context/configuration-context"
import { InventoryProvider } from "@/context/inventory-context"

export const metadata: Metadata = {
  title: "PharmaCare - Sistema de Inventario",
  description: "Sistema inteligente de gestión de inventario de medicamentos",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ConfigurationProvider>
            <AuthProvider>
              <AlertsProvider>
                <SalesProvider>
                  <InventoryProvider>
                    <ConditionalNav />
                    {children}
                  </InventoryProvider>
                </SalesProvider>
              </AlertsProvider>
            </AuthProvider>
          </ConfigurationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
