"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import {
  NotificationConfigSchema,
  SecurityConfigSchema,
  InventoryConfigSchema,
  UserConfigSchema,
  SystemConfigSchema,
  BackupConfigSchema,
} from "@/lib/schemas";
import { useAuth } from "@/hooks/use-auth";
import { useRealtime } from "@/context/realtime-context";
import { apiPut, hasApi } from "@/lib/api";

// Tipos de configuración
export interface NotificationConfig {
  // Umbrales de stock
  stockThreshold: number;
  criticalStockThreshold: number;
  expiryDays: number;
  criticalExpiryDays: number;
  
  // Tipos de notificaciones
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
  lowStockAlerts?: boolean;
  expiryAlerts?: boolean;
  salesAlerts?: boolean;
  systemAlerts?: boolean;
  securityAlerts?: boolean;
  
  // Configuraciones automáticas
  autoResolve: boolean;
  dailyDigest: boolean;
  weeklyReport: boolean;
  monthlyReport: boolean;
  
  // Horarios
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  
  // Email
  emailAddress: string;
  smtpServer: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
}

export interface SecurityConfig {
  // Políticas de contraseñas
  minPasswordLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  passwordExpiration: number;
  
  // Autenticación
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  
  // Auditoría
  auditLogging: boolean;
  loginLogging: boolean;
  dataChangeLogging: boolean;
  accessLogging: boolean;
  
  // Encriptación
  dataEncryption: boolean;
  backupEncryption: boolean;
  transmissionEncryption: boolean;
}

export interface InventoryConfig {
  // Umbrales de stock
  defaultMinStock: number;
  defaultMaxStock: number;
  criticalStockLevel: number;
  reorderPoint: number;
  
  // Configuraciones de vencimiento
  expiryWarningDays: number;
  criticalExpiryDays: number;
  autoRemoveExpired: boolean;
  
  // Movimientos automáticos
  autoReorder: boolean;
  autoReorderQuantity: number;
  autoAdjustments: boolean;
  
  // Categorización
  autoCategories: boolean;
  defaultCategory: string;
  requireBatch: boolean;
  
  // Reportes
  dailyReports: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  
  // Proveedores
  defaultSupplier: string;
  autoSupplierSelection: boolean;
}

export interface UserConfig {
  defaultRole: string;
  autoActivation: boolean;
  passwordReset: boolean;
  profilePictures: boolean;
  userRegistration: boolean;
  emailVerification: boolean;
}

export interface SystemConfig {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  timezone: string;
  language: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  theme: string;
  autoBackup: boolean;
  backupFrequency: string;
  maxBackups: number;
  maintenanceMode?: boolean;
}

export interface BackupConfig {
  autoBackup: boolean;
  backupFrequency: string;
  backupTime: string;
  maxBackups: number;
  backupLocation: string;
  cloudBackup: boolean;
  encryptBackups: boolean;
  compressBackups: boolean;
}

export interface ConfigurationState {
  notifications: NotificationConfig;
  security: SecurityConfig;
  inventory: InventoryConfig;
  users: UserConfig;
  system: SystemConfig;
  backup: BackupConfig;
}

interface ConfigurationContextType {
  config: ConfigurationState;
  updateNotificationConfig: (updates: Partial<NotificationConfig>) => void;
  updateSecurityConfig: (updates: Partial<SecurityConfig>) => void;
  updateInventoryConfig: (updates: Partial<InventoryConfig>) => void;
  updateUserConfig: (updates: Partial<UserConfig>) => void;
  updateSystemConfig: (updates: Partial<SystemConfig>) => void;
  updateBackupConfig: (updates: Partial<BackupConfig>) => void;
  resetToDefaults: () => void;
  exportConfig: () => string;
  importConfig: (configJson: string) => boolean;
}

