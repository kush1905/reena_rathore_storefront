/** Ordered product-detail fields shown on the PDP (admin-editable attributes). */
export const DETAIL_FIELD_KEYS = [
  "Style Number",
  "Availability",
  "Production note",
  "Measurements",
  "Content",
  "No. of Components",
  "Wash Care",
  "Country of Origin",
  "Manufacturer",
  "Set Includes",
  "Fabric",
  "Pattern",
  "Occasion",
  "Fit",
  "Sleeve",
  "Neck",
  "Material",
] as const;

export const DEFAULT_MANUFACTURER =
  "Reena Rathore Atelier Private Limited, Mehrauli Flagship, New Delhi 110030, India";

export function attr(product: { attributes: Record<string, string>; sku: string }, key: string) {
  const value = product.attributes[key]?.trim();
  if (value) return value;
  if (key === "Wash Care") return product.attributes.Care?.trim() || "";
  if (key === "Style Number") return product.sku;
  return "";
}

export function isReadyToShip(product: { attributes: Record<string, string> }) {
  const a = (product.attributes.Availability || "").toLowerCase();
  if (a.includes("made to order") || a.includes("made-to-order")) return false;
  if (a.includes("ready")) return true;
  return true;
}

export function detailRows(product: { attributes: Record<string, string>; sku: string }) {
  const rows: { label: string; value: string }[] = [];
  const seen = new Set<string>();
  for (const key of DETAIL_FIELD_KEYS) {
    if (key === "Availability" || key === "Production note") continue;
    const value = attr(product, key);
    if (!value) continue;
    rows.push({ label: key, value });
    seen.add(key);
  }
  for (const [key, value] of Object.entries(product.attributes)) {
    if (seen.has(key) || key === "Care" || key === "Availability" || key === "Production note") continue;
    if (!value?.trim()) continue;
    if ((DETAIL_FIELD_KEYS as readonly string[]).includes(key)) continue;
    rows.push({ label: key, value: value.trim() });
  }
  return rows;
}
