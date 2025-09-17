export function detectColumnType(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("id")) return "Number";
  if (lower.includes("date")) return "Date";
  if (lower.includes("phone")) return "Phone";
  if (lower.includes("email")) return "Text";
  return "Text";
}
