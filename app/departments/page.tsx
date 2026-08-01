import { eq, sql } from "drizzle-orm";
import { Building2, Mail, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { db } from "@/db/client";
import { departments, complaints } from "@/db/schema";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";

// Live department stats - must be fetched per-request, not baked into the
// static build. See app/community-map/page.tsx for why.
export const dynamic = "force-dynamic";

export default async function DepartmentsPage() {
  const stats = await db
    .select({
      id: departments.id,
      name: departments.name,
      contactEmail: departments.contactEmail,
      avgResolutionHours: departments.avgResolutionHours,
      openCount: sql<number>`count(${complaints.id}) filter (where ${complaints.status} in ('open', 'in_progress'))`.mapWith(Number),
      resolvedCount: sql<number>`count(${complaints.id}) filter (where ${complaints.status} = 'resolved')`.mapWith(Number),
      totalCount: sql<number>`count(${complaints.id})`.mapWith(Number),
    })
    .from(departments)
    .leftJoin(complaints, eq(complaints.department, departments.name))
    .groupBy(departments.id, departments.name, departments.contactEmail, departments.avgResolutionHours);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-sm">
          <Building2 size={16} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-primary tracking-tight">Departments</h1>
      </div>
      <p className="text-sm text-slate-500 font-medium mb-6">
        The municipal departments handling civic reports, and how they're doing right now.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {stats.map((dept) => (
          <div key={dept.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-primary text-base">
                {DEPARTMENT_LABELS[dept.name as DepartmentType] ?? dept.name}
              </h3>
              {dept.contactEmail && (
                <a href={`mailto:${dept.contactEmail}`} className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1">
                  <Mail size={12} /> Contact
                </a>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-border/50">
                <div className="text-base font-black text-slate-900">{dept.totalCount}</div>
                <div className="text-[10px] font-semibold text-slate-400">Total</div>
              </div>
              <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-border/50">
                <div className="text-base font-black text-amber-600 flex items-center justify-center gap-1">
                  <Loader2 size={12} /> {dept.openCount}
                </div>
                <div className="text-[10px] font-semibold text-slate-400">Active</div>
              </div>
              <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-border/50">
                <div className="text-base font-black text-green-600 flex items-center justify-center gap-1">
                  <CheckCircle2 size={12} /> {dept.resolvedCount}
                </div>
                <div className="text-[10px] font-semibold text-slate-400">Resolved</div>
              </div>
            </div>

            {dept.avgResolutionHours != null && (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Clock size={13} />
                Avg. resolution time: <strong className="text-slate-800">{dept.avgResolutionHours}h</strong>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
