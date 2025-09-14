const descriptions: Record<string, string> = {
  Name: "Full name of the lead",
  Email: "Primary email address",
  Phone: "Phone number",
  Company: "Company name",
  Department: "Department or team",
  "Date Created": "Date when lead was created",
  Enabled: "Whether the lead is active (Yes/No)",
};

export default function getDescription(columnName: string) {
  return descriptions[columnName] || "No description available.";
}
