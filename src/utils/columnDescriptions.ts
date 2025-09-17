import type { LeadField } from "../types";

export const columnDescriptions: Record<LeadField, string> = {
  website: "Website URL of the lead",
  twitter: "Twitter profile link",
  facebook: "Facebook profile link",
  linkedIn: "LinkedIn profile link",
  youtube: "YouTube channel link",
  telegram: "Telegram username or link",
  leadSourceId: "Lead source identifier",
  firstName: "First name of the lead",
  lastName: "Last name of the lead",
  middleName: "Middle name of the lead",
  email: "Email address of the lead",
  leadCategory: "Category identifier",
  phone: "Phone number",
  accountableManagerId: "Assigned manager ID",
};
