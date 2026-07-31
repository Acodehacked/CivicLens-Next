// Mirrors db/schema.ts's departmentTypeEnum. Kept as plain strings (rather
// than importing db/schema.ts) so this can be safely imported from Client
// Components without pulling the Drizzle/Postgres schema module into the
// browser bundle.
export const DEPARTMENTS = [
  "roads",
  "sanitation",
  "drainage",
  "disaster_management",
  "parks",
] as const;

export type DepartmentType = (typeof DEPARTMENTS)[number];

export const DEPARTMENT_LABELS: Record<DepartmentType, string> = {
  roads: "Roads",
  sanitation: "Sanitation",
  drainage: "Drainage",
  disaster_management: "Disaster Management",
  parks: "Parks",
};
