export function normalizeWhatsAppNumber(value: string | undefined): string {
  const digits = (value || "").replace(/\D/g, "");

  if (!digits) return "";

  // The Sizal HD business operates in India. If Settings contains a
  // normal 10-digit Indian mobile number, automatically add +91.
  if (digits.length === 10) return `91${digits}`;

  if (digits.length === 12 && digits.startsWith("91")) return digits;

  return digits;
}

export function getWhatsAppUrl(
  whatsappNumber?: string,
  whatsappUrl?: string
): string {
  const explicitUrl = (whatsappUrl || "").trim();
  if (explicitUrl) return explicitUrl;

  const number = normalizeWhatsAppNumber(whatsappNumber);
  return number ? `https://wa.me/${number}` : "";
}
