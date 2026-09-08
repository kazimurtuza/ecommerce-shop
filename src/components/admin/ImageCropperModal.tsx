"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

export type AspectRatioType = "1:1" | "3:4" | "4:5" | "16:9" | "free";

export interface AspectRatioOption {
  id: AspectRatioType;
  label: string;
  sublabel: string;
  ratio: number | null; // width / height
  defaultOutputWidth: number;
  defaultOutputHeight: number;
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  {
    id: "1:1",
    label: "1:1 Square",
    sublabel: "600 × 600 px (Product Grid)",
    ratio: 1,
    defaultOutputWidth: 600,
    defaultOutputHeight: 600,
  },
  {
    id: "3:4",
    label: "3:4 Apparel",
    sublabel: "600 × 800 px (Fashion / Kurti / Shirt)",
    ratio: 3 / 4,
    defaultOutputWidth: 600,
    defaultOutputHeight: 800,
  },
  {
    id: "4:5",
    label: "4:5 Catalog",
    sublabel: "800 × 1000 px (Lookbook / Catalog)",
    ratio: 4 / 5,
    defaultOutputWidth: 800,
    defaultOutputHeight: 1000,
  },
  {
    id: "16:9",
    label: "16:9 Banner",
    sublabel: "1200 × 675 px (Wide / Lifestyle)",
    ratio: 16 / 9,
    defaultOutputWidth: 1200,
    defaultOutputHeight: 675,
  },
  {
    id: "free",
    label: "Freeform",
    sublabel: "Custom Size & Framing",
    ratio: null,
    defaultOutputWidth: 800,
    defaultOutputHeight: 800,
  },
];

interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  initialRatio?: AspectRatioType;
  onCropComplete: (croppedDataUrl: string) => void;
  title?: string;
}

