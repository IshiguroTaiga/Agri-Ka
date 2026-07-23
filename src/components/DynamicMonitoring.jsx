import React, { useState } from 'react';
import { 
  Activity, Sprout, Truck, Feather, Plus, Lock, CheckCircle2, 
  AlertTriangle, RefreshCw, X, ShieldCheck, Edit3, Trash2, Check, Eye, EyeOff
} from 'lucide-react';
import MediaInput from './MediaInput';
import MediaDisplay from './MediaDisplay';

export default function DynamicMonitoring({ 
  monitoringData, 
  onAddStatusEntry,
  onUpdateStatusEntry,
  onDeleteStatusEntry,
  onToggleHideMonitoringEntry,
  isGuest,
  activeUser,
  onOpenLoginModal
}) {
  const [activeTab, setActiveTab] = useState('crops'); // 'crops', 'equipment', 'livestock'
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const isSuperAdmin = activeUser?.roleCode === 'super_admin' || activeUser?.role === 'Super Admin' || activeUser?.username?.toLowerCase() === 'ishi';

  // Form state for adding/editing status update
  const [itemType, setItemType] = useState('crop'); // 'crop', 'equipment', 'livestock'
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Healthy / Operational');
  const [details, setDetails] = useState('');
  const [crop, setCrop] = useState('');
  const [stage, setStage] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('image');

  const displayFields = (monitoringData.fields || []).filter(f => isSuperAdmin || !f.isHidden);
  const displayEquipment = (monitoringData.equipment || []).filter(e => isSuperAdmin || !e.isHidden);
  const displayLivestock = (monitoringData.livestock || []).filter(l => isSuperAdmin || !l.isHidden);

  const resetForm = () => {
    setName('');
    setLocation('');
    setStatus('Healthy / Operational');
    setDetails('');
    setCrop('');
    setStage('');
    setMediaUrl('');
    setMediaType('image');
    setEditingEntry(null);
  };

  const handleOpenAddStatus = (typeOverride = null) => {
    if (isGuest) {
      onOpenLoginModal();
      return;
    }
    resetForm();
    if (typeOverride) setItemType(typeOverride);
    else setItemType(activeTab === 'crops' ? 'crop' : activeTab === 'equipment' ? 'equipment' : 'livestock');
    setShowAddModal(true);
  };

  const handleOpenEditStatus = (item, type, e) => {
    e?.stopPropagation();
    if (isGuest) {
      onOpenLoginModal();
      return;
    }
    setEditingEntry(item);
    setItemType(type);
    setName(item.name || '');
    setLocation(item.location || '');
    setStatus(item.status || 'Healthy / Operational');
    setDetails(item.details || '');
    setCrop(item.crop || '');
    setStage(item.stage || '');
    setMediaUrl(item.mediaUrl || '');
    setMediaType(item.mediaType || 'image');
    setShowAddModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !location) return;

    const payload = {
      type: itemType,
      item: {
        id: editingEntry ? editingEntry.id : `status-${Date.now()}`,
        name,
        location,
        status,
        details: details || 'Status updated via app',
        crop: itemType === 'crop' ? crop : undefined,
        stage: itemType === 'crop' ? stage : undefined,
        lastUpdated: new Date().toLocaleDateString(),
        mediaUrl,
        mediaType,
        isHidden: editingEntry ? editingEntry.isHidden : false
      }
    };

    if (editingEntry) {
      onUpdateStatusEntry(payload);
    } else {
      onAddStatusEntry(payload);
    }

    resetForm();
    setShowAddModal(false);
  };

  const handleDeleteStatus = (id, type, e) => {
    e?.stopPropagation();
    if (isGuest) {
      onOpenLoginModal();
      return;
    }
    if (window.confirm('Delete this monitoring entry?')) {
      onDeleteStatusEntry({ id, type });
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Monitoring Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-purple-950 text-white p-6 rounded-3xl shadow-xl border border-teal-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Real-Time Farm Status Dashboard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Dynamic Monitoring System</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Live operational status tracker for crops, livestock health, machinery condition, and field readiness with image & video clips.
          </p>
        </div>

        <button
          onClick={() => handleOpenAddStatus()}
          className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-lg transition-all border border-emerald-400/30 cursor-pointer ${
            isGuest 
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
          }`}
        >
          {isGuest ? <Lock className="w-4 h-4 text-amber-400" /> : <Plus className="w-4 h-4" />}
          <span>{isGuest ? 'Login to Update Status' : 'Update / Add Status'}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('crops')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'crops'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>🌾 Crops & Fields Status ({displayFields.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('equipment')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'equipment'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>🚜 Machines & Equipment Status ({displayEquipment.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('livestock')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'livestock'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
            }`}
          >
            <Feather className="w-4 h-4" />
            <span>🐄 Livestock & Animals Status ({displayLivestock.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CROPS & FIELDS STATUS */}
      {activeTab === 'crops' && (
        <div className="space-y-4">
          {displayFields.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-emerald-100 shadow-sm space-y-4 max-w-xl mx-auto my-8">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
                🌾
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Crop Status Entries Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No crops or fields logged yet. Click <span className="font-bold text-emerald-700">"Update / Add Status"</span> to record crop growth with video clips and photos saved.
              </p>
              <button
                onClick={() => handleOpenAddStatus('crop')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs inline-flex items-center space-x-2 shadow-md cursor-pointer"
              >
                {isGuest ? <Lock className="w-4 h-4 text-amber-300" /> : <Plus className="w-4 h-4" />}
                <span>{isGuest ? 'Login to Add Crop Status' : 'Add First Crop Status'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
              {displayFields.map(field => (
                <div key={field.id} className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group ${field.isHidden ? 'border-amber-400/80 bg-amber-50/20 ring-2 ring-amber-400/30' : 'border-slate-200'}`}>
                  <div>
                    {field.mediaUrl && (
                      <div className="relative h-44 bg-slate-900 overflow-hidden">
                        <MediaDisplay mediaUrl={field.mediaUrl} mediaType={field.mediaType} altTitle={field.name} />
                      </div>
                    )}
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold uppercase text-slate-400">{field.location || 'Field Sector'}</span>
                            {field.isHidden && isSuperAdmin && (
                              <span className="bg-amber-950 text-amber-300 border border-amber-400/60 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <EyeOff className="w-3 h-3 text-amber-400" /> Hidden
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-900 text-base">{field.name}</h3>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {field.status}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
                        {field.crop && <div className="flex justify-between"><span className="text-slate-500">Variety:</span><span className="font-bold text-slate-800">{field.crop}</span></div>}
                        {field.stage && <div className="flex justify-between"><span className="text-slate-500">Growth Stage:</span><span className="font-bold text-purple-700">{field.stage}</span></div>}
                        {field.details && <div className="text-slate-600 italic pt-1 border-t border-slate-200/60">{field.details}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-4 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-3 bg-slate-50/40">
                    <span>Updated: {field.lastUpdated || 'Today'}</span>
                    <div className="flex items-center space-x-1">
                      {!isGuest && (
                        <>
                          <button
                            onClick={(e) => handleOpenEditStatus(field, 'crop', e)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg cursor-pointer"
                            title="Edit Entry"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteStatus(field.id, 'crop', e)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {isSuperAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleHideMonitoringEntry && onToggleHideMonitoringEntry(field.id, !field.isHidden);
                          }}
                          className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                            field.isHidden ? 'bg-amber-900 text-amber-300 hover:bg-amber-800' : 'text-slate-500 hover:bg-slate-200'
                          }`}
                          title={field.isHidden ? "Unhide Entry" : "Hide Entry"}
                        >
                          {field.isHidden ? <Eye className="w-3.5 h-3.5 text-amber-300" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MACHINES & EQUIPMENT STATUS */}
      {activeTab === 'equipment' && (
        <div className="space-y-4">
          {displayEquipment.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-purple-100 shadow-sm space-y-4 max-w-xl mx-auto my-8">
              <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center mx-auto text-2xl font-bold">
                🚜
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Equipment Status Entries</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No machinery condition records available yet. Add tractor or pump operational statuses with media clips.
              </p>
              <button
                onClick={() => handleOpenAddStatus('equipment')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs inline-flex items-center space-x-2 shadow-md cursor-pointer"
              >
                {isGuest ? <Lock className="w-4 h-4 text-amber-300" /> : <Plus className="w-4 h-4" />}
                <span>{isGuest ? 'Login to Add Equipment Status' : 'Add First Equipment Status'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
              {displayEquipment.map(eq => (
                <div key={eq.id} className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between ${eq.isHidden ? 'border-amber-400/80 bg-amber-50/20 ring-2 ring-amber-400/30' : 'border-slate-200'}`}>
                  <div>
                    {eq.mediaUrl && (
                      <div className="relative h-44 bg-slate-900 overflow-hidden">
                        <MediaDisplay mediaUrl={eq.mediaUrl} mediaType={eq.mediaType} altTitle={eq.name} />
                      </div>
                    )}
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold uppercase text-slate-400">{eq.location || 'Shed / Field'}</span>
                            {eq.isHidden && isSuperAdmin && (
                              <span className="bg-amber-950 text-amber-300 border border-amber-400/60 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <EyeOff className="w-3 h-3 text-amber-400" /> Hidden
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-900 text-base">{eq.name}</h3>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                          {eq.status}
                        </span>
                      </div>

                      {eq.details && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 italic">
                          {eq.details}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 pb-4 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-3 bg-slate-50/40">
                    <span>Updated: {eq.lastUpdated || 'Today'}</span>
                    <div className="flex items-center space-x-1">
                      {!isGuest && (
                        <>
                          <button
                            onClick={(e) => handleOpenEditStatus(eq, 'equipment', e)}
                            className="p-1.5 text-purple-700 hover:bg-purple-100 rounded-lg cursor-pointer"
                            title="Edit Equipment"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteStatus(eq.id, 'equipment', e)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer"
                            title="Delete Equipment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {isSuperAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleHideMonitoringEntry && onToggleHideMonitoringEntry(eq.id, !eq.isHidden);
                          }}
                          className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                            eq.isHidden ? 'bg-amber-900 text-amber-300 hover:bg-amber-800' : 'text-slate-500 hover:bg-slate-200'
                          }`}
                          title={eq.isHidden ? "Unhide Equipment Status" : "Hide Equipment Status"}
                        >
                          {eq.isHidden ? <Eye className="w-3.5 h-3.5 text-amber-300" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LIVESTOCK & ANIMALS STATUS */}
      {activeTab === 'livestock' && (
        <div className="space-y-4">
          {displayLivestock.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-indigo-100 shadow-sm space-y-4 max-w-xl mx-auto my-8">
              <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto text-2xl font-bold">
                🐄
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Livestock Status Entries</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No livestock health records available. Record animal status with live video clips or photos.
              </p>
              <button
                onClick={() => handleOpenAddStatus('livestock')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs inline-flex items-center space-x-2 shadow-md cursor-pointer"
              >
                {isGuest ? <Lock className="w-4 h-4 text-amber-300" /> : <Plus className="w-4 h-4" />}
                <span>{isGuest ? 'Login to Add Livestock Status' : 'Add First Livestock Status'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
              {displayLivestock.map(ls => (
                <div key={ls.id} className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between ${ls.isHidden ? 'border-amber-400/80 bg-amber-50/20 ring-2 ring-amber-400/30' : 'border-indigo-100'}`}>
                  <div>
                    {ls.mediaUrl && (
                      <div className="relative h-44 bg-slate-900 overflow-hidden">
                        <MediaDisplay mediaUrl={ls.mediaUrl} mediaType={ls.mediaType} altTitle={ls.name} />
                      </div>
                    )}
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold uppercase text-slate-400">{ls.location || 'Barn Pen'}</span>
                            {ls.isHidden && isSuperAdmin && (
                              <span className="bg-amber-950 text-amber-300 border border-amber-400/60 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <EyeOff className="w-3 h-3 text-amber-400" /> Hidden
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-900 text-base">{ls.name || ls.type}</h3>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                          {ls.status}
                        </span>
                      </div>

                      {ls.details && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 italic">
                          {ls.details}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 pb-4 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-3 bg-slate-50/40">
                    <span>Updated: {ls.lastUpdated || 'Today'}</span>
                    <div className="flex items-center space-x-1">
                      {!isGuest && (
                        <>
                          <button
                            onClick={(e) => handleOpenEditStatus(ls, 'livestock', e)}
                            className="p-1.5 text-indigo-700 hover:bg-indigo-100 rounded-lg cursor-pointer"
                            title="Edit Livestock"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteStatus(ls.id, 'livestock', e)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer"
                            title="Delete Livestock"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {isSuperAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleHideMonitoringEntry && onToggleHideMonitoringEntry(ls.id, !ls.isHidden);
                          }}
                          className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                            ls.isHidden ? 'bg-amber-900 text-amber-300 hover:bg-amber-800' : 'text-slate-500 hover:bg-slate-200'
                          }`}
                          title={ls.isHidden ? "Unhide Livestock Status" : "Hide Livestock Status"}
                        >
                          {ls.isHidden ? <Eye className="w-3.5 h-3.5 text-amber-300" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Update Status Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl p-6 max-w-md w-full border border-teal-200 shadow-2xl space-y-4 my-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <span>{editingEntry ? 'Edit Status Entry' : 'Log Status Update'}</span>
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Category</label>
              <select 
                value={itemType} 
                onChange={e => setItemType(e.target.value)} 
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none"
              >
                <option value="crop">🌾 Crop / Field</option>
                <option value="equipment">🚜 Machine / Equipment</option>
                <option value="livestock">🐄 Livestock / Animals</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Asset Name</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="e.g. Hybrid Rice Field A, Tractor 01, Dairy Goats" 
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location / Enclosure</label>
              <input 
                type="text" 
                required 
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                placeholder="e.g. Sector B, Shed 1, Barn Pen 3" 
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-teal-500"
              />
            </div>

            {itemType === 'crop' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Crop Variety</label>
                  <input 
                    type="text" 
                    value={crop} 
                    onChange={e => setCrop(e.target.value)} 
                    placeholder="e.g. Jasmine Rice" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Growth Stage</label>
                  <input 
                    type="text" 
                    value={stage} 
                    onChange={e => setStage(e.target.value)} 
                    placeholder="e.g. Flowering" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Status</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value)} 
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none"
              >
                <option value="Healthy / Operational">Healthy / Operational</option>
                <option value="Under Treatment / Maintenance">Under Treatment / Maintenance</option>
                <option value="Needs Attention / Water">Needs Attention / Water</option>
                <option value="Ready for Harvest / Duty">Ready for Harvest / Duty</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status Details / Notes</label>
              <textarea 
                rows={2} 
                value={details} 
                onChange={e => setDetails(e.target.value)} 
                placeholder="Add observations..." 
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
              />
            </div>

            {/* Media attachment */}
            <MediaInput
              mediaUrl={mediaUrl}
              setMediaUrl={setMediaUrl}
              mediaType={mediaType}
              setMediaType={setMediaType}
            />

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)} 
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{editingEntry ? 'Update Status' : 'Save Status'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
