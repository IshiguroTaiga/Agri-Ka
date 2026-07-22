import React, { useState } from 'react';
import { Video, Image as ImageIcon, Maximize2, Minimize2 } from 'lucide-react';

export default function MediaDisplay({ 
  mediaUrl, 
  mediaType = 'image', 
  fallbackImage = 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a28?auto=format&fit=crop&w=600&q=80',
  altTitle = 'Farm media asset',
  className = 'w-full h-full',
  showBadge = true,
  autoPlay = true,
  defaultFit = 'contain' // 'contain' or 'cover'
}) {
  const [fitMode, setFitMode] = useState(defaultFit);

  const isVideo = mediaType === 'video' || (mediaUrl && (
    mediaUrl.startsWith('data:video') || 
    mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i) || 
    mediaUrl.includes('youtube') || 
    mediaUrl.includes('vimeo')
  ));

  const displayUrl = mediaUrl || fallbackImage;

  const toggleFitMode = (e) => {
    e?.stopPropagation();
    setFitMode(prev => (prev === 'contain' ? 'cover' : 'contain'));
  };

  const objectFitClass = fitMode === 'contain' ? 'object-contain' : 'object-cover';

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden group flex items-center justify-center">
      {isVideo ? (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <video
            src={displayUrl}
            controls
            autoPlay={autoPlay}
            loop
            muted
            playsInline
            preload="metadata"
            className={`${className} ${objectFitClass} transition-all duration-300`}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={displayUrl}
            alt={altTitle}
            className={`${className} ${objectFitClass} transition-all duration-300`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
          />
        </div>
      )}

      {/* Media Type & Aspect Fit Overlay Controls */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10 pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity">
        {showBadge && (
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md border ${
            isVideo 
              ? 'bg-purple-950/80 text-purple-200 border-purple-400/40' 
              : 'bg-slate-950/80 text-emerald-300 border-emerald-500/40'
          }`}>
            {isVideo ? <Video className="w-3 h-3 text-purple-300" /> : <ImageIcon className="w-3 h-3 text-emerald-300" />}
            <span>{isVideo ? 'Video Clip' : 'Image'}</span>
          </span>
        )}

        {/* Fit / Cover Toggle Button */}
        {mediaUrl && (
          <button
            type="button"
            onClick={toggleFitMode}
            title={fitMode === 'contain' ? 'Switch to Fill/Cover' : 'Switch to Fit/Full Ratio'}
            className="pointer-events-auto bg-slate-900/80 hover:bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-700 backdrop-blur-md flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
          >
            {fitMode === 'contain' ? (
              <>
                <Maximize2 className="w-3 h-3 text-emerald-400" />
                <span>Fit Ratio</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3 h-3 text-purple-400" />
                <span>Fill Frame</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