// Configuraciones por defecto
const defaultConfig: ConfigurationState = {
  notifications: {
    stockThreshold: 30,
    criticalStockThreshold: 10,
    expiryDays: 30,
    criticalExpiryDays: 7,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    inAppNotifications: true,
    lowStockAlerts: true,
    expiryAlerts: true,
    salesAlerts: true,
    systemAlerts: true,
    securityAlerts: true,
    autoResolve: false,
    dailyDigest: true,
    weeklyReport: true,
    monthlyReport: false,
    quietHoursEnabled: true,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
    emailAddress: "",
    smtpServer: "",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: ""
  },
  security: {
    minPasswordLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiration: 90,
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    auditLogging: true,
    loginLogging: true,
    dataChangeLogging: true,
    accessLogging: false,
    dataEncryption: true,
    backupEncryption: true,
    transmissionEncryption: true
  },
  inventory: {
    defaultMinStock: 20,
    defaultMaxStock: 1000,
    criticalStockLevel: 5,
    reorderPoint: 30,
    expiryWarningDays: 30,
    criticalExpiryDays: 7,
    autoRemoveExpired: false,
    autoReorder: false,
    autoReorderQuantity: 100,
    autoAdjustments: true,
    autoCategories: false,
    defaultCategory: "Medicamentos",
    requireBatch: true,
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: false,
    defaultSupplier: "",
    autoSupplierSelection: false
  },
  users: {
    defaultRole: "Empleado",
    autoActivation: false,
    passwordReset: true,
    profilePictures: true,
    userRegistration: false,
    emailVerification: true
  },
  system: {
    companyName: "PharmaCare",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    timezone: "America/Mexico_City",
    language: "es",
    currency: "MXN",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    theme: "light",
    autoBackup: true,
    backupFrequency: "daily",
    maxBackups: 30
  },
  backup: {
    autoBackup: true,
    backupFrequency: "daily",
    backupTime: "02:00",
    maxBackups: 30,
    backupLocation: "local",
    cloudBackup: false,
    encryptBackups: true,
    compressBackups: true
  }
};

