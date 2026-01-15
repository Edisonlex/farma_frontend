import { z } from "zod";

export const MedicationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  batch: z.string().min(1),
  expiryDate: z.date(),
  quantity: z.number().int().min(0),
  minStock: z.number().int().min(0),
  supplier: z.string().min(1),
  category: z.string().min(1),
  activeIngredient: z.string().optional(),
  price: z.number().min(0),
  location: z.string().optional(),
  lastUpdated: z.date().optional(),
});

export const MedicationCreateSchema = MedicationSchema.omit({
  id: true,
  lastUpdated: true,
});
export const MedicationUpdateSchema = MedicationSchema.partial().omit({
  id: true,
});

export const InventoryMovementSchema = z.object({
  id: z.string(),
  medicationId: z.string(),
  medicationName: z.string(),
  type: z.enum(["entrada", "salida", "ajuste"]),
  quantity: z.number(),
  date: z.date(),
  reason: z.string().min(1),
  userId: z.string(),
  userName: z.string(),
});

export const InventoryMovementFormSchema = z.object({
  type: z.enum(["entrada", "salida"]),
  medicationId: z.string().min(1, { message: "Selecciona un medicamento" }),
  quantity: z.coerce
    .number()
    .int()
    .min(1, { message: "La cantidad debe ser mayor a 0" }),
  batch: z.string().min(1, { message: "El número de lote es requerido" }),
  reason: z.string().min(1, { message: "El motivo es requerido" }),
});

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
});
export const CategoryCreateSchema = CategorySchema.omit({ id: true });

const SupplierBaseSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  nombreComercial: z.string().min(1, { message: "Nombre comercial requerido" }),
  razonSocial: z.string().min(1, { message: "Razón social requerida" }),
  tipo: z.enum(["empresa", "persona"]),
  ruc: z
    .string()
    .optional()
    .refine((v) => !v || isValidRuc(v.replace(/[^0-9]/g, "")), {
      message: "RUC inválido",
    }),
  cedula: z
    .string()
    .optional()
    .refine((v) => !v || isValidCedula(v.replace(/[^0-9]/g, "")), {
      message: "Cédula inválida",
    }),
  status: z.enum(["Activo", "Inactivo"]),
  fechaRegistro: z.coerce.date(),
  contact: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (v) =>
        !v ||
        /^(?:\+593(?:[2-7]\d{7}|9\d{8})|0[2-7]\d{7}|09\d{8})$/.test(
          v.replace(/[\s-]/g, "")
        ),
      { message: "Teléfono de Ecuador inválido" }
    ),
  email: z.string().email().optional(),
});

export const SupplierSchema = SupplierBaseSchema.superRefine((val, ctx) => {
  if (val.tipo === "empresa") {
    if (!val.ruc || !val.ruc.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ruc"],
        message: "RUC requerido",
      });
    }
  } else if (val.tipo === "persona") {
    if (!val.cedula || !val.cedula.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cedula"],
        message: "Cédula requerida",
      });
    }
  }
});

export const SupplierCreateSchema = SupplierBaseSchema.omit({
  id: true,
}).superRefine((val, ctx) => {
  if (val.tipo === "empresa") {
    if (!val.ruc || !val.ruc.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ruc"],
        message: "RUC requerido",
      });
    }
  } else if (val.tipo === "persona") {
    if (!val.cedula || !val.cedula.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cedula"],
        message: "Cédula requerida",
      });
    }
  }
});

export const SupplierUpdateSchema = SupplierBaseSchema.partial()
  .omit({ id: true })
  .superRefine((val, ctx) => {
    if (val.tipo === "empresa") {
      if (val.ruc !== undefined && !val.ruc.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ruc"],
          message: "RUC requerido",
        });
      }
    } else if (val.tipo === "persona") {
      if (val.cedula !== undefined && !val.cedula.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cedula"],
          message: "Cédula requerida",
        });
      }
    }
  });

export const CartItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  price: z.number().min(0),
  quantity: z.number().int().min(1),
  stock: z.number().int().min(0),
  discount: z.number().min(0).max(100).optional(),
});

