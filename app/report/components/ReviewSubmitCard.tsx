"use client";

import { CheckCircle2, MapPin, Building, Activity, FileText, Sparkles } from "lucide-react";

export default function ReviewSubmitCard({
  locationCoords,
}: {
  locationCoords?: { lat: number; lng: number } | null;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-4 sm:p-6 mb-24 lg:mb-6">
      <h3 className="font-bold text-primary text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-2">
        <CheckCircle2 className="text-green-600" size={20} />
        Review Your Submission
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Activity size={13} /> AI Classification
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-primary text-sm sm:text-base">Pothole Hazard</div>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Sparkles size={11} className="text-purple-600" /> AI Confidence: 98%
                </div>
              </div>
              <div className="px-2.5 py-1 bg-red-50 text-red-700 font-extrabold rounded-lg text-xs border border-red-100">
                High Priority
              </div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin size={13} /> Location Coordinates
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-bold text-primary font-mono text-xs sm:text-sm">
                {locationCoords
                  ? `${locationCoords.lat.toFixed(4)}, ${locationCoords.lng.toFixed(4)}`
                  : "10.8505, 76.2711"}
              </div>
              <div className="text-xs text-slate-500 mt-1">GPS Accuracy within 10 meters</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Building size={13} /> Official Routing Destination
            </div>
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
              <div className="font-bold text-[#2563EB] text-sm sm:text-base">Road Maintenance Department</div>
              <div className="text-xs text-blue-700/80 mt-0.5 font-medium">Asphalt Repair & Pothole Patching Division</div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText size={13} /> Submission Status
            </div>
            <div className="p-3.5 bg-green-50/60 rounded-xl border border-green-100 text-xs font-semibold text-green-800">
              Ready for immediate municipal dispatch upon submission.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
