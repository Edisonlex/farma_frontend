"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import {
  Settings,
  Bell,
  Shield,
  Database,
  Users,
  Package,
  Mail,
  Sliders,
} from "lucide-react";
import { NotificationSettings } from "./notification-settings";
import { SecuritySettings } from "./security-settings";
import { InventorySettings } from "./inventory-settings";
import { UserSettings } from "./user-settings";
import { BackupSettings } from "./backup-settings";
import {
  ConfigurationProvider,
  useConfiguration,
} from "@/context/configuration-context";
import { Button } from "../ui/button";

function SystemConfigurationContent() {
  const [activeTab, setActiveTab] = useState("notifications");
  const { resetToDefaults, exportConfig, importConfig } = useConfiguration();

  const tabs = [
    {
      id: "notifications",
      label: "Notificaciones",
      icon: Bell,
      description: "Configurar alertas y notificaciones del sistema",
    },
    {
      id: "security",
      label: "Seguridad",
      icon: Shield,
      description: "Configuraciones de seguridad y autenticación",
    },
    {
      id: "inventory",
      label: "Inventario",
      icon: Package,
      description: "Configuraciones del sistema de inventario",
    },
    {
      id: "users",
      label: "Usuarios",
      icon: Users,
      description: "Configuraciones de gestión de usuarios",
    },
    {
      id: "backup",
      label: "Respaldos",
      icon: Database,
      description: "Configuraciones de respaldo y recuperación",
    },
  ];

  const handleExportConfig = () => {
    const configData = exportConfig();
    const blob = new Blob([configData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pharmacare-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        importConfig(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader
            title="Configuración del Sistema"
            subtitle="Administra las configuraciones generales del sistema PharmaCare"
            icon={<Settings className="h-5 w-5 text-primary" />}
          />

          <div className="mt-8">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 h-auto p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex flex-col items-center gap-2 p-4 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* Tab Description */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {tabs.find((tab) => tab.id === activeTab)?.description}
                </p>
              </div>

              <TabsContent value="notifications" className="space-y-6">
                <NotificationSettings />
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <SecuritySettings />
              </TabsContent>

              <TabsContent value="inventory" className="space-y-6">
                <InventorySettings />
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <UserSettings />
              </TabsContent>

              <TabsContent value="backup" className="space-y-6">
                <BackupSettings />
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export function SystemConfiguration() {
  return (
    <ConfigurationProvider>
      <SystemConfigurationContent />
    </ConfigurationProvider>
  );
}