export const CustomerBaseSchema = z.object({
  name: z.string().min(1).optional(),
  document: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
});
export const CustomerSchema = CustomerBaseSchema.refine(
  (v) => !v.document || isValidEcuadorDocument(v.document),
  {
    message: "Documento de Ecuador inválido (cédula/RUC)",
    path: ["document"],
  }
);
export const CustomerFormSchema = CustomerBaseSchema.partial().refine(
  (v) => !v.document || isValidEcuadorDocument(v.document),
  {
    message: "Documento de Ecuador inválido (cédula/RUC)",
    path: ["document"],
  }
);

export const SaleSchema = z.object({
  id: z.string(),
  date: z.date(),
  customer: CustomerSchema,
  items: z.array(CartItemSchema).min(1),
  subtotal: z.number().min(0),
  discount: z.number().min(0),
  tax: z.number().min(0),
  total: z.number().min(0),
  paymentMethod: z.enum(["cash", "card", "transfer"]),
  status: z.enum(["Completada", "Anulada", "Pendiente"]),
  cashier: z.string().min(1),
});
export const SaleCreateSchema = SaleSchema.omit({
  id: true,
  date: true,
  status: true,
});

export const NotificationConfigSchema = z.object({
  stockThreshold: z.number().int().min(0),
  criticalStockThreshold: z.number().int().min(0),
  expiryDays: z.number().int().min(0),
  criticalExpiryDays: z.number().int().min(0),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  inAppNotifications: z.boolean(),
  lowStockAlerts: z.boolean().optional().default(true),
  expiryAlerts: z.boolean().optional().default(true),
  salesAlerts: z.boolean().optional().default(true),
  systemAlerts: z.boolean().optional().default(true),
  securityAlerts: z.boolean().optional().default(true),
  autoResolve: z.boolean(),
  dailyDigest: z.boolean(),
  weeklyReport: z.boolean(),
  monthlyReport: z.boolean(),
  quietHoursEnabled: z.boolean(),
  quietHoursStart: z.string(),
  quietHoursEnd: z.string(),
  emailAddress: z.string().email().or(z.literal("")),
  smtpServer: z.string().optional().default(""),
  smtpPort: z.number().int().min(1),
  smtpUsername: z.string().optional().default(""),
  smtpPassword: z.string().optional().default(""),
});

export const SecurityConfigSchema = z.object({
  minPasswordLength: z.number().int().min(6),
  requireUppercase: z.boolean(),
  requireLowercase: z.boolean(),
  requireNumbers: z.boolean(),
  requireSpecialChars: z.boolean(),
  passwordExpiration: z.number().int().min(0),
  twoFactorAuth: z.boolean(),
  sessionTimeout: z.number().int().min(1),
  maxLoginAttempts: z.number().int().min(1),
  lockoutDuration: z.number().int().min(0),
  auditLogging: z.boolean(),
  loginLogging: z.boolean(),
  dataChangeLogging: z.boolean(),
  accessLogging: z.boolean(),
  dataEncryption: z.boolean(),
  backupEncryption: z.boolean(),
  transmissionEncryption: z.boolean(),
});

export const InventoryConfigSchema = z.object({
  defaultMinStock: z.number().int().min(0),
  defaultMaxStock: z.number().int().min(0),
  criticalStockLevel: z.number().int().min(0),
  reorderPoint: z.number().int().min(0),
  expiryWarningDays: z.number().int().min(0),
  criticalExpiryDays: z.number().int().min(0),
  autoRemoveExpired: z.boolean(),
  autoReorder: z.boolean(),
  autoReorderQuantity: z.number().int().min(0),
  autoAdjustments: z.boolean(),
  autoCategories: z.boolean(),
  defaultCategory: z.string(),
  requireBatch: z.boolean(),
  dailyReports: z.boolean(),
  weeklyReports: z.boolean(),
  monthlyReports: z.boolean(),
  defaultSupplier: z.string(),
  autoSupplierSelection: z.boolean(),
});

