export const PROFESSIONS = [
  "Student",
  "Government Employee",
  "Private Sector Employee",
  "Self-Employed / Business Owner",
  "Homemaker",
  "Retired",
  "Unemployed",
  "Other",
] as const;

export type Profession = (typeof PROFESSIONS)[number];
