import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center py-24 text-slate-400">
      <Loader2 size={24} className="animate-spin" />
    </div>
  );
}
