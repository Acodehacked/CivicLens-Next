"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, Image as ImageIcon, UploadCloud, RotateCcw, X, AlertTriangle, Check, ZapIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { format } from "date-fns";

export default function CameraUploadCard({ onUploadComplete }: { onUploadComplete: (hasImage: boolean) => void }) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{ size: string; res: string; time: string } | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Attach stream to video element whenever the stream state updates.
  // This is necessary because AnimatePresence renders the <video> *after*
  // the stream is stored in state, so a setTimeout is unreliable.
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.warn("video.play() failed:", err);
      });
    }
  }, [stream, isCameraOpen]); // re-run when isCameraOpen flips true (video node mounts)

  // On desktop the webcam has no 'environment' facing mode — trying it causes
  // OverconstrainedError. We use a graceful fallback chain:
  // 1. Rear camera (mobile), 2. Any camera (laptop / tablet)
  const startCamera = async () => {
    setCameraError(null);
    const tryConstraints = [
      { video: { facingMode: { exact: "environment" } } }, // rear camera on phones
      { video: { facingMode: "user" } },                  // front camera
      { video: true },                                     // any camera (laptops)
    ];

    let mediaStream: MediaStream | null = null;
    for (const constraint of tryConstraints) {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraint);
        break;
      } catch {
        // try next constraint
      }
    }

    if (mediaStream) {
      setIsCameraOpen(true); // render the <video> element first
      setStream(mediaStream); // then useEffect above will attach the stream
    } else {
      setCameraError(
        "Camera access was denied or no camera was found. Please allow permissions in your browser settings, or use the file upload option below."
      );
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

    // Flip canvas horizontally to correct front-camera mirror effect
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    const imageUrl = canvas.toDataURL("image/jpeg", 0.92);
    const bytes = Math.round((imageUrl.length * 3) / 4);

    setCapturedImage(imageUrl);
    setMetadata({
      size: (bytes / (1024 * 1024)).toFixed(1) + " MB",
      res: `${canvas.width} × ${canvas.height}`,
      time: format(new Date(), "h:mm a"),
    });
    stopCamera();
    onUploadComplete(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) return;
      const img = new Image();
      img.onload = () => {
        setCapturedImage(result);
        setMetadata({
          size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
          res: `${img.width} × ${img.height}`,
          time: format(new Date(), "h:mm a"),
        });
        onUploadComplete(true);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const resetImage = () => {
    setCapturedImage(null);
    setMetadata(null);
    onUploadComplete(false);
  };

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
        {!capturedImage && !isCameraOpen && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "relative flex flex-col items-center justify-center text-center p-10 min-h-[340px] border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer select-none",
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
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-sm border transition-colors",
              isDragging ? "bg-accent text-white border-accent" : "bg-white text-accent border-border"
            )}>
              <Camera size={30} strokeWidth={1.5} />
            </div>

            <h3 className="text-base font-bold text-primary mb-1.5">
              {isDragging ? "Drop your image here" : "Capture or Upload Evidence"}
            </h3>
            <p className="text-sm text-on-surface-muted mb-7 max-w-xs leading-relaxed">
              Take a photo with your camera or drag & drop an image file. A clear, well-lit photo helps the AI classify the issue accurately.
            </p>

            {cameraError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-3 max-w-sm text-left w-full"
              >
                <AlertTriangle className="shrink-0 mt-0.5" size={16} />
                <span>{cameraError}</span>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={startCamera}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-blue-700 active:scale-[0.97] transition-all"
              >
                <Camera size={17} />
                Open Camera
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-primary border border-border rounded-xl text-sm font-semibold shadow-sm hover:bg-slate-50 active:scale-[0.97] transition-all"
              >
                <UploadCloud size={17} />
                Browse Files
              </button>
            </div>

            <p className="mt-6 text-xs text-on-surface-muted/60 font-medium">
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
                // Assign ref AND immediately attach stream when node is created
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
              style={{ minHeight: 320, transform: "scaleX(-1)" }}
            />

            {/* Framing guide */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-56 h-56">
                {/* Corner marks */}
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

            {/* Camera label */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white text-xs font-bold bg-black/40 backdrop-blur-md px-2 py-1 rounded-md">
                LIVE
              </span>
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 pb-6 pt-16 flex items-end justify-center gap-8 bg-gradient-to-t from-black/70 to-transparent">
              {/* Close */}
              <button
                onClick={stopCamera}
                className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-white/25 active:scale-95 transition-all"
                title="Cancel"
              >
                <X size={20} />
              </button>

              {/* Capture shutter */}
              <button
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-md border-[5px] border-white flex items-center justify-center hover:bg-white/25 hover:scale-105 active:scale-95 transition-all shadow-xl"
                title="Take Photo"
              >
                <div className="w-14 h-14 rounded-full bg-white" />
              </button>

              {/* Upload instead */}
              <button
                onClick={() => { stopCamera(); fileInputRef.current?.click(); }}
                className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-white/25 active:scale-95 transition-all"
                title="Upload File"
              >
                <ImageIcon size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── PREVIEW STATE ── */}
        {capturedImage && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl overflow-hidden"
          >
            {/* Image */}
            <div className="relative group">
              <img
                src={capturedImage}
                alt="Captured Evidence"
                className="w-full object-cover max-h-[380px]"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md text-white text-xs font-semibold hover:bg-black/60 transition-colors"
                  >
                    <RotateCcw size={14} /> Retake
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md text-white text-xs font-semibold hover:bg-black/60 transition-colors"
                  >
                    <UploadCloud size={14} /> Replace
                  </button>
                  <button
                    onClick={resetImage}
                    className="p-1.5 rounded-lg bg-red-500/70 backdrop-blur-md text-white hover:bg-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Metadata bar */}
            <div className="bg-white px-5 py-3 border-t border-border flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-bold text-primary">Image Ready for Analysis</span>
              </div>
              {metadata && (
                <div className="flex items-center gap-3 text-xs font-medium text-on-surface-muted">
                  <span>{metadata.res}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>{metadata.size}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>{metadata.time}</span>
                  <button onClick={resetImage} className="ml-2 text-red-400 hover:text-red-600 transition-colors font-semibold">
                    Remove
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
