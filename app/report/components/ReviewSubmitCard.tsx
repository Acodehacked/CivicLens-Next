"use client";

import { CheckCircle2, MapPin, Building, Activity, FileText } from "lucide-react";

export default function ReviewSubmitCard({
  locationCoords,
}: {
  locationCoords?: { lat: number; lng: number } | null;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-6 mb-24 lg:mb-6">
      <h3 className="font-bold text-primary text-lg mb-6 flex items-center gap-2">
        <CheckCircle2 className="text-success" />
        Review Submission
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Activity size={14} /> AI Classification
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-primary">Large Pothole</div>
                <div className="text-xs text-slate-500">Confidence: 98%</div>
              </div>
              <div className="px-3 py-1 bg-orange-100 text-orange-700 font-bold rounded-lg text-xs">
                High Priority
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <MapPin size={14} /> Location Confirmed
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-semibold text-primary">
                {locationCoords
                  ? `${locationCoords.lat.toFixed(4)}, ${locationCoords.lng.toFixed(4)}`
                  : "10.8505, 76.2711"}
              </div>
              <div className="text-xs text-slate-500 mt-1">Accuracy within 10 meters</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Building size={14} /> Routing Destination
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-bold text-primary">Public Works</div>
              <div className="text-xs text-slate-500 mt-1">Road Maintenance Division</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText size={14} /> Visibility & Tracking
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-semibold text-primary">Publicly Visible</div>
              <div className="text-xs text-slate-500 mt-1">Est. Resolution: 3-5 Business Days</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
