import { FieldType } from "../types";

const dateRegex = /^(?:\d{4}-\d{2}-\d{2})|(?:\d{2}\/\d{2}\/\d{4})$/;
const phoneRegex = /\+?\d[\d\-\s()]{6,}/;

export default function detectColumnType(values: any[]): FieldType {
  // возьмём первые 20 непустых значений
  const sample = values
    .filter((v) => v !== null && v !== undefined && String(v).trim() !== "")
    .slice(0, 20);
  if (!sample.length) return "Unknown";

  let numCount = 0;
  let dateCount = 0;
  let boolCount = 0;

  for (const v of sample) {
    const s = String(v).trim();
    if (s === "") continue;
    if (/^(yes|no|true|false)$/i.test(s)) boolCount++;
    if (!isNaN(Number(s))) numCount++;
    if (dateRegex.test(s)) dateCount++;
  }

  if (dateCount / sample.length > 0.6) return "Date";
  if (boolCount / sample.length > 0.6) return "Boolean";
  if (numCount / sample.length > 0.8) return "Number";
  return "Text";
}
