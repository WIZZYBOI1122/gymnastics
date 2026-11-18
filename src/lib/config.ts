// Deployment-specific values come from environment variables so they can be
// changed without touching code. Defaults match the original static site.

export const studio = {
  location: "Beach Junction, UNN, Enugu State",
  phoneDisplay: process.env.STUDIO_PHONE_DISPLAY ?? "+234 814 002 8555",
  phoneTel: process.env.STUDIO_PHONE_TEL ?? "+2348140028555",
  email: process.env.STUDIO_EMAIL ?? "nsowisdom408@gmail.com",
};

export const bank = {
  name: process.env.BANK_NAME ?? "OPAY",
  accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? "8167260937",
  accountName: process.env.BANK_ACCOUNT_NAME ?? "Wisdom Nso",
};

export const RECEIPTS_DIR = process.env.RECEIPTS_DIR ?? "./storage/receipts";
