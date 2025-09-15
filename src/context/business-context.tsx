"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface BusinessInfo {
  name: string;
  address: string;
  ruc: string;
  phone: string;
  email: string;
  logo?: string;
}

interface BusinessContextType {
  businessInfo: BusinessInfo;
  setBusinessInfo: (info: BusinessInfo) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined
);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: "Farmacia Salud Total",
    address: "Av. Principal #123, Ciudad",
    ruc: "20100066603",
    phone: "+51 123 456 789",
    email: "ventas@farmaciasaludtotal.com",
  });

  // Cargar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("business-info");
    if (saved) {
      setBusinessInfo(JSON.parse(saved));
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("business-info", JSON.stringify(businessInfo));
  }, [businessInfo]);

  return (
    <BusinessContext.Provider value={{ businessInfo, setBusinessInfo }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
}