export const UserConfigSchema = z.object({
  defaultRole: z.string(),
  autoActivation: z.boolean(),
  passwordReset: z.boolean(),
  profilePictures: z.boolean(),
  userRegistration: z.boolean(),
  emailVerification: z.boolean(),
});

export const SystemConfigSchema = z.object({
  companyName: z.string(),
  companyAddress: z.string(),
  companyPhone: z.string(),
  companyEmail: z.string().email().or(z.literal("")),
  timezone: z.string(),
  language: z.string(),
  currency: z.string(),
  dateFormat: z.string(),
  timeFormat: z.string(),
  theme: z.string(),
  autoBackup: z.boolean(),
  backupFrequency: z.string(),
  maxBackups: z.number().int().min(0),
});

export const BackupConfigSchema = z.object({
  autoBackup: z.boolean(),
  backupFrequency: z.string(),
  backupTime: z.string(),
  maxBackups: z.number().int().min(0),
  backupLocation: z.string(),
  cloudBackup: z.boolean(),
  encryptBackups: z.boolean(),
  compressBackups: z.boolean(),
});

export const UserRoleSchema = z.enum([
  "administrador",
  "farmaceutico",
  "tecnico",
]);

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  role: UserRoleSchema,
  password: z.string().min(6).optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
  lastLogin: z.date().nullable().optional(),
});

export const UserCreateSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});
export const UserUpdateSchema = UserSchema.partial().omit({ id: true });

export const UserFormCreateSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    role: UserRoleSchema,
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    phone: z
      .string()
      .optional()
      .refine(
        (v) =>
          !v ||
          /^(?:\+593(?:[2-7]\d{7}|9\d{8})|0[2-7]\d{7}|09\d{8})$/.test(
            v.replace(/[\s-]/g, "")
          ),
        { message: "Teléfono de Ecuador inválido" }
      ),
    department: z.string().optional(),
    isActive: z.boolean(),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Las contraseñas no coinciden",
      });
    }
  });

export const UserFormUpdateSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    role: UserRoleSchema,
    password: z.string().min(6).optional(),
    confirmPassword: z.string().optional(),
    phone: z
      .string()
      .optional()
      .refine(
        (v) =>
          !v ||
          /^(?:\+593(?:[2-7]\d{7}|9\d{8})|0[2-7]\d{7}|09\d{8})$/.test(
            v.replace(/[\s-]/g, "")
          ),
        { message: "Teléfono de Ecuador inválido" }
      ),
    department: z.string().optional(),
    isActive: z.boolean(),
  })
  .superRefine((val, ctx) => {
    if (val.password) {
      if (!val.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "Confirma la contraseña",
        });
      } else if (val.password !== val.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "Las contraseñas no coinciden",
        });
      }
    }
  });

export const AdjustStockFormSchema = z.object({
  medicationId: z.string().min(1, { message: "Selecciona un medicamento" }),
  type: z.enum(["increase", "decrease"], {
    errorMap: () => ({ message: "Selecciona el tipo de ajuste" }),
  }),
  quantity: z.coerce
    .number()
    .int()
    .min(1, { message: "La cantidad debe ser mayor a 0" }),
  reason: z.string().min(1, { message: "El motivo es requerido" }),
});

export const createAdjustStockFormSchema = (available: number) =>
  AdjustStockFormSchema.superRefine((val, ctx) => {
    if (val.type === "decrease" && val.quantity > available) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["quantity"],
        message: `No hay suficiente stock. Disponible: ${available}`,
      });
    }
  });

export const ClientTypeSchema = z.enum([
  "particular",
  "empresa",
  "institucion",
]);

