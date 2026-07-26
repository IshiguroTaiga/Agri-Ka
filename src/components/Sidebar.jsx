import React, { useState } from 'react';
import { 
  BookOpen, ClipboardList, Activity, ChevronDown, ChevronRight, 
  PlusCircle, Mic, LogIn, LogOut, Users, Shield, Sparkles, 
  ChevronLeft, Menu, X, Wrench, Sprout, Feather, Leaf, DollarSign, Package, FileText
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  activeCategory,
  setActiveCategory,
  inventorySubTab,
  setInventorySubTab,
  monitoringSubTab,
  setMonitoringSubTab,
  activeUser,
  setActiveUser,
  onOpenQuickLog,
  onStartVoice,
  onOpenLoginModal,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  logoUrl,
  onOpenLogoModal
}) {
  const [openDropdowns, setOpenDropdowns] = useState({
    hub: true,
    inventory: true,
    monitoring: true
  });

  const isGuest = activeUser?.isGuest;
  const isSuperAdmin = activeUser?.roleCode === 'super_admin' || activeUser?.role === 'Super Admin' || activeUser?.username?.toLowerCase() === 'ishi';

  const toggleDropdown = (key) => {
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleHeaderClick = (key, tabName) => {
    if (isCollapsed) {
      setActiveTab(tabName);
    } else {
      toggleDropdown(key);
    }
  };

  const handleSelectCategory = (tab, cat) => {
    setActiveTab(tab);
    if (tab === 'hub') {
      setActiveCategory(cat);
    } else if (tab === 'inventory') {
      setInventorySubTab(cat);
    } else if (tab === 'monitoring') {
      setMonitoringSubTab(cat);
    }
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out to Guest Mode?')) {
      setActiveUser({
        id: 'guest',
        username: 'guest',
        name: 'Guest',
        role: 'Guest User',
        roleCode: 'guest',
        avatar: '👤',
        badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
        description: 'Unauthenticated visitor - View only access',
        isGuest: true
      });
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 bg-slate-900/98 backdrop-blur-xl border-r border-slate-800 text-slate-200 transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-72'
      } ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        
        {/* Upper Sidebar Header */}
        <div className="flex flex-col border-b border-slate-800/80">
          <div className="p-4 flex items-center justify-between">
            
            {/* Logo Branding */}
            <div className="flex items-center space-x-3 group overflow-hidden">
              <div 
                onClick={onOpenLogoModal}
                className="w-10 h-10 rounded-xl bg-slate-950 p-0.5 border border-purple-500/60 shadow-lg shrink-0 cursor-pointer relative group/logo overflow-hidden"
                title="Click to change farm system logo image"
              >
                <img 
                  src={logoUrl || '/THerta_LogoWFrame.png'} 
                  alt="AGRI-KA Logo" 
                  className="w-full h-full object-contain group-hover/logo:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/THerta_LogoWFrame.png';
                  }}
                />
                <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover/logo:opacity-100 flex items-center justify-center text-white text-[9px] font-bold transition-opacity">
                  Edit
                </div>
              </div>

              {!isCollapsed && (
                <div 
                  onClick={() => { setActiveTab('hub'); setActiveCategory('all'); }}
                  className="transition-opacity duration-300 cursor-pointer"
                >
                  <h1 className="font-black text-lg tracking-tight text-white flex items-center gap-1.5 leading-none">
                    <span>AGRI-KA</span>
                    <span className="text-xs bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent uppercase font-extrabold">HUB</span>
                  </h1>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Ilocos Norte Farm Hub</p>
                </div>
              )}
            </div>

            {/* Collapse Toggle (Desktop) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Close Toggle (Mobile) */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 no-scrollbar">
          
          {/* CATEGORY 1: KNOWLEDGE HUB */}
          <div className="space-y-1">
            <button
              onClick={() => handleHeaderClick('hub', 'hub')}
              className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'hub'
                  ? 'bg-gradient-to-r from-emerald-900/60 to-emerald-950/80 text-emerald-300 border border-emerald-500/30 shadow-md'
                  : 'hover:bg-slate-800/60 text-slate-300'
              }`}
              title={isCollapsed ? 'Knowledge Hub' : ''}
            >
              <div className="flex items-center space-x-3 shrink-0">
                <BookOpen className="w-5 h-5 text-emerald-400 shrink-0" />
                {!isCollapsed && <span className="truncate">Knowledge Hub</span>}
              </div>

              {!isCollapsed && (
                <div className="shrink-0 text-slate-400">
                  {openDropdowns.hub ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </div>
              )}
            </button>

            {/* Dropdown Items */}
            {openDropdowns.hub && !isCollapsed && (
              <div className="pl-9 pr-1 py-1 space-y-1 border-l-2 border-emerald-500/20 ml-5 text-xs">
                <button
                  onClick={() => handleSelectCategory('hub', 'all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'hub' && activeCategory === 'all'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span>🌐 All Guides</span>
                </button>
                <button
                  onClick={() => handleSelectCategory('hub', 'tech')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                    activeTab === 'hub' && activeCategory === 'tech'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Tech & Tools</span>
                </button>
                <button
                  onClick={() => handleSelectCategory('hub', 'knowledge')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                    activeTab === 'hub' && activeCategory === 'knowledge'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Farming Techniques</span>
                </button>
                <button
                  onClick={() => handleSelectCategory('hub', 'crops')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                    activeTab === 'hub' && activeCategory === 'crops'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Leaf className="w-3.5 h-3.5 text-amber-400" />
                  <span>Crops</span>
                </button>
                <button
                  onClick={() => handleSelectCategory('hub', 'livestock')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                    activeTab === 'hub' && activeCategory === 'livestock'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Feather className="w-3.5 h-3.5 text-purple-400" />
                  <span>Livestock</span>
                </button>
              </div>
            )}
          </div>

          {/* CATEGORY 2: RECORD & INVENTORY SYSTEM */}
          <div className="space-y-1">
            <button
              onClick={() => handleHeaderClick('inventory', 'inventory')}
              className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-gradient-to-r from-purple-900/60 to-purple-950/80 text-purple-300 border border-purple-500/30 shadow-md'
                  : 'hover:bg-slate-800/60 text-slate-300'
              }`}
              title={isCollapsed ? 'Record & Inventory' : ''}
            >
              <div className="flex items-center space-x-3 shrink-0">
                <ClipboardList className="w-5 h-5 text-purple-400 shrink-0" />
                {!isCollapsed && <span className="truncate">Record & Inventory</span>}
              </div>

              {!isCollapsed && (
                <div className="shrink-0 text-slate-400">
                  {openDropdowns.inventory ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </div>
              )}
            </button>

            {/* Dropdown Items */}
            {openDropdowns.inventory && !isCollapsed && (
              <div className="pl-9 pr-1 py-1 space-y-1 border-l-2 border-purple-500/20 ml-5 text-xs">
                <button
                  onClick={() => handleSelectCategory('inventory', 'logs')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                    activeTab === 'inventory' && inventorySubTab === 'logs'
                      ? 'bg-purple-500/20 text-purple-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Activity Audit Logs</span>
                </button>
                <button
                  onClick={() => handleSelectCategory('inventory', 'inventory')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                    activeTab === 'inventory' && inventorySubTab === 'inventory'
                      ? 'bg-purple-500/20 text-purple-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Package className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Equipment & Supplies</span>
                </button>
                <button
                  onClick={() => handleSelectCategory('inventory', 'financials')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                    activeTab === 'inventory' && inventorySubTab === 'financials'
                      ? 'bg-purple-500/20 text-purple-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  <span>Financial Records</span>
                </button>
              </div>
            )}
          </div>

          {/* CATEGORY 3: DYNAMIC MONITORING */}
          <div className="space-y-1">
            <button
              onClick={() => handleHeaderClick('monitoring', 'monitoring')}
              className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'monitoring'
                  ? 'bg-gradient-to-r from-teal-900/60 to-teal-950/80 text-teal-300 border border-teal-500/30 shadow-md'
                  : 'hover:bg-slate-800/60 text-slate-300'
              }`}
              title={isCollapsed ? 'Dynamic Monitoring' : ''}
            >
              <div className="flex items-center space-x-3 shrink-0">
                <Activity className="w-5 h-5 text-teal-400 shrink-0" />
                {!isCollapsed && <span className="truncate">Dynamic Monitoring</span>}
              </div>

              {!isCollapsed && (
                <div className="shrink-0 text-slate-400">
                  {openDropdowns.monitoring ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </div>
              )}
            </button>

            {/* Dropdown Items */}
            {openDropdowns.monitoring && !isCollapsed && (
              <div className="pl-9 pr-1 py-1 space-y-1 border-l-2 border-teal-500/20 ml-5 text-xs">
                <button
                  onClick={() => handleSelectCategory('monitoring', 'crops')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                    activeTab === 'monitoring' && monitoringSubTab === 'crops'
                      ? 'bg-teal-500/20 text-teal-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Field Crops Status</span>
                </button>
                <button
                  onClick={() => handleSelectCategory('monitoring', 'equipment')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                    activeTab === 'monitoring' && monitoringSubTab === 'equipment'
                      ? 'bg-teal-500/20 text-teal-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Equipment Health</span>
                </button>
                <button
                  onClick={() => handleSelectCategory('monitoring', 'livestock')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                    activeTab === 'monitoring' && monitoringSubTab === 'livestock'
                      ? 'bg-teal-500/20 text-teal-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Feather className="w-3.5 h-3.5 text-purple-400" />
                  <span>Livestock Status</span>
                </button>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            
            {/* Quick Log Action */}
            <button
              onClick={() => {
                onOpenQuickLog();
                if (setIsMobileOpen) setIsMobileOpen(false);
              }}
              className={`w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-purple-600 hover:from-emerald-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 border border-emerald-400/30 cursor-pointer ${
                isCollapsed ? 'px-2' : ''
              }`}
              title="Record Action Log"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Record Action Log</span>}
            </button>

            {/* Voice Assistant */}
            <button
              onClick={onStartVoice}
              className={`w-full py-2 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/30 text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                isCollapsed ? 'px-2' : ''
              }`}
              title="Voice Assistant"
            >
              <Mic className="w-4 h-4 text-purple-300 animate-pulse shrink-0" />
              {!isCollapsed && <span>Voice Assistant</span>}
            </button>

          </div>
        </div>

        {/* Sidebar Footer (Authentication & User Controls) */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between gap-2">
            
            {/* User Profile Card */}
            <div className="flex items-center space-x-2.5 overflow-hidden flex-1">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0 shadow-sm">
                {activeUser.avatar || '👤'}
              </div>

              {!isCollapsed && (
                <div className="overflow-hidden">
                  <div className="font-bold text-xs text-white truncate flex items-center gap-1">
                    <span>{activeUser.name}</span>
                    {isSuperAdmin && <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {isGuest ? (
                      <span className="text-amber-400 font-semibold">Guest View</span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">{activeUser.role}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {isGuest ? (
              <button
                onClick={onOpenLoginModal}
                className={`p-2 rounded-xl bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-500 hover:to-purple-500 text-white shadow-md transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                  !isCollapsed ? 'px-3' : ''
                }`}
                title="Sign In / Sign Up"
              >
                <LogIn className="w-4 h-4" />
                {!isCollapsed && <span className="text-xs font-bold ml-1.5">Sign In</span>}
              </button>
            ) : (
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  onClick={onOpenLoginModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                  title="Switch Account"
                >
                  <Users className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 transition-colors"
                  title="Log out to Guest"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>
        </div>

      </aside>
    </>
  );
}
