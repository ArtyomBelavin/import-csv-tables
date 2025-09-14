export type FieldType = "Number" | "Text" | "Date" | "Boolean" | "Unknown";

export interface LeadColumnInfo {
  name: string;
  type: FieldType;
  status: "Detected" | "Not Detected" | "Optional";
  description: string;
}
