import React, { useState } from 'react';
import { PlusCircle, Mic, Check, X, ShieldCheck, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import MediaInput from './MediaInput';

export default function QuickLogModal({ 
  isOpen, 
  onClose, 
  activeUser, 
  inventoryItems, 
  onAddAuditLog,
  onOpenLoginModal 
}) {
  const [actionType, setActionType] = useState('Planting & Sowing');
  const [itemTagged, setItemTagged] = useState(inventoryItems[0]?.name || 'Crop / Field Asset');
  const [category, setCategory] = useState('Crops');
  const [location, setLocation] = useState('Field Sector A');
  const [quantityDetails, setQuantityDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [isListening, setIsListening] = useState(false);

  if (!isOpen) return null;

  const isGuest = activeUser?.isGuest;

  const handleVoiceSimulate = () => {
    setIsListening(true);
    setTimeout(() => {
      setNotes('Voice Note: Completed field inspection and verified crop growth status.');
      setIsListening(false);
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isGuest) {
      onClose();
      onOpenLoginModal();
      return;
    }

    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
      user: activeUser.name,
      userRole: activeUser.role,
      actionType,
      itemTagged,
      category,
      location,
      quantityDetails: quantityDetails || 'Standard Operational Duty',
      notes: notes || 'Logged via mobile farm app',
      verificationStatus: 'Logged & Verified',
      mediaUrl,
      mediaType
    };

    onAddAuditLog(newLog);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    setQuantityDetails('');
    setNotes('');
    setMediaUrl('');
    setMediaType('image');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-purple-200 shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-purple-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-xl font-bold">
              📋
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Record Farm Activity</h3>
              <p className="text-xs text-emerald-300">Accountability Log Entry</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-white bg-slate-800/60 p-2 rounded-full border border-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Accountability Badge */}
        <div className="bg-purple-50 p-3 px-5 border-b border-purple-100 flex items-center justify-between text-xs">
          <span className="text-purple-900 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-600" /> Accountable Logging User:
          </span>
          <span className={`font-bold px-3 py-1 rounded-full text-xs ${isGuest ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-purple-900 text-purple-100'}`}>
            {activeUser.avatar} {activeUser.name}
          </span>
        </div>

        {isGuest ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
              🔒
            </div>
            <h4 className="text-lg font-bold text-slate-900">Guest Access Restricted</h4>
            <p className="text-xs text-slate-600">
              You are currently browsing as a <strong>Guest</strong>. Please log in or register a free account to submit logs and record farm activities.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLoginModal();
              }}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-purple-600 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
            >
              Login / Register Now
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Action Type</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-purple-500"
              >
                <option value="Planting & Sowing">🌱 Planting & Sowing</option>
                <option value="Equipment Usage">🚜 Equipment / Machinery Usage</option>
                <option value="Livestock Movement & Care">🐄 Livestock Care & Movement</option>
                <option value="Chemical & Spraying">🧪 Fertilizer / Spray Application</option>
                <option value="Equipment Maintenance">🛠️ Machinery Maintenance</option>
                <option value="Harvest & Sales">🌾 Harvest & Product Collection</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none"
                >
                  <option value="Crops">Crops & Fields</option>
                  <option value="Equipment">Equipment & Tech</option>
                  <option value="Livestock">Livestock & Animals</option>
                  <option value="Financial">Financial & Money</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Item Tagged</label>
                <input
                  type="text"
                  required
                  value={itemTagged}
                  onChange={(e) => setItemTagged(e.target.value)}
                  placeholder="e.g. Tractor 01, Rice Field A"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Field Sector A, Barn Pen 2"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Quantity & Activity Summary</label>
              <input
                type="text"
                required
                value={quantityDetails}
                onChange={(e) => setQuantityDetails(e.target.value)}
                placeholder="e.g. Planted 50kg seeds, Ran machine 3 hrs"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Notes & Observations</label>
                <button
                  type="button"
                  onClick={handleVoiceSimulate}
                  className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-100 px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer"
                >
                  <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-bounce text-red-600' : ''}`} />
                  <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add extra notes..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:border-purple-500"
              ></textarea>
            </div>

            {/* Optional Media Attachment */}
            <MediaInput
              mediaUrl={mediaUrl}
              setMediaUrl={setMediaUrl}
              mediaType={mediaType}
              setMediaType={setMediaType}
            />

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-purple-600 text-white shadow-lg flex items-center space-x-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Submit Activity Log</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
