// Exportar todos los contextos y providers
export * from "./configuration-context";
export * from "./AlertsContext";
export * from "./inventory-context";
export * from "./sales-context";
export * from "./app-providers";

// Exportar tipos principales
export type {
  NotificationConfig,
  SecurityConfig,
  InventoryConfig,
  UserConfig,
  SystemConfig,
  BackupConfig,
  ConfigurationState,
} from "./configuration-context";

export type { Medication } from "@/lib/mock-data";
export type { CartItem, Customer, Sale } from "./sales-context";