const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export function ConfigurationProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ConfigurationState>(defaultConfig);
  const { user } = useAuth();
  const { clientId, publish, subscribe } = useRealtime();

  // Cargar configuración desde localStorage al inicializar
  useEffect(() => {
    const savedConfig = localStorage.getItem('pharmacare-config');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig({ ...defaultConfig, ...parsedConfig });
      } catch (error) {
        console.error('Error loading configuration:', error);
        toast.error('Error al cargar la configuración guardada');
      }
    }
  }, []);

  // Guardar configuración en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('pharmacare-config', JSON.stringify(config));
  }, [config]);

  // Suscripción en tiempo real para recibir actualizaciones de otras pestañas/usuarios
  useEffect(() => {
    const unsub = subscribe("config.update", (payload: { section: keyof ConfigurationState; updates: any }, source) => {
      if (source === clientId) return;
      const section = payload.section;
      const updates = payload.updates || {};
      setConfig(prev => ({
        ...prev,
        [section]: { ...(prev as any)[section], ...updates },
      }));
    });
    return () => { try { unsub(); } catch {} };
  }, [subscribe, clientId]);

  const ensureAdmin = () => {
    if (!user || user.role !== "administrador") {
      toast.error('Solo el Administrador puede cambiar la configuración');
      return false;
    }
    return true;
  };

  const updateNotificationConfig = (updates: Partial<NotificationConfig>) => {
    if (!ensureAdmin()) return;
    const v = NotificationConfigSchema.partial().safeParse(updates);
    if (!v.success) {
      toast.error('Datos de notificaciones inválidos');
      return;
    }
    setConfig(prev => ({
      ...prev,
      notifications: { ...prev.notifications, ...v.data }
    }));
    publish("config.update", { section: "notifications", updates: v.data });
    try { if (hasApi()) apiPut(`/config/notifications`, v.data); } catch {}
    toast.success('Configuración de notificaciones actualizada');
  };

  const updateSecurityConfig = (updates: Partial<SecurityConfig>) => {
    if (!ensureAdmin()) return;
    const v = SecurityConfigSchema.partial().safeParse(updates);
    if (!v.success) {
      toast.error('Datos de seguridad inválidos');
      return;
    }
    setConfig(prev => ({
      ...prev,
      security: { ...prev.security, ...v.data }
    }));
    publish("config.update", { section: "security", updates: v.data });
    try { if (hasApi()) apiPut(`/config/security`, v.data); } catch {}
    toast.success('Configuración de seguridad actualizada');
  };

  const updateInventoryConfig = (updates: Partial<InventoryConfig>) => {
    if (!ensureAdmin()) return;
    const v = InventoryConfigSchema.partial().safeParse(updates);
    if (!v.success) {
      toast.error('Datos de inventario inválidos');
      return;
    }
    setConfig(prev => ({
      ...prev,
      inventory: { ...prev.inventory, ...v.data }
    }));
    publish("config.update", { section: "inventory", updates: v.data });
    try { if (hasApi()) apiPut(`/config/inventory`, v.data); } catch {}
    toast.success('Configuración de inventario actualizada');
  };

  const updateUserConfig = (updates: Partial<UserConfig>) => {
    if (!ensureAdmin()) return;
    const v = UserConfigSchema.partial().safeParse(updates);
    if (!v.success) {
      toast.error('Datos de usuarios inválidos');
      return;
    }
    setConfig(prev => ({
      ...prev,
      users: { ...prev.users, ...v.data }
    }));
    publish("config.update", { section: "users", updates: v.data });
    try { if (hasApi()) apiPut(`/config/users`, v.data); } catch {}
    toast.success('Configuración de usuarios actualizada');
  };

  const updateSystemConfig = (updates: Partial<SystemConfig>) => {
    if (!ensureAdmin()) return;
    const v = SystemConfigSchema.partial().safeParse(updates);
    if (!v.success) {
      toast.error('Datos del sistema inválidos');
      return;
    }
    setConfig(prev => ({
      ...prev,
      system: { ...prev.system, ...v.data }
    }));
    publish("config.update", { section: "system", updates: v.data });
    try { if (hasApi()) apiPut(`/config/system`, v.data); } catch {}
    toast.success('Configuración del sistema actualizada');
  };

  const updateBackupConfig = (updates: Partial<BackupConfig>) => {
    if (!ensureAdmin()) return;
    const v = BackupConfigSchema.partial().safeParse(updates);
    if (!v.success) {
      toast.error('Datos de respaldos inválidos');
      return;
    }
    setConfig(prev => ({
      ...prev,
      backup: { ...prev.backup, ...v.data }
    }));
    publish("config.update", { section: "backup", updates: v.data });
    try { if (hasApi()) apiPut(`/config/backup`, v.data); } catch {}
    toast.success('Configuración de respaldos actualizada');
  };

  const resetToDefaults = () => {
    if (!ensureAdmin()) return;
    setConfig(defaultConfig);
    localStorage.removeItem('pharmacare-config');
    publish("config.update", { section: "all", updates: defaultConfig });
    toast.success('Configuración restablecida a valores por defecto');
  };

  const exportConfig = () => {
    return JSON.stringify(config, null, 2);
  };

  const importConfig = (configJson: string) => {
    try {
      const importedConfig = JSON.parse(configJson);
      setConfig({ ...defaultConfig, ...importedConfig });
      toast.success('Configuración importada exitosamente');
      return true;
    } catch (error) {
      toast.error('Error al importar la configuración');
      return false;
    }
  };

  return (
    <ConfigurationContext.Provider
      value={{
        config,
        updateNotificationConfig,
        updateSecurityConfig,
        updateInventoryConfig,
        updateUserConfig,
        updateSystemConfig,
        updateBackupConfig,
        resetToDefaults,
        exportConfig,
        importConfig
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
}

export function useConfiguration() {
  const context = useContext(ConfigurationContext);
  if (context === undefined) {
    throw new Error('useConfiguration must be used within a ConfigurationProvider');
  }
  return context;
}

// Hooks específicos para cada sección
export function useNotificationConfig() {
  const { config, updateNotificationConfig } = useConfiguration();
  return { config: config.notifications, updateConfig: updateNotificationConfig };
}

export function useSecurityConfig() {
  const { config, updateSecurityConfig } = useConfiguration();
  return { config: config.security, updateConfig: updateSecurityConfig };
}

export function useInventoryConfig() {
  const { config, updateInventoryConfig } = useConfiguration();
  return { config: config.inventory, updateConfig: updateInventoryConfig };
}

export function useUserConfig() {
  const { config, updateUserConfig } = useConfiguration();
  return { config: config.users, updateConfig: updateUserConfig };
}

export function useSystemConfig() {
  const { config, updateSystemConfig } = useConfiguration();
  return { config: config.system, updateConfig: updateSystemConfig };
}

export function useBackupConfig() {
  const { config, updateBackupConfig } = useConfiguration();
  return { config: config.backup, updateConfig: updateBackupConfig };
}