import React, { useState, useRef, useEffect } from 'react';
import { Crop, RotateCw, ZoomIn, ZoomOut, Check, X, RefreshCw, Maximize2 } from 'lucide-react';

export default function ImageCropperModal({ imageUrl, isOpen, onClose, onCropComplete }) {
  const [aspectRatio, setAspectRatio] = useState('free'); // 'free', '1:1', '16:9', '4:3', '3:2'
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  
  // Crop area percentage (0 to 100)
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeHandle, setActiveHandle] = useState(null); // 'nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w', 'move'

  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      handleReset();
    }
  }, [isOpen, imageUrl]);

  if (!isOpen || !imageUrl) return null;

  // Reset crop to 100% original image size
  const handleReset = () => {
    setAspectRatio('free');
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0, width: 100, height: 100 });
  };

  // Apply Aspect Ratio constraints
  const handleRatioChange = (ratio) => {
    setAspectRatio(ratio);
    if (ratio === 'free') {
      return;
    }

    let targetRatio = 1; // w / h
    if (ratio === '1:1') targetRatio = 1;
    else if (ratio === '16:9') targetRatio = 16 / 9;
    else if (ratio === '4:3') targetRatio = 4 / 3;
    else if (ratio === '3:2') targetRatio = 3 / 2;

    // Adjust crop box based on aspect ratio
    let w = 80;
    let h = 80 / targetRatio;
    if (h > 90) {
      h = 80;
      w = 80 * targetRatio;
    }
    const x = Math.max(0, (100 - w) / 2);
    const y = Math.max(0, (100 - h) / 2);
    setCrop({ x, y, width: w, height: h });
  };

  const startDrag = (clientX, clientY, handle) => {
    setIsDragging(true);
    setActiveHandle(handle);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleMouseDown = (e, handle) => {
    e.preventDefault();
    e.stopPropagation();
    startDrag(e.clientX, e.clientY, handle);
  };

  const handleTouchStart = (e, handle) => {
    if (e.touches.length === 1) {
      e.stopPropagation();
      startDrag(e.touches[0].clientX, e.touches[0].clientY, handle);
    }
  };

  const moveDrag = (clientX, clientY) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dxPercent = ((clientX - dragStart.x) / rect.width) * 100;
    const dyPercent = ((clientY - dragStart.y) / rect.height) * 100;

    setDragStart({ x: clientX, y: clientY });

    setCrop(prev => {
      let { x, y, width, height } = prev;

      if (activeHandle === 'move') {
        let newX = Math.max(0, Math.min(100 - width, x + dxPercent));
        let newY = Math.max(0, Math.min(100 - height, y + dyPercent));
        return { x: newX, y: newY, width, height };
      }

      let newX = x;
      let newY = y;
      let newW = width;
      let newH = height;

      if (activeHandle.includes('e')) {
        newW = Math.max(10, Math.min(100 - x, width + dxPercent));
      }
      if (activeHandle.includes('w')) {
        const potentialW = Math.max(10, width - dxPercent);
        newX = Math.max(0, Math.min(x + width - 10, x + (width - potentialW)));
        newW = width + (x - newX);
      }
      if (activeHandle.includes('s')) {
        newH = Math.max(10, Math.min(100 - y, height + dyPercent));
      }
      if (activeHandle.includes('n')) {
        const potentialH = Math.max(10, height - dyPercent);
        newY = Math.max(0, Math.min(y + height - 10, y + (height - potentialH)));
        newH = height + (y - newY);
      }

      // Maintain aspect ratio if set
      if (aspectRatio !== 'free') {
        let targetRatio = 1;
        if (aspectRatio === '16:9') targetRatio = 16 / 9;
        else if (aspectRatio === '4:3') targetRatio = 4 / 3;
        else if (aspectRatio === '3:2') targetRatio = 3 / 2;

        newH = newW / targetRatio;
        if (newY + newH > 100) {
          newH = 100 - newY;
          newW = newH * targetRatio;
        }
      }

      return { x: newX, y: newY, width: newW, height: newH };
    });
  };

  const handleMouseMove = (e) => {
    moveDrag(e.clientX, e.clientY);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleEndDrag = () => {
    setIsDragging(false);
    setActiveHandle(null);
  };

  const handleCropApply = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;

      const sourceX = (crop.x / 100) * naturalW;
      const sourceY = (crop.y / 100) * naturalH;
      const sourceW = (crop.width / 100) * naturalW;
      const sourceH = (crop.height / 100) * naturalH;

      // Cap maximum output resolution to prevent memory overflow (e.g. max 1200px)
      const maxDim = 1200;
      let targetW = sourceW;
      let targetH = sourceH;
      if (targetW > maxDim || targetH > maxDim) {
        if (targetW > targetH) {
          targetH = Math.round((targetH * maxDim) / targetW);
          targetW = maxDim;
        } else {
          targetW = Math.round((targetW * maxDim) / targetH);
          targetH = maxDim;
        }
      }

      canvas.width = targetW;
      canvas.height = targetH;

      if (rotation !== 0) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, -targetW / 2, -targetH / 2, targetW, targetH);
        ctx.restore();
      } else {
        ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, targetW, targetH);
      }

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.84);
      onCropComplete(croppedDataUrl);
      onClose();
    };
    img.src = imageUrl;
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none overflow-y-auto"
      onMouseMove={handleMouseMove}
      onMouseUp={handleEndDrag}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEndDrag}
    >
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full text-white overflow-hidden shadow-2xl space-y-4 my-6 p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Crop className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-white">Crop & Adaptive Image Editor</h3>
          </div>

          <div className="flex items-center space-x-2">
            {/* RESET BUTTON */}
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-amber-400/30 cursor-pointer"
              title="Reset crop to full original image size"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset to Original</span>
            </button>

            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
          
          {/* Aspect Ratio Presets */}
          <div className="flex flex-wrap items-center gap-1 font-semibold">
            <span className="text-slate-400 mr-1 text-[11px] uppercase">Ratio:</span>
            {['free', '1:1', '16:9', '4:3', '3:2'].map(ratio => (
              <button
                key={ratio}
                type="button"
                onClick={() => handleRatioChange(ratio)}
                className={`px-2.5 py-1 rounded-lg uppercase tracking-wider text-[11px] cursor-pointer ${
                  aspectRatio === ratio ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {ratio === 'free' ? 'Original / Free' : ratio}
              </button>
            ))}
          </div>

          {/* Rotate & Zoom */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-200 flex items-center gap-1 cursor-pointer"
              title="Rotate 90°"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{rotation}°</span>
            </button>

            <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-xl">
              <ZoomOut className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-20 accent-emerald-500 cursor-pointer"
              />
              <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Cropping Canvas Area */}
        <div 
          ref={containerRef}
          className="relative h-80 sm:h-96 w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center select-none"
        >
          <img
            src={imageUrl}
            alt="Source to crop"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              transition: isDragging ? 'none' : 'transform 0.2s ease'
            }}
          />

          {/* Active Crop Box */}
          <div
            style={{
              left: `${crop.x}%`,
              top: `${crop.y}%`,
              width: `${crop.width}%`,
              height: `${crop.height}%`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'move')}
            onTouchStart={(e) => handleTouchStart(e, 'move')}
            className="absolute border-2 border-emerald-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] cursor-move flex flex-col justify-between p-1 z-20"
          >
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
              <div className="border-r border-b border-white/50"></div>
              <div className="border-r border-b border-white/50"></div>
              <div className="border-b border-white/50"></div>
              <div className="border-r border-b border-white/50"></div>
              <div className="border-r border-b border-white/50"></div>
              <div className="border-b border-white/50"></div>
              <div className="border-r border-white/50"></div>
              <div className="border-r border-white/50"></div>
              <div></div>
            </div>

            {/* Corner Resize Handles */}
            <div 
              onMouseDown={(e) => handleMouseDown(e, 'nw')}
              onTouchStart={(e) => handleTouchStart(e, 'nw')}
              className="absolute -top-2 -left-2 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full cursor-nwse-resize z-30"
            />
            <div 
              onMouseDown={(e) => handleMouseDown(e, 'ne')}
              onTouchStart={(e) => handleTouchStart(e, 'ne')}
              className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full cursor-nesw-resize z-30"
            />
            <div 
              onMouseDown={(e) => handleMouseDown(e, 'sw')}
              onTouchStart={(e) => handleTouchStart(e, 'sw')}
              className="absolute -bottom-2 -left-2 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full cursor-nesw-resize z-30"
            />
            <div 
              onMouseDown={(e) => handleMouseDown(e, 'se')}
              onTouchStart={(e) => handleTouchStart(e, 'se')}
              className="absolute -bottom-2 -right-2 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full cursor-nwse-resize z-30"
            />

            {/* Side Resize Handles */}
            <div 
              onMouseDown={(e) => handleMouseDown(e, 'n')}
              onTouchStart={(e) => handleTouchStart(e, 'n')}
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-3 bg-emerald-400 border border-white rounded-full cursor-ns-resize z-30"
            />
            <div 
              onMouseDown={(e) => handleMouseDown(e, 's')}
              onTouchStart={(e) => handleTouchStart(e, 's')}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-3 bg-emerald-400 border border-white rounded-full cursor-ns-resize z-30"
            />
            <div 
              onMouseDown={(e) => handleMouseDown(e, 'w')}
              onTouchStart={(e) => handleTouchStart(e, 'w')}
              className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-6 bg-emerald-400 border border-white rounded-full cursor-ew-resize z-30"
            />
            <div 
              onMouseDown={(e) => handleMouseDown(e, 'e')}
              onTouchStart={(e) => handleTouchStart(e, 'e')}
              className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-6 bg-emerald-400 border border-white rounded-full cursor-ew-resize z-30"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-[11px] text-slate-400">
            Click <strong className="text-amber-300">"Reset to Original"</strong> to restore full uncropped photo.
          </span>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCropApply}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1.5 shadow-lg cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply Crop</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
