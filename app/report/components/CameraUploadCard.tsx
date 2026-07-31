"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, Image as ImageIcon, UploadCloud, RotateCcw, X, AlertTriangle, Check, ZapIcon, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { format } from "date-fns";

export default function CameraUploadCard({ onUploadComplete }: { onUploadComplete: (file: File | null) => void }) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{ size: string; res: string; time: string } | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  // Attach stream to video element whenever stream state updates
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.warn("video.play() failed:", err);
      });
    }
  }, [stream, isCameraOpen]);

  // Start camera with preferred facingMode
  const startCamera = async () => {
    setCameraError(null);
    const tryConstraints = [
      { video: { facingMode: { exact: facingMode } } },
      { video: { facingMode: facingMode } },
      { video: { facingMode: { exact: "environment" } } },
      { video: { facingMode: "user" } },
      { video: true },
    ];

    let mediaStream: MediaStream | null = null;
    for (const constraint of tryConstraints) {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraint);
        break;
      } catch {
        // try next constraint fallback
      }
    }

    if (mediaStream) {
      setIsCameraOpen(true);
      setStream(mediaStream);
    } else {
      setCameraError(
        "Camera access was denied or no camera was found. Please allow permissions in your browser settings, or use the file upload option below."
      );
    }
  };

  // Flip / Switch Camera Angle (Rear <-> Front)
  const switchCamera = async () => {
    const targetMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(targetMode);

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    const tryConstraints = [
      { video: { facingMode: { exact: targetMode } } },
      { video: { facingMode: targetMode } },
      { video: true },
    ];

    let mediaStream: MediaStream | null = null;
    for (const constraint of tryConstraints) {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraint);
        break;
      } catch {
        // try fallback constraint
      }
    }

    if (mediaStream) {
      setStream(mediaStream);
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  }, [stream]);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Flash effect
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 300);

    // Mirror canvas ONLY for front camera (facingMode === "user")
    if (facingMode === "user") {
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    } else {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `capture-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        const url = URL.createObjectURL(blob);
        previewUrlRef.current = url;
        setCapturedFile(file);
        setPreviewUrl(url);
        setMetadata({
          size: (blob.size / (1024 * 1024)).toFixed(1) + " MB",
          res: `${canvas.width} × ${canvas.height}`,
          time: format(new Date(), "h:mm a"),
        });
        onUploadComplete(file);
      },
      "image/jpeg",
      0.92
    );
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    e.target.value = "";
  };

  const processFile = (file: File) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = objectUrl;
      setCapturedFile(file);
      setPreviewUrl(objectUrl);
      setMetadata({
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        res: `${img.width} × ${img.height}`,
        time: format(new Date(), "h:mm a"),
      });
      onUploadComplete(file);
    };
    img.src = objectUrl;
  };

  const resetImage = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setPreviewUrl(null);
    setCapturedFile(null);
    setMetadata(null);
    onUploadComplete(null);
  };

  // Revoke the object URL on unmount so we don't leak memory.
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) processFile(file);
  };

  // Paste support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) processFile(file);
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
      <canvas ref={canvasRef} className="hidden" />

      <AnimatePresence mode="wait">
        {/* ── IDLE STATE ── */}
        {!capturedFile && !isCameraOpen && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "relative flex flex-col items-center justify-center text-center p-6 sm:p-10 min-h-[320px] sm:min-h-[340px] border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer select-none",
              isDragging
                ? "border-accent bg-blue-50/60 scale-[1.01]"
                : "border-border bg-slate-50/50 hover:border-slate-300 hover:bg-white"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            ref={containerRef}
          >
            {/* Icon */}
            <div className={cn(
              "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 shadow-sm border transition-colors",
              isDragging ? "bg-accent text-white border-accent" : "bg-white text-accent border-border"
            )}>
              <Camera size={28} strokeWidth={1.5} />
            </div>

            <h3 className="text-base font-bold text-primary mb-1.5">
              {isDragging ? "Drop your image here" : "Capture or Upload Evidence"}
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-muted mb-6 sm:mb-7 max-w-xs leading-relaxed">
              Take a photo with your camera or drag & drop an image file. A clear, well-lit photo helps the AI classify the issue accurately.
            </p>

            {cameraError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 flex items-start gap-3 max-w-sm text-left w-full"
              >
                <AlertTriangle className="shrink-0 mt-0.5" size={16} />
                <span>{cameraError}</span>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={startCamera}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-[#1D4ED8] active:scale-[0.97] transition-all"
              >
                <Camera size={17} />
                Open Camera
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary border border-border rounded-xl text-sm font-semibold shadow-sm hover:bg-slate-50 active:scale-[0.97] transition-all"
              >
                <UploadCloud size={17} />
                Browse Files
              </button>
            </div>

            <p className="mt-5 sm:mt-6 text-[10px] sm:text-xs text-on-surface-muted/60 font-medium">
              Drag & drop · Paste (Ctrl+V) · JPG, PNG, WEBP up to 25 MB
            </p>
          </motion.div>
        )}

        {/* ── ACTIVE CAMERA VIEW ── */}
        {isCameraOpen && (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full bg-black rounded-2xl overflow-hidden"
            style={{ minHeight: 380 }}
          >
            {/* Flash overlay */}
            <AnimatePresence>
              {isFlashing && (
                <motion.div
                  key="flash"
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-white z-30 pointer-events-none"
                />
              )}
            </AnimatePresence>

            <video
              ref={(node) => {
                (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = node;
                if (node && stream) {
                  node.srcObject = stream;
                  node.play().catch((e) => console.warn("play():", e));
                }
              }}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{
                minHeight: 340,
                transform: facingMode === "user" ? "scaleX(-1)" : "none",
              }}
            />

            {/* Framing guide */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-48 sm:w-56 h-48 sm:h-56">
                {["tl","tr","bl","br"].map((corner) => (
                  <div
                    key={corner}
                    className={cn(
                      "absolute w-6 h-6 border-white",
                      corner === "tl" && "top-0 left-0 border-t-2 border-l-2 rounded-tl",
                      corner === "tr" && "top-0 right-0 border-t-2 border-r-2 rounded-tr",
                      corner === "bl" && "bottom-0 left-0 border-b-2 border-l-2 rounded-bl",
                      corner === "br" && "bottom-0 right-0 border-b-2 border-r-2 rounded-br",
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Camera badge & Facing Mode indicator */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-xs font-bold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md">
                  LIVE CAMERA
                </span>
              </div>
              <span className="text-white/80 text-[10px] font-bold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md uppercase tracking-wider">
                {facingMode === "environment" ? "Rear Camera" : "Front Camera"}
              </span>
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 pb-6 pt-16 flex items-center justify-center gap-4 sm:gap-8 bg-gradient-to-t from-black/80 to-transparent px-4">
              {/* Close */}
              <button
                onClick={stopCamera}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-white/25 active:scale-95 transition-all shrink-0"
                title="Cancel"
              >
                <X size={20} />
              </button>

              {/* Capture shutter button */}
              <button
                onClick={capturePhoto}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/15 backdrop-blur-md border-[4px] sm:border-[5px] border-white flex items-center justify-center hover:bg-white/25 hover:scale-105 active:scale-95 transition-all shadow-xl shrink-0"
                title="Take Photo"
              >
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white" />
              </button>

              {/* Flip Camera Angle button */}
              <button
                onClick={switchCamera}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-white/25 active:scale-95 transition-all shrink-0"
                title="Flip Camera Angle (Front/Rear)"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── CAPTURED IMAGE STATE ── */}
        {capturedFile && previewUrl && (
          <motion.div
            key="captured"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 sm:p-5 flex flex-col gap-4"
          >
            <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-black/5 group">
              <img
                src={previewUrl}
                alt="Captured Evidence"
                className="w-full h-full object-cover"
              />
              <button
                onClick={resetImage}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-105 active:scale-95 transition-all"
                title="Remove Image"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-3 left-3 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                <Check size={14} /> Photo Attached
              </div>
            </div>

            {/* Metadata Bar */}
            {metadata && (
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl text-xs text-on-surface-muted font-medium border border-border">
                <div className="flex items-center gap-3">
                  <span>Size: <strong className="text-primary">{metadata.size}</strong></span>
                  <span>Res: <strong className="text-primary">{metadata.res}</strong></span>
                </div>
                <span>Captured: <strong className="text-primary">{metadata.time}</strong></span>
              </div>
            )}

            {/* Retake / Replace Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={startCamera}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-primary rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-200 active:scale-[0.98] transition-all"
              >
                <RotateCcw size={15} /> Retake Photo
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-primary rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-200 active:scale-[0.98] transition-all"
              >
                <UploadCloud size={15} /> Change File
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
