export type LeadField =
  | "website"
  | "twitter"
  | "facebook"
  | "linkedIn"
  | "youtube"
  | "telegram"
  | "leadSourceId"
  | "firstName"
  | "lastName"
  | "middleName"
  | "email"
  | "leadCategory"
  | "phone"
  | "accountableManagerId";

export interface LeadColumnInfo {
  columnName: string;
  mappedField?: LeadField;
  required: boolean;
  type: string;
  status: "Detected" | "Not Detected";
  description: string;
}