export const ClientBaseSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (v) =>
        !v ||
        /^(?:\+593(?:[2-7]\d{7}|9\d{8})|0[2-7]\d{7}|09\d{8})$/.test(
          v.replace(/[\s-]/g, "")
        ),
      { message: "Teléfono de Ecuador inválido" }
    ),
  document: z.string().refine((v) => isValidEcuadorDocument(v), {
    message: "Documento de Ecuador inválido (cédula/RUC)",
  }),
  type: ClientTypeSchema,
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  birthDate: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
  companyName: z.string().optional(),
  taxId: z.string().optional(),
  contactPerson: z.string().optional(),
  website: z.string().url().optional(),
  createdAt: z.date().optional(),
  lastPurchase: z.date().nullable().optional(),
  totalPurchases: z.number().optional(),
  totalAmount: z.number().optional(),
});
export const ClientSchema = ClientBaseSchema.superRefine((val, ctx) => {
  if (val.type === "empresa" || val.type === "institucion") {
    if (!val.companyName || !val.companyName.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["companyName"],
        message: "El nombre es requerido",
      });
    }
    if (!val.taxId || !val.taxId.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["taxId"],
        message: "El RUC/NIT es requerido",
      });
    }
  }
  if (val.birthDate) {
    const s = String(val.birthDate);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["birthDate"],
        message: "Fecha inválida (AAAA-MM-DD)",
      });
    } else {
      const yyyy = parseInt(m[1], 10);
      const mm = parseInt(m[2], 10);
      const dd = parseInt(m[3], 10);
      const d = new Date(yyyy, mm - 1, dd);
      const valid =
        d.getFullYear() === yyyy &&
        d.getMonth() === mm - 1 &&
        d.getDate() === dd;
      const notFuture = d <= new Date();
      const plausible = yyyy >= 1900;
      const now = new Date();
      let age = now.getFullYear() - d.getFullYear();
      const hadBirthday =
        now.getMonth() > d.getMonth() ||
        (now.getMonth() === d.getMonth() && now.getDate() >= d.getDate());
      if (!hadBirthday) age -= 1;
      if (!valid || !notFuture || !plausible) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["birthDate"],
          message: "Fecha de nacimiento inválida",
        });
      } else if (age < 18) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["birthDate"],
          message: "Debe ser mayor de 18 años",
        });
      }
    }
  }
});

export const ClientCreateSchema = ClientBaseSchema.omit({
  id: true,
  createdAt: true,
  lastPurchase: true,
  totalPurchases: true,
  totalAmount: true,
});
export const ClientUpdateSchema = ClientBaseSchema.partial().omit({ id: true });

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
});

function isValidEcuadorDocument(input: string) {
  const s = input.replace(/[^0-9]/g, "");
  if (s.length === 10) return isValidCedula(s);
  if (s.length === 13) return isValidRuc(s);
  return false;
}

function isValidCedula(id: string) {
  if (!/^[0-9]{10}$/.test(id)) return false;
  const prov = parseInt(id.slice(0, 2), 10);
  if (prov < 1 || prov > 24) return false;
  const third = parseInt(id[2], 10);
  if (third < 0 || third > 5) return false;
  const coeff = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let p = parseInt(id[i], 10) * coeff[i];
    if (p >= 10) p -= 9;
    sum += p;
  }
  const mod = sum % 10;
  const check = mod === 0 ? 0 : 10 - mod;
  return check === parseInt(id[9], 10);
}

function isValidRuc(ruc: string) {
  if (!/^[0-9]{13}$/.test(ruc)) return false;
  const prov = parseInt(ruc.slice(0, 2), 10);
  if (prov < 1 || prov > 24) return false;
  const third = parseInt(ruc[2], 10);
  if (third >= 0 && third <= 5) {
    const base = ruc.slice(0, 10);
    if (!isValidCedula(base)) return false;
    const suf = parseInt(ruc.slice(10), 10);
    return suf >= 1;
  }
  if (third === 9) {
    const coeff = [4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(ruc[i], 10) * coeff[i];
    const mod = sum % 11;
    const check = mod === 0 ? 0 : 11 - mod;
    if (check !== parseInt(ruc[9], 10)) return false;
    const suf = parseInt(ruc.slice(10), 10);
    return suf >= 1;
  }
  if (third === 6) {
    const coeff = [3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 8; i++) sum += parseInt(ruc[i], 10) * coeff[i];
    const mod = sum % 11;
    const check = mod === 0 ? 0 : 11 - mod;
    if (check !== parseInt(ruc[8], 10)) return false;
    const suf = parseInt(ruc.slice(9), 10);
    return suf >= 1;
  }
  return false;
}
