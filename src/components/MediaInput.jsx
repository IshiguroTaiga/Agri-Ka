import React, { useState } from 'react';
import { Upload, Video, Image as ImageIcon, Link as LinkIcon, Trash2, Crop } from 'lucide-react';
import ImageCropperModal from './ImageCropperModal';

export default function MediaInput({ mediaUrl, setMediaUrl, mediaType, setMediaType }) {
  const [inputMode, setInputMode] = useState('file'); // 'file' or 'url'
  const [urlInput, setUrlInput] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVid = file.type.startsWith('video/');
    setMediaType(isVid ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = (event) => {
      setMediaUrl(event.target.result);
      if (!isVid) {
        // Automatically open crop modal for images!
        setShowCropModal(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput) return;
    setMediaUrl(urlInput);
    const isVid = urlInput.match(/\.(mp4|webm|ogg|mov)$/i) || urlInput.includes('youtube') || urlInput.includes('vimeo');
    setMediaType(isVid ? 'video' : 'image');
    setUrlInput('');
  };

  const handleClear = () => {
    setMediaUrl('');
    setMediaType('image');
    setUrlInput('');
  };

  const handleCropComplete = (croppedDataUrl) => {
    setMediaUrl(croppedDataUrl);
    setMediaType('image');
  };

  return (
    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
          <Upload className="w-4 h-4 text-emerald-600" />
          <span>Attach Media (Image / Video Clip)</span>
        </label>
        <div className="flex items-center gap-1 text-[11px] font-semibold bg-white p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setInputMode('file')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              inputMode === 'file' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              inputMode === 'url' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Link URL
          </button>
        </div>
      </div>

      {/* Input controls */}
      {inputMode === 'file' ? (
        <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-500 transition-colors rounded-xl p-4 text-center bg-white cursor-pointer group">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          />
          <div className="flex flex-col items-center justify-center space-y-1 text-slate-500 group-hover:text-emerald-600">
            <div className="flex space-x-2">
              <ImageIcon className="w-5 h-5 text-emerald-600" />
              <Video className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-bold">Click or drag photo or video clip to upload</span>
            <span className="text-[10px] text-slate-400">Adaptive ratios supported • Built-in Image Cropper</span>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/video.mp4 or photo.jpg"
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 cursor-pointer"
          >
            Attach
          </button>
        </div>
      )}

      {/* Media controls bar */}
      {mediaUrl && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-slate-600">Type:</span>
            <button
              type="button"
              onClick={() => setMediaType('image')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer ${
                mediaType === 'image' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-600'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Image
            </button>
            <button
              type="button"
              onClick={() => setMediaType('video')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer ${
                mediaType === 'video' ? 'bg-purple-100 text-purple-800 border border-purple-300' : 'bg-slate-200 text-slate-600'
              }`}
            >
              <Video className="w-3.5 h-3.5" /> Video Clip
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {mediaType === 'image' && (
              <button
                type="button"
                onClick={() => setShowCropModal(true)}
                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Crop className="w-3.5 h-3.5" />
                <span>Crop Image</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        </div>
      )}

      {/* Live Preview Display */}
      {mediaUrl && (
        <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-slate-900 max-h-52 flex items-center justify-center">
          {mediaType === 'video' || mediaUrl.startsWith('data:video') ? (
            <video
              src={mediaUrl}
              controls
              autoPlay
              muted
              loop
              playsInline
              className="w-full max-h-52 object-contain"
            >
              Your browser does not support video playback.
            </video>
          ) : (
            <img
              src={mediaUrl}
              alt="Media Preview"
              className="w-full max-h-52 object-contain bg-slate-950"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a28?auto=format&fit=crop&w=600&q=80';
              }}
            />
          )}
        </div>
      )}

      {/* Crop Modal */}
      <ImageCropperModal
        imageUrl={mediaUrl}
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
