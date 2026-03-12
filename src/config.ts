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
  heroImages: (() => {
    const images: string[] = [];
    const csvImages = import.meta.env.VITE_HERO_IMAGES;
    
    if (csvImages) {
      return csvImages.split(',').map((s: string) => s.trim()).filter((s: string) => s !== "");
    }

    // Fallback to numbered variables VITE_HERO_IMAGE_1, VITE_HERO_IMAGE_2, etc.
    // We check up to 20 as a reasonable limit for this method
    for (let i = 1; i <= 20; i++) {
      const img = import.meta.env[`VITE_HERO_IMAGE_${i}`];
      if (img) images.push(img);
    }

    if (images.length > 0) return images;

    // Default placeholders if no environment variables are set
    return [
      "https://picsum.photos/seed/healthcare-supplement-1/1920/1080",
      "https://picsum.photos/seed/healthcare-supplement-2/1920/1080",
      "https://picsum.photos/seed/healthcare-supplement-3/1920/1080",
      "https://picsum.photos/seed/healthcare-supplement-4/1920/1080",
    ];
  })(),
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
