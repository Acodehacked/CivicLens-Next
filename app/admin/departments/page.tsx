import { getDepartmentPerformance } from "@/lib/data/analytics";
import DepartmentsPage from "@/app/admin/pages/departments/DepartmentsPage";

export default async function DepartmentsRoute() {
  const departments = await getDepartmentPerformance();
  return <DepartmentsPage departments={departments} />;
}
