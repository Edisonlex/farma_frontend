// Componente principal de configuración
export { SystemConfiguration } from "./system-configuration";

// Componentes individuales de configuración
export { NotificationSettings } from "./notification-settings";
export { SecuritySettings } from "./security-settings";
export { InventorySettings } from "./inventory-settings";
export { UserSettings } from "./user-settings";
export { SystemSettings } from "./system-settings";
export { BackupSettings } from "./backup-settings";

// Re-exportar contextos relacionados para facilitar el uso
export {
  ConfigurationProvider,
  useConfiguration,
  useNotificationConfig,
  useSecurityConfig,
  useInventoryConfig,
  useUserConfig,
  useSystemConfig,
  useBackupConfig
} from "@/context/configuration-context";

// Re-exportar el provider principal
export { AppProviders } from "@/context/app-providers";

// Tipos principales
export type {
  NotificationConfig,
  SecurityConfig,
  InventoryConfig,
  UserConfig,
  SystemConfig,
  BackupConfig,
  ConfigurationState
} from "@/context/configuration-context";
