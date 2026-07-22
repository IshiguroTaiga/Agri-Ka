import React from 'react';
import { BookOpen, ClipboardList, Activity, PlusCircle } from 'lucide-react';

export default function MobileNavBar({ activeTab, setActiveTab, onOpenQuickLog }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-300 px-4 py-2 flex items-center justify-around shadow-2xl">
      <button
        onClick={() => setActiveTab('hub')}
        className={`flex flex-col items-center space-y-1 p-2 rounded-xl text-[10px] font-bold ${
          activeTab === 'hub' ? 'text-emerald-400 bg-emerald-950/60' : 'text-slate-400 hover:text-white'
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span>Wiki Hub</span>
      </button>

      <button
        onClick={() => setActiveTab('inventory')}
        className={`flex flex-col items-center space-y-1 p-2 rounded-xl text-[10px] font-bold ${
          activeTab === 'inventory' ? 'text-purple-400 bg-purple-950/60' : 'text-slate-400 hover:text-white'
        }`}
      >
        <ClipboardList className="w-5 h-5" />
        <span>Inventory</span>
      </button>

      <button
        onClick={onOpenQuickLog}
        className="flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-500 to-purple-600 text-white rounded-full w-12 h-12 -mt-5 shadow-lg shadow-emerald-500/40 border-2 border-slate-900"
      >
        <PlusCircle className="w-6 h-6" />
      </button>

      <button
        onClick={() => setActiveTab('monitoring')}
        className={`flex flex-col items-center space-y-1 p-2 rounded-xl text-[10px] font-bold ${
          activeTab === 'monitoring' ? 'text-teal-400 bg-teal-950/60' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Activity className="w-5 h-5" />
        <span>Monitor</span>
      </button>
    </div>
  );
}
