import React, { useState } from 'react';
import { BookOpen, ClipboardList, Activity, PlusCircle, ChevronDown, ChevronUp, Layers } from 'lucide-react';

export default function MobileNavBar({ activeTab, setActiveTab, onOpenQuickLog }) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      {/* Floating Pill Handle when Collapsed */}
      {isNavCollapsed && (
        <div className="flex justify-center pb-3 pointer-events-auto">
          <button
            onClick={() => setIsNavCollapsed(false)}
            className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 transition-all"
            title="Tap to expand mobile navigation bar"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Show Bottom Nav</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Bottom Navigation Bar */}
      <div 
        className={`bg-slate-900/98 backdrop-blur-xl border-t border-slate-800 text-slate-300 px-4 pt-2.5 pb-3 flex items-center justify-around shadow-2xl transition-transform duration-300 pointer-events-auto relative ${
          isNavCollapsed ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Collapse Handle Button */}
        <button
          onClick={() => setIsNavCollapsed(true)}
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white px-3 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5 cursor-pointer shadow-md"
          title="Minimize Navigation Bar"
        >
          <ChevronDown className="w-3.5 h-3.5" />
          <span>Hide</span>
        </button>

        {/* Wiki Hub Tab */}
        <button
          onClick={() => setActiveTab('hub')}
          className={`flex flex-col items-center space-y-1 p-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'hub' ? 'text-emerald-400 bg-emerald-950/60 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Wiki Hub</span>
        </button>

        {/* Inventory Tab */}
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex flex-col items-center space-y-1 p-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'inventory' ? 'text-purple-400 bg-purple-950/60 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span>Inventory</span>
        </button>

        {/* Quick Action Button */}
        <button
          onClick={onOpenQuickLog}
          className="flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-500 via-teal-500 to-purple-600 text-white rounded-full w-12 h-12 -mt-6 shadow-xl shadow-emerald-500/40 border-2 border-slate-900 active:scale-95 transition-transform cursor-pointer"
          title="Quick Action Log"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        {/* Monitor Tab */}
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`flex flex-col items-center space-y-1 p-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'monitoring' ? 'text-teal-400 bg-teal-950/60 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-5 h-5" />
          <span>Monitor</span>
        </button>
      </div>
    </div>
  );
}