export default function ImageCropperModal({
  isOpen,
  onClose,
  imageUrl,
  initialRatio = "3:4",
  onCropComplete,
  title = "Crop & Adjust Image",
}: ImageCropperModalProps) {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioType>(initialRatio);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Container & Image metrics
  const containerRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);
  const [displayedImgRect, setDisplayedImgRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({ x: 0, y: 0, width: 0, height: 0 });

  // Crop box in container pixel coordinates
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, width: 0, height: 0 });

  // Dragging state
  const isDraggingRef = useRef<boolean>(false);
  const dragTypeRef = useRef<"move" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | null>(null);
  const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartCropRef = useRef<CropRect>({ x: 0, y: 0, width: 0, height: 0 });

  // Live preview canvas
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate initial crop box based on aspect ratio
  const calculateInitialCrop = useCallback(
    (img: HTMLImageElement, ratioType: AspectRatioType, currentZoom: number) => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const cWidth = container.clientWidth || 500;
      const cHeight = container.clientHeight || 420;

      // Calculate displayed image dimensions inside container
      const natW = img.naturalWidth || 600;
      const natH = img.naturalHeight || 600;
      const imgAspect = natW / natH;
      const containerAspect = cWidth / cHeight;

      let dispW = 0;
      let dispH = 0;

      if (imgAspect > containerAspect) {
        dispW = cWidth * 0.95;
        dispH = dispW / imgAspect;
      } else {
        dispH = cHeight * 0.92;
        dispW = dispH * imgAspect;
      }

      const dispX = (cWidth - dispW) / 2;
      const dispY = (cHeight - dispH) / 2;

      setDisplayedImgRect({
        x: dispX,
        y: dispY,
        width: dispW,
        height: dispH,
      });

      // Now determine crop box based on selected ratio
      const ratioOption = ASPECT_RATIOS.find((r) => r.id === ratioType);
      const targetRatio = ratioOption?.ratio;

      let cropW = 0;
      let cropH = 0;

      if (!targetRatio) {
        // Freeform: 85% of image
        cropW = dispW * 0.85;
        cropH = dispH * 0.85;
      } else {
        if (targetRatio > dispW / dispH) {
          cropW = dispW * 0.9;
          cropH = cropW / targetRatio;
          if (cropH > dispH) {
            cropH = dispH * 0.9;
            cropW = cropH * targetRatio;
          }
        } else {
          cropH = dispH * 0.9;
          cropW = cropH * targetRatio;
          if (cropW > dispW) {
            cropW = dispW * 0.9;
            cropH = cropW / targetRatio;
          }
        }
      }

      const cropX = dispX + (dispW - cropW) / 2;
      const cropY = dispY + (dispH - cropH) / 2;

      setCrop({
        x: Math.max(dispX, cropX),
        y: Math.max(dispY, cropY),
        width: Math.min(dispW, cropW),
        height: Math.min(dispH, cropH),
      });
    },
    []
  );

  // Handle image load or cached image
  const initImageCrop = useCallback(
    (img: HTMLImageElement) => {
      imageElementRef.current = img;
      setImageLoaded(true);
      setImageError(null);
      // Wait a tick for container ref to have accurate bounding rect
      setTimeout(() => {
        calculateInitialCrop(img, selectedRatio, zoom);
      }, 50);
    },
    [calculateInitialCrop, selectedRatio, zoom]
  );

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    initImageCrop(e.currentTarget);
  };

  const handleImageError = () => {
    setImageError("Failed to load image. Please try uploading a file directly.");
    setImageLoaded(false);
  };

  const onImgRef = useCallback(
    (img: HTMLImageElement | null) => {
      if (img) {
        imageElementRef.current = img;
        if (img.complete && img.naturalWidth > 0) {
          initImageCrop(img);
        }
      }
    },
    [initImageCrop]
  );

  // Reset state when modal opens or image changes
  useEffect(() => {
    if (isOpen) {
      setSelectedRatio(initialRatio);
      setZoom(1);
      setRotation(0);
      setFlipH(false);
      setImageLoaded(false);
      setImageError(null);
    }
  }, [isOpen, imageUrl, initialRatio]);

  // Recalculate when aspect ratio changes
  const handleSelectRatio = (ratioId: AspectRatioType) => {
    setSelectedRatio(ratioId);
    if (imageElementRef.current) {
      calculateInitialCrop(imageElementRef.current, ratioId, zoom);
    }
  };

  // Re-fit on window resize
  useEffect(() => {
    const handleResize = () => {
      if (imageElementRef.current && imageLoaded) {
        calculateInitialCrop(imageElementRef.current, selectedRatio, zoom);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateInitialCrop, selectedRatio, zoom, imageLoaded]);

  // Update Live Preview Canvas
  useEffect(() => {
    if (!imageLoaded || !imageElementRef.current || !previewCanvasRef.current || crop.width <= 0) {
      return;
    }

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imageElementRef.current;
    const ratioOption = ASPECT_RATIOS.find((r) => r.id === selectedRatio);
    const targetW = ratioOption?.defaultOutputWidth || Math.round(crop.width * 2);
    const targetH = ratioOption?.defaultOutputHeight || Math.round(crop.height * 2);

    canvas.width = targetW;
    canvas.height = targetH;

    // Source image scale relative to displayed bounds
    const scaleX = img.naturalWidth / displayedImgRect.width;
    const scaleY = img.naturalHeight / displayedImgRect.height;

    const sourceX = (crop.x - displayedImgRect.x) * scaleX;
    const sourceY = (crop.y - displayedImgRect.y) * scaleY;
    const sourceW = crop.width * scaleX;
    const sourceH = crop.height * scaleY;

    // Clear and draw
    ctx.clearRect(0, 0, targetW, targetH);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetW, targetH);

    ctx.save();

    // Handling rotation & flip in preview
    if (rotation !== 0 || flipH) {
      ctx.translate(targetW / 2, targetH / 2);
      if (flipH) ctx.scale(-1, 1);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-targetW / 2, -targetH / 2);
    }

    try {
      ctx.drawImage(
        img,
        Math.max(0, sourceX),
        Math.max(0, sourceY),
        Math.min(img.naturalWidth, sourceW),
        Math.min(img.naturalHeight, sourceH),
        0,
        0,
        targetW,
        targetH
      );
    } catch {
      // Ignored cross-origin canvas security issue for external images without CORS
    }

    ctx.restore();
  }, [crop, displayedImgRect, imageLoaded, rotation, flipH, selectedRatio]);

  // Pointer/Touch Drag handlers for Crop Area & Handles
  const handlePointerDown = (
    e: React.PointerEvent,
    type: "move" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    dragTypeRef.current = type;
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    dragStartCropRef.current = { ...crop };

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !dragTypeRef.current) return;
    e.preventDefault();

    const dx = e.clientX - dragStartPosRef.current.x;
    const dy = e.clientY - dragStartPosRef.current.y;
    const start = dragStartCropRef.current;
    const bounds = displayedImgRect;

    const ratioOption = ASPECT_RATIOS.find((r) => r.id === selectedRatio);
    const lockedRatio = ratioOption?.ratio;

    if (dragTypeRef.current === "move") {
      // Reposition crop frame
      let newX = start.x + dx;
      let newY = start.y + dy;

      // Clamp within displayed image bounds
      newX = Math.max(bounds.x, Math.min(bounds.x + bounds.width - start.width, newX));
      newY = Math.max(bounds.y, Math.min(bounds.y + bounds.height - start.height, newY));

      setCrop({
        x: newX,
        y: newY,
        width: start.width,
        height: start.height,
      });
      return;
    }

    // Resize via handles
    let newX = start.x;
    let newY = start.y;
    let newW = start.width;
    let newH = start.height;

    const minSize = 40;

    switch (dragTypeRef.current) {
      case "se": {
        newW = Math.max(minSize, start.width + dx);
        if (lockedRatio) {
          newH = newW / lockedRatio;
        } else {
          newH = Math.max(minSize, start.height + dy);
        }
        break;
      }
      case "nw": {
        const potentialW = start.width - dx;
        if (potentialW >= minSize) {
          newW = potentialW;
          newX = start.x + dx;
        }
        if (lockedRatio) {
          newH = newW / lockedRatio;
          newY = start.y + (start.height - newH);
        } else {
          const potentialH = start.height - dy;
          if (potentialH >= minSize) {
            newH = potentialH;
            newY = start.y + dy;
          }
        }
        break;
      }
      case "ne": {
        newW = Math.max(minSize, start.width + dx);
        if (lockedRatio) {
          newH = newW / lockedRatio;
          newY = start.y + (start.height - newH);
        } else {
          const potentialH = start.height - dy;
          if (potentialH >= minSize) {
            newH = potentialH;
            newY = start.y + dy;
          }
        }
        break;
      }
      case "sw": {
        const potentialW = start.width - dx;
        if (potentialW >= minSize) {
          newW = potentialW;
          newX = start.x + dx;
        }
        if (lockedRatio) {
          newH = newW / lockedRatio;
        } else {
          newH = Math.max(minSize, start.height + dy);
        }
        break;
      }
      case "e": {
        newW = Math.max(minSize, start.width + dx);
        if (lockedRatio) newH = newW / lockedRatio;
        break;
      }
      case "s": {
        newH = Math.max(minSize, start.height + dy);
        if (lockedRatio) newW = newH * lockedRatio;
        break;
      }
      case "w": {
        const potentialW = start.width - dx;
        if (potentialW >= minSize) {
          newW = potentialW;
          newX = start.x + dx;
        }
        if (lockedRatio) newH = newW / lockedRatio;
        break;
      }
      case "n": {
        const potentialH = start.height - dy;
        if (potentialH >= minSize) {
          newH = potentialH;
          newY = start.y + dy;
        }
        if (lockedRatio) newW = newH * lockedRatio;
        break;
      }
    }

    // Boundary constraints
    if (newX < bounds.x) {
      newX = bounds.x;
    }
    if (newY < bounds.y) {
      newY = bounds.y;
    }
    if (newX + newW > bounds.x + bounds.width) {
      newW = bounds.x + bounds.width - newX;
      if (lockedRatio) newH = newW / lockedRatio;
    }
    if (newY + newH > bounds.y + bounds.height) {
      newH = bounds.y + bounds.height - newY;
      if (lockedRatio) newW = newH * lockedRatio;
    }

    setCrop({
      x: newX,
      y: newY,
      width: Math.max(minSize, newW),
      height: Math.max(minSize, newH),
    });
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    dragTypeRef.current = null;
  };

  // Rotation controls
  const handleRotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRotateCounterClockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleFlipHorizontal = () => {
    setFlipH((prev) => !prev);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    if (imageElementRef.current) {
      calculateInitialCrop(imageElementRef.current, selectedRatio, 1);
    }
  };

  // Export cropped image as Data URL
  const handleApplyCrop = () => {
    if (!imageElementRef.current) return;
    const img = imageElementRef.current;

    const ratioOption = ASPECT_RATIOS.find((r) => r.id === selectedRatio);
    const outW = ratioOption?.defaultOutputWidth || Math.round(crop.width * 2);
    const outH = ratioOption?.defaultOutputHeight || Math.round(crop.height * 2);

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = outW;
    exportCanvas.height = outH;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    // Fill clean white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outW, outH);

    // Scaling from displayed coordinates to natural image pixels
    const scaleX = img.naturalWidth / displayedImgRect.width;
    const scaleY = img.naturalHeight / displayedImgRect.height;

    const sourceX = (crop.x - displayedImgRect.x) * scaleX;
    const sourceY = (crop.y - displayedImgRect.y) * scaleY;
    const sourceW = crop.width * scaleX;
    const sourceH = crop.height * scaleY;

    ctx.save();

    // Apply rotation & flip
    if (rotation !== 0 || flipH) {
      ctx.translate(outW / 2, outH / 2);
      if (flipH) ctx.scale(-1, 1);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-outW / 2, -outH / 2);
    }

    try {
      ctx.drawImage(
        img,
        Math.max(0, sourceX),
        Math.max(0, sourceY),
        Math.min(img.naturalWidth, sourceW),
        Math.min(img.naturalHeight, sourceH),
        0,
        0,
        outW,
        outH
      );

      // High quality JPEG
      const dataUrl = exportCanvas.toDataURL("image/jpeg", 0.92);
      onCropComplete(dataUrl);
      onClose();
    } catch {
      // Fallback: If canvas is tainted due to external image CORS, use original imageUrl
      if (imageUrl) {
        onCropComplete(imageUrl);
        onClose();
      } else {
        alert("Could not export image. Please upload a file directly from your computer.");
      }
    }

    ctx.restore();
  };

  if (!isOpen) return null;

  const currentRatioOption = ASPECT_RATIOS.find((r) => r.id === selectedRatio);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-5xl w-full flex flex-col max-h-[95vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M3.75 16.5V18A2.25 2.25 0 006 20.25h1.5M16.5 20.25H18A2.25 2.25 0 0020.25 18v-1.5M20.25 7.5V6A2.25 2.25 0 0018 3.75h-1.5"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose an aspect ratio preset, adjust framing & zoom, then save.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="w-4.5 h-4.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Size Presets Bar */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Size Presets:
          </span>
          {ASPECT_RATIOS.map((preset) => {
            const isSelected = selectedRatio === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectRatio(preset.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-violet-600 text-white shadow-sm shadow-violet-600/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <span>{preset.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-200/70 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {preset.defaultOutputWidth}×{preset.defaultOutputHeight}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Body: Two Columns (Editor Workspace & Live Preview) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-[380px] max-h-[550px]">
          {/* Main Cropper Stage (8 cols) */}
          <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="lg:col-span-8 bg-slate-950 relative flex items-center justify-center overflow-hidden select-none p-4 cursor-default"
          >
            {imageError ? (
              <div className="max-w-md p-6 text-center text-rose-400 bg-rose-950/40 rounded-2xl border border-rose-900/50">
                <svg className="w-10 h-10 mx-auto mb-2 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xs font-semibold">{imageError}</p>
              </div>
            ) : imageUrl ? (
              <>
                {/* Image under test */}
                <img
                  ref={onImgRef}
                  src={imageUrl}
                  alt="Crop Target"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  draggable={false}
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg) ${flipH ? "scaleX(-1)" : ""}`,
                    transition: isDraggingRef.current ? "none" : "transform 0.15s ease-out",
                  }}
                  className="max-h-[480px] max-w-[95%] object-contain pointer-events-none rounded-lg shadow-lg"
                />

                {/* Dark Mask & Interactive Crop Box */}
                {imageLoaded && crop.width > 0 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Dark Overlay with transparent cutout for crop */}
                    <svg className="w-full h-full absolute inset-0">
                      <defs>
                        <mask id="crop-mask">
                          <rect width="100%" height="100%" fill="white" />
                          <rect
                            x={crop.x}
                            y={crop.y}
                            width={crop.width}
                            height={crop.height}
                            fill="black"
                            rx="4"
                          />
                        </mask>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill="rgba(0, 0, 0, 0.65)"
                        mask="url(#crop-mask)"
                      />
                    </svg>

                    {/* Crop Bounding Box */}
                    <div
                      style={{
                        left: `${crop.x}px`,
                        top: `${crop.y}px`,
                        width: `${crop.width}px`,
                        height: `${crop.height}px`,
                      }}
                      className="absolute border-2 border-violet-400 pointer-events-auto shadow-2xl rounded-sm"
                    >
                      {/* Move Area (Center Drag) */}
                      <div
                        onPointerDown={(e) => handlePointerDown(e, "move")}
                        className="w-full h-full cursor-move relative"
                        title="Drag to reposition crop area"
                      >
                        {/* 3x3 Rule-of-Thirds Grid */}
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                          <div className="border-r border-b border-white/60" />
                          <div className="border-r border-b border-white/60" />
                          <div className="border-b border-white/60" />
                          <div className="border-r border-b border-white/60" />
                          <div className="border-r border-b border-white/60" />
                          <div className="border-b border-white/60" />
                          <div className="border-r border-white/60" />
                          <div className="border-r border-white/60" />
                          <div />
                        </div>
                      </div>

                      {/* 8 Resize Handles */}
                      {/* Corner Handles */}
                      <div
                        onPointerDown={(e) => handlePointerDown(e, "nw")}
                        className="absolute -top-2 -left-2 w-4 h-4 bg-violet-400 border-2 border-white rounded-full cursor-nwse-resize shadow-md"
                      />
                      <div
                        onPointerDown={(e) => handlePointerDown(e, "ne")}
                        className="absolute -top-2 -right-2 w-4 h-4 bg-violet-400 border-2 border-white rounded-full cursor-nesw-resize shadow-md"
                      />
                      <div
                        onPointerDown={(e) => handlePointerDown(e, "sw")}
                        className="absolute -bottom-2 -left-2 w-4 h-4 bg-violet-400 border-2 border-white rounded-full cursor-nesw-resize shadow-md"
                      />
                      <div
                        onPointerDown={(e) => handlePointerDown(e, "se")}
                        className="absolute -bottom-2 -right-2 w-4 h-4 bg-violet-400 border-2 border-white rounded-full cursor-nwse-resize shadow-md"
                      />

                      {/* Edge Handles (visible in freeform) */}
                      {selectedRatio === "free" && (
                        <>
                          <div
                            onPointerDown={(e) => handlePointerDown(e, "n")}
                            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-5 h-2 bg-white rounded-full cursor-ns-resize shadow-sm"
                          />
                          <div
                            onPointerDown={(e) => handlePointerDown(e, "s")}
                            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-2 bg-white rounded-full cursor-ns-resize shadow-sm"
                          />
                          <div
                            onPointerDown={(e) => handlePointerDown(e, "w")}
                            className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2 h-5 bg-white rounded-full cursor-ew-resize shadow-sm"
                          />
                          <div
                            onPointerDown={(e) => handlePointerDown(e, "e")}
                            className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-5 bg-white rounded-full cursor-ew-resize shadow-sm"
                          />
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-slate-500 text-xs">No image selected</div>
            )}
          </div>

          {/* Right Preview & Control Panel (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
            <div className="space-y-5">
              {/* Output Preview Card */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Crop Preview
                  </span>
                  <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded-md">
                    {currentRatioOption?.label}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[160px] max-h-[190px]">
                  <canvas
                    ref={previewCanvasRef}
                    className="max-h-[160px] max-w-full rounded-xl object-contain shadow-xs border border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>Output size:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {currentRatioOption?.defaultOutputWidth} × {currentRatioOption?.defaultOutputHeight} px
                  </span>
                </div>
              </div>

              {/* Adjustments: Zoom, Rotation, Flip */}
              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Adjustments
                </span>

                {/* Zoom Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Zoom</span>
                    <span className="text-violet-600 dark:text-violet-400 font-bold">
                      {Math.round(zoom * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold hover:bg-slate-200 text-xs cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="flex-1 accent-violet-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold hover:bg-slate-200 text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Rotation & Flip Controls */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleRotateCounterClockwise}
                    className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-colors cursor-pointer"
                    title="Rotate -90°"
                  >
                    <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3" />
                    </svg>
                    <span>-90°</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRotateClockwise}
                    className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-colors cursor-pointer"
                    title="Rotate +90°"
                  >
                    <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15l6 6m0 0l6-6m-6 6V9a6 6 0 00-12 0v3" />
                    </svg>
                    <span>+90°</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFlipHorizontal}
                    className={`p-2 border rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                      flipH
                        ? "bg-violet-50 dark:bg-violet-950/60 border-violet-300 dark:border-violet-800 text-violet-700 dark:text-violet-300"
                        : "bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                    title="Flip Horizontal"
                  >
                    <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-9L21 12m0 0l-4.5 4.5M21 12H7.5" />
                    </svg>
                    <span>Flip</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-colors cursor-pointer"
                    title="Reset All"
                  >
                    <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                disabled={!imageLoaded || !!imageError}
                className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold shadow-md shadow-violet-600/30 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5"
              >
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>Save & Apply Crop</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
