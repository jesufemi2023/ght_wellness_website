/**
 * Centralized configuration for the application.
 * No hardcoded strings should exist outside of this file or environment variables.
 */

export const CONFIG = {
  company: {
    name: import.meta.env.VITE_COMPANY_NAME || "SD GHT HEALTH CARE",
    subtitle: import.meta.env.VITE_COMPANY_SUBTITLE || "NIGERIA LTD",
    phone: import.meta.env.VITE_CONTACT_PHONE || "+234 (0) 123 456 789",
    logoUrl: import.meta.env.VITE_LOGO_URL || "",
    bankDetails: {
      bankName: import.meta.env.VITE_BANK_NAME || "ZENITH BANK",
      accountNumber: import.meta.env.VITE_ACCOUNT_NUMBER || "1234567890",
      accountName: import.meta.env.VITE_ACCOUNT_NAME || "SD GHT HEALTH CARE LTD"
    }
  },
  whatsapp: {
    number: import.meta.env.VITE_WHATSAPP_NUMBER || "2347060734773",
    defaultMessage: import.meta.env.VITE_WHATSAPP_DEFAULT_MESSAGE || "Hello SD GHT Health Care, I would like to make an inquiry."
  },
  defaults: {
    distributorId: import.meta.env.VITE_DEFAULT_DISTRIBUTOR_ID || "SD-GHT-MEMBER-001",
  },
  navigation: [
    { id: "home", label: "Home" },
    { id: "products", label: "Products" },
    { id: "recommended", label: "Recommended" },
    { id: "combo", label: "Combo Packs" },
    { id: "blog", label: "Health Blog" },
    { id: "consultation", label: "Consultation" },
    { id: "history", label: "My Records" },
    { id: "admin", label: "Admin" },
  ],
};
