import React, { useState } from 'react';
import { Search, Mic, PlusCircle, Upload, LogIn } from 'lucide-react';

export default function Header({ 
  activeUser, 
  setActiveUser, 
  users, 
  activeTab, 
  setActiveTab, 
  searchQuery, 
  setSearchQuery, 
  onOpenQuickLog, 
  onStartVoice, 
  logoUrl, 
  setLogoUrl,
  onOpenLoginModal
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

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-b border-emerald-900/40 shadow-lg">
      {/* Top Banner / User Login Indicator */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 py-2 flex items-center justify-between text-xs sm:text-sm bg-gradient-to-r from-emerald-900/60 via-purple-900/40 to-slate-900 border-b border-emerald-500/20">
        <div className="flex items-center space-x-2">
          <span className={`inline-block w-2 h-2 rounded-full ${isGuest ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`}></span>
          <span className="text-slate-300 font-medium">
            {isGuest ? (
              <span className="text-amber-300 font-bold">Logged in as Guest</span>
            ) : (
              <span className="text-emerald-300 font-bold">Logged in as {activeUser.name}</span>
            )}
          </span>
        </div>

        {/* Login / Switch Account Button */}
        <div>
          {isGuest ? (
            <button 
              onClick={onOpenLoginModal}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700 px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login / Sign Up</span>
            </button>
          ) : (
            <button 
              onClick={onOpenLoginModal}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-200 border border-slate-700 transition-all cursor-pointer"
            >
              <span>{activeUser.avatar} {activeUser.name}</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">Switch</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Content */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-3.5">
              <div 
                className="relative group cursor-pointer"
                onClick={() => setShowLogoModal(true)}
                title="Click to change farm logo image"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-950 p-1 border-2 border-purple-500/60 shadow-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={logoUrl || '/THerta_LogoWFrame.png'} 
                    alt="THerta Logo" 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/THerta_LogoWFrame.png';
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <Upload className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>AGRI-KA</span>
                  <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">FARM</span>
                </h1>
                <p className="text-xs sm:text-sm text-emerald-400 font-medium">Multi Purpose Farm App</p>
              </div>
            </div>

            {/* Mobile Quick Action */}
            <button
              onClick={onOpenQuickLog}
              className="md:hidden bg-gradient-to-r from-emerald-500 to-purple-600 text-white font-bold p-2.5 rounded-xl shadow-lg flex items-center gap-1 text-xs"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Log</span>
            </button>
          </div>

          {/* Search & Voice Assistant */}
          <div className="flex items-center space-x-2 w-full md:w-auto flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search wiki, tools, crops, logs, equipment..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-800/90 border border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-400 transition-all outline-none"
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
              className="bg-purple-900/60 hover:bg-purple-800 text-purple-200 p-3 rounded-xl border border-purple-500/40 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-purple-300 animate-pulse" />
            </button>
          </div>

          {/* Primary Quick Log Action Button (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onOpenQuickLog}
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center space-x-2 text-sm border border-emerald-400/30 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Action Log</span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-2 sm:space-x-4 mt-4 border-t border-slate-800 pt-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('hub')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
              activeTab === 'hub'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-900/30'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📖</span>
            <span>1. Centralized Knowledge Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md shadow-purple-900/30'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📋</span>
            <span>2. Record & Inventory System</span>
          </button>

          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
              activeTab === 'monitoring'
                ? 'bg-gradient-to-r from-teal-600 to-purple-700 text-white shadow-md shadow-teal-900/30'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📡</span>
            <span>3. Dynamic Monitoring Application</span>
          </button>
        </nav>
      </div>

      {/* Change Logo Modal */}
      {showLogoModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 max-w-md w-full text-slate-100">
            <h3 className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-2">
              <Upload className="w-5 h-5" /> Change Farm Logo Image
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Select an image file from your device to replace the header logo image.
            </p>

            <div className="flex justify-center mb-4">
              <img src={logoUrl || '/THerta_LogoWFrame.png'} alt="Preview" className="w-24 h-24 rounded-2xl object-contain border-2 border-purple-500 bg-slate-950 p-1" />
            </div>

            <input 
              type="file" 
              accept="image/*"
              onChange={handleLogoUpload}
              className="block w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer border border-slate-700 rounded-xl p-2 bg-slate-800"
            />

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowLogoModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
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
