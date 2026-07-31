"use client";

import { useState } from "react";
import { UploadCloud, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export default function UploadCard({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    simulateUpload();
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploaded(true);
      onUploadComplete();
    }, 1500); // 1.5s simulated upload
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-1">
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed rounded-xl transition-colors duration-300 p-8",
          isDragging ? "border-accent bg-accent-light" : "border-border bg-surface-muted/30 hover:bg-surface-muted"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="wait">
          {!uploaded && !isUploading && (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-border flex items-center justify-center text-accent mb-6">
                <UploadCloud size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Drag & Drop Image</h3>
              <p className="text-sm text-on-surface-muted mb-6 max-w-sm">
                Upload clear photos of the issue to allow CivicAI to accurately assess the severity.
              </p>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={simulateUpload}
                  className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-primary-hover active:scale-[0.98] transition-all"
                >
                  Browse Files
                </button>
                <button className="px-5 py-2.5 bg-white text-primary border border-border rounded-lg text-sm font-semibold shadow-sm hover:bg-surface-muted active:scale-[0.98] transition-all">
                  Use Camera
                </button>
              </div>

              <div className="mt-8 text-xs font-medium text-on-surface-muted/70 flex items-center gap-4">
                <span>JPG, PNG, HEIC, WEBP</span>
                <div className="w-1 h-1 rounded-full bg-border" />
                <span>Max 20MB</span>
              </div>
            </motion.div>
          )}

          {isUploading && (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
              <span className="text-sm font-semibold text-primary">Processing with CivicAI...</span>
            </motion.div>
          )}

          {uploaded && (
            <motion.div 
              key="uploaded"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex items-center gap-6 p-2"
            >
              <div className="relative w-32 h-32 rounded-lg border border-border/50 overflow-hidden shrink-0 bg-border-light flex items-center justify-center">
                {/* Mock Image using a placeholder styling */}
                <ImageIcon className="w-8 h-8 text-on-surface-muted/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-primary">IMG_4829_pothole.heic</h4>
                    <span className="text-xs text-on-surface-muted">4.2 MB • 4032 × 3024</span>
                  </div>
                  <button 
                    onClick={() => setUploaded(false)}
                    className="p-1.5 rounded-md hover:bg-border-light text-on-surface-muted transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-2 bg-success/20 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-success" />
                  </div>
                  <span className="text-xs font-bold text-success">Complete</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors">
                    Replace
                  </button>
                  <button 
                    onClick={() => setUploaded(false)}
                    className="text-xs font-semibold text-error hover:text-error/80 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
