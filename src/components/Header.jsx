import React, { useState } from 'react';
import { Search, Mic, PlusCircle, Upload, LogIn, Menu, Shield, User, Sparkles } from 'lucide-react';

export default function Header({ 
  activeUser, 
  setActiveUser, 
  users, 
  searchQuery, 
  setSearchQuery, 
  onOpenQuickLog, 
  onStartVoice, 
  logoUrl, 
  setLogoUrl,
  onOpenLoginModal,
  onToggleMobileSidebar
}) {
  const [showLogoModal, setShowLogoModal] = useState(false);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result);
        setShowLogoModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const isGuest = activeUser?.isGuest;
  const isSuperAdmin = activeUser?.roleCode === 'super_admin' || activeUser?.role === 'Super Admin' || activeUser?.username?.toLowerCase() === 'ishi';

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 shadow-md">
      
      {/* Top Banner Bar */}
      <div className="px-4 sm:px-6 py-1.5 flex items-center justify-between text-xs bg-gradient-to-r from-emerald-950/60 via-purple-950/40 to-slate-950 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onToggleMobileSidebar}
            className="md:hidden p-1 rounded-lg text-slate-300 hover:text-white bg-slate-800 border border-slate-700"
          >
            <Menu className="w-4 h-4" />
          </button>
          
          <span className={`inline-block w-2 h-2 rounded-full ${isGuest ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`}></span>
          <span className="text-slate-300 font-medium hidden sm:inline">
            {isGuest ? (
              <span className="text-amber-300 font-bold">Browsing as Guest</span>
            ) : (
              <span className="text-emerald-300 font-bold">Active User: {activeUser.name} ({activeUser.role})</span>
            )}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span className="text-slate-400 font-medium hidden lg:inline">📍 Ilocos Norte DOST Multi-Farm Hub</span>
          {isSuperAdmin && (
            <span className="bg-purple-900/80 text-amber-300 px-2 py-0.5 rounded-full font-extrabold border border-amber-400/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Super Admin Active</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Title (Mobile View) */}
          <div className="flex items-center space-x-3 md:hidden">
            <div 
              className="relative cursor-pointer shrink-0"
              onClick={() => setShowLogoModal(true)}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 p-0.5 border border-purple-500/60 shadow-md flex items-center justify-center overflow-hidden">
                <img 
                  src={logoUrl || '/THerta_LogoWFrame.png'} 
                  alt="THerta Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/THerta_LogoWFrame.png';
                  }}
                />
              </div>
            </div>
            <div>
              <h1 className="text-base font-black text-white leading-none">AGRI-KA</h1>
              <p className="text-[10px] text-emerald-400 font-semibold">DOST Replica</p>
            </div>
          </div>

          {/* Search Bar & Voice Controls */}
          <div className="flex items-center space-x-2 flex-1 max-w-2xl">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guides, tools, inventory stock, financials, logs..."
                className="w-full pl-10 pr-10 py-2 bg-slate-800/90 border border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-400 transition-all outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={onStartVoice}
              title="Voice Assistant Simulator"
              className="bg-purple-950/60 hover:bg-purple-900 text-purple-200 p-2.5 rounded-xl border border-purple-500/40 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-purple-300 animate-pulse" />
            </button>
          </div>

          {/* Action Log Button (Desktop) */}
          <div className="hidden sm:flex items-center space-x-3 shrink-0">
            <button
              onClick={onOpenQuickLog}
              className="bg-gradient-to-r from-emerald-600 via-teal-600 to-purple-600 hover:from-emerald-500 hover:to-purple-500 text-white font-bold px-4 py-2 rounded-xl shadow-md transition-all flex items-center space-x-2 text-xs border border-emerald-400/30 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Action Log</span>
            </button>
          </div>

        </div>
      </div>

      {/* Change Logo Modal */}
      {showLogoModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-slate-200">
            <h3 className="font-bold text-lg text-white mb-2">Update Farm Crest / Logo</h3>
            <p className="text-xs text-slate-400 mb-4">Choose a new custom emblem image to display in AGRI-KA.</p>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
            />
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowLogoModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
