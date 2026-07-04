export type LeadStatus = "new" | "contacted" | "converted";
export type LeadSource = "website" | "referral" | "social" | "email" | "phone" | "other";

export const STATUS_OPTIONS: LeadStatus[] = ["new", "contacted", "converted"];
export const SOURCE_OPTIONS: LeadSource[] = ["website", "referral", "social", "email", "phone", "other"];

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted",
};

export const SOURCE_LABEL: Record<LeadSource, string> = {
  website: "Website",
  referral: "Referral",
  social: "Social",
  email: "Email",
  phone: "Phone",
  other: "Other",
};

export function statusBadgeClass(status: LeadStatus) {
  switch (status) {
    case "new":
      return "bg-[oklch(0.93_0.04_240)] text-[oklch(0.35_0.12_245)]";
    case "contacted":
      return "bg-[oklch(0.94_0.06_80)] text-[oklch(0.38_0.12_60)]";
    case "converted":
      return "bg-[oklch(0.92_0.07_155)] text-[oklch(0.35_0.12_155)]";
  }
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
