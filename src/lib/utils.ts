import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizeString = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

// Validaciones de Ecuador
export function isValidCedula(id: string) {
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

export function isValidRuc(ruc: string) {
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

export function isValidEcuadorDocument(input: string) {
  const s = input.replace(/[^0-9]/g, "");
  if (s.length === 10) return isValidCedula(s);
  if (s.length === 13) return isValidRuc(s);
  return false;
}

// Formateadores
export const formatEcPhone = (v: string) => {
  const s = v.replace(/[^0-9+]/g, "");
  if (s.startsWith("+593")) return "+593 " + s.slice(4).replace(/\s+/g, "");
  return s;
};

export const formatEcDocument = (v: string) => {
  const s = v.replace(/\D/g, "");
  if (s.length <= 10) return s.slice(0, 10);
  return s.slice(0, 13);
};

export const getDefaultImageForName = (name: string) => {
  const key = (name || "").toLowerCase();
  if (key.includes("paracetamol")) return "/Paracetamol 500mg.png";
  if (key.includes("ibuprofeno")) return "/ofeno 400mg.jpg";
  if (key.includes("amoxicilina")) return "/Amoxicilina 250mg.jpg";
  if (key.includes("omeprazol")) return "/Omeprazol 20mg.png";
  if (key.includes("loratadina")) return "/Loratadina 10mg.png";
  if (key.includes("cetirizina")) return "/Cetirizina 10mg.png";
  // Fallbacks para otros comunes (si se agregan las imágenes después)
  if (key.includes("insulina")) return "/insulina nph.jpg";
  if (key.includes("azitromicina")) return "/azitromicina 500mg.jpg";
  
  return `https://picsum.photos/seed/${encodeURIComponent(name || "med")}/200`;
};
