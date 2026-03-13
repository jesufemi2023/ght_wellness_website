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
    
    // 1. Check for the comma-separated list (Most reliable for Vercel)
    const csvImages = import.meta.env.VITE_HERO_IMAGES;
    if (csvImages) {
      return csvImages.split(',').map((s: string) => s.trim()).filter((s: string) => s !== "");
    }

    // 2. Explicitly check for numbered variables (Vite requires literal strings)
    const img1 = import.meta.env.VITE_HERO_IMAGE_1;
    const img2 = import.meta.env.VITE_HERO_IMAGE_2;
    const img3 = import.meta.env.VITE_HERO_IMAGE_3;
    const img4 = import.meta.env.VITE_HERO_IMAGE_4;
    const img5 = import.meta.env.VITE_HERO_IMAGE_5;
    const img6 = import.meta.env.VITE_HERO_IMAGE_6;
    const img7 = import.meta.env.VITE_HERO_IMAGE_7;
    const img8 = import.meta.env.VITE_HERO_IMAGE_8;

    if (img1) images.push(img1);
    if (img2) images.push(img2);
    if (img3) images.push(img3);
    if (img4) images.push(img4);
    if (img5) images.push(img5);
    if (img6) images.push(img6);
    if (img7) images.push(img7);
    if (img8) images.push(img8);

    if (images.length > 0) return images;

    // Default placeholders
    return [
      "https://picsum.photos/seed/healthcare-supplement-1/1920/1080",
      "https://picsum.photos/seed/healthcare-supplement-2/1920/1080",
      "https://picsum.photos/seed/healthcare-supplement-3/1920/1080",
      "https://picsum.photos/seed/healthcare-supplement-4/1920/1080",
    ];
  })(),
  navigation: [
    { id: "home", label: "Home" },
    { id: "about", label: "About Us" },
    { id: "products", label: "Products" },
    { id: "recommended", label: "Recommended" },
    { id: "combo", label: "Combo Packs" },
    { id: "blog", label: "Health Blog" },
    { id: "consultation", label: "Consultation" },
    { id: "history", label: "My Records" },
    { id: "admin", label: "Admin" },
  ],
};
