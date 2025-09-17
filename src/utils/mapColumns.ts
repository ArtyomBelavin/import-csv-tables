import type { LeadField, LeadColumnInfo } from "../types";
import { REQUIRED_FIELDS } from "./requiredFields";
import { columnDescriptions } from "./columnDescriptions";
import { detectColumnType } from "./detectColumnType";

const fieldMap: Record<string, LeadField> = {
  website: "website",
  twitter: "twitter",
  facebook: "facebook",
  linkedin: "linkedIn",
  youtube: "youtube",
  telegram: "telegram",
  leadsourceid: "leadSourceId",
  firstname: "firstName",
  lastname: "lastName",
  middlename: "middleName",
  email: "email",
  leadcategory: "leadCategory",
  phone: "phone",
  accountablemanagerid: "accountableManagerId",
  name: "firstName",
};

export function mapColumns(headers: string[]): LeadColumnInfo[] {
  return headers.map((col) => {
    const normalized = col.toLowerCase().replace(/\s+/g, "");
    const mappedField = fieldMap[normalized];
    const required = mappedField
      ? REQUIRED_FIELDS.includes(mappedField)
      : false;
    return {
      columnName: col,
      mappedField,
      required,
      type: detectColumnType(col),
      status: mappedField ? "Detected" : "Not Detected",
      description: mappedField
        ? columnDescriptions[mappedField]
        : "Unknown column",
    };
  });
}
