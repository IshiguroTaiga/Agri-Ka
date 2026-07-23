import React, { useState } from 'react';
import { 
  ClipboardList, Package, DollarSign, Plus, CheckCircle, 
  Search, RefreshCw, Lock, Edit3, Trash2, X, Check, Eye, EyeOff
} from 'lucide-react';
import MediaInput from './MediaInput';
import MediaDisplay from './MediaDisplay';

export default function RecordInventory({ 
  auditLogs, 
  inventoryItems, 
  financials, 
  activeUser, 
  onOpenQuickLog, 
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  onToggleHideFinancial,
  onAddInventoryItem,
  onUpdateInventoryItem,
  onDeleteInventoryItem,
  onToggleHideInventoryItem,
  onUpdateAuditLog,
  onDeleteAuditLog,
  onToggleHideAuditLog,
  onToggleEquipmentStatus,
  onOpenLoginModal
}) {
  const [subTab, setSubTab] = useState('logs'); // 'logs', 'inventory', 'financials'
  const [inventorySearch, setInventorySearch] = useState('');

  const isSuperAdmin = activeUser?.roleCode === 'super_admin' || activeUser?.role === 'Super Admin' || activeUser?.username?.toLowerCase() === 'ishi';

  // Modals state
  const [showFinModal, setShowFinModal] = useState(false);
  const [editingFin, setEditingFin] = useState(null);

  const [showInvModal, setShowInvModal] = useState(false);
  const [editingInv, setEditingInv] = useState(null);

  const [showLogEditModal, setShowLogEditModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  const [previewMedia, setPreviewMedia] = useState(null);

  // Form states - Financials
  const [finTitle, setFinTitle] = useState('');
  const [finType, setFinType] = useState('Income');
  const [finAmount, setFinAmount] = useState('');
  const [finCategory, setFinCategory] = useState('Crop Sales');
  const [finMediaUrl, setFinMediaUrl] = useState('');
  const [finMediaType, setFinMediaType] = useState('image');

  // Form states - Inventory
  const [invCode, setInvCode] = useState('');
  const [invName, setInvName] = useState('');
  const [invCategory, setInvCategory] = useState('Machinery');
  const [invStatus, setInvStatus] = useState('Operational');
  const [invLocation, setInvLocation] = useState('Central Shed');
  const [invStockQty, setInvStockQty] = useState('1');
  const [invUnit, setInvUnit] = useState('unit');
  const [invNotes, setInvNotes] = useState('');
  const [invMediaUrl, setInvMediaUrl] = useState('');
  const [invMediaType, setInvMediaType] = useState('image');

  // Form states - Log Editing
  const [logActionType, setLogActionType] = useState('Planting & Sowing');
  const [logItemTagged, setLogItemTagged] = useState('');
  const [logCategory, setLogCategory] = useState('Crops');
  const [logLocation, setLogLocation] = useState('');
  const [logQtyDetails, setLogQtyDetails] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [logMediaUrl, setLogMediaUrl] = useState('');
  const [logMediaType, setLogMediaType] = useState('image');

  const isGuest = activeUser?.isGuest;

  const displayLogs = auditLogs.filter(log => isSuperAdmin || !log.isHidden);
  const displayInventory = inventoryItems.filter(item => {
    if (item.isHidden && !isSuperAdmin) return false;
    return item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
           (item.code && item.code.toLowerCase().includes(inventorySearch.toLowerCase()));
  });
  const displayFinancials = financials.transactions.filter(t => isSuperAdmin || !t.isHidden);

  const handleOpenAddLog = () => {
    if (isGuest) onOpenLoginModal();
    else onOpenQuickLog();
  };

  // --- Financial Handlers ---
  const handleOpenFinModal = (item = null) => {
    if (isGuest) {
      onOpenLoginModal();
      return;
    }
    if (item) {
      setEditingFin(item);
      setFinTitle(item.title);
      setFinType(item.type);
      setFinAmount(item.amount);
      setFinCategory(item.category || 'Crop Sales');
      setFinMediaUrl(item.mediaUrl || '');
      setFinMediaType(item.mediaType || 'image');
    } else {
      setEditingFin(null);
      setFinTitle('');
      setFinType('Income');
      setFinAmount('');
      setFinCategory('Crop Sales');
      setFinMediaUrl('');
      setFinMediaType('image');
    }
    setShowFinModal(true);
  };

  const handleFinancialSubmit = (e) => {
    e.preventDefault();
    if (!finTitle || !finAmount) return;

    const payload = {
      id: editingFin ? editingFin.id : `fin-${Date.now()}`,
      date: editingFin ? editingFin.date : new Date().toISOString().split('T')[0],
      title: finTitle,
      type: finType,
      amount: parseFloat(finAmount),
      category: finCategory,
      loggedBy: activeUser.name,
      mediaUrl: finMediaUrl,
      mediaType: finMediaType,
      isHidden: editingFin ? editingFin.isHidden : false
    };

    if (editingFin) {
      onUpdateTransaction(payload);
    } else {
      onAddTransaction(payload);
    }
    setShowFinModal(false);
  };

  const handleDeleteFin = (id) => {
    if (isGuest) {
      onOpenLoginModal();
      return;
    }
    if (window.confirm('Delete this financial transaction?')) {
      onDeleteTransaction(id);
    }
  };

  // --- Inventory Handlers ---
  const handleOpenInvModal = (item = null) => {
    if (isGuest) {
      onOpenLoginModal();
      return;
    }
    if (item) {
      setEditingInv(item);
      setInvCode(item.code || '');
      setInvName(item.name || '');
      setInvCategory(item.category || 'Machinery');
      setInvStatus(item.status || 'Operational');
      setInvLocation(item.location || 'Central Shed');
      setInvStockQty(item.stockQty || 1);
      setInvUnit(item.unit || 'unit');
      setInvNotes(item.notes || '');
      setInvMediaUrl(item.mediaUrl || '');
      setInvMediaType(item.mediaType || 'image');
    } else {
      setEditingInv(null);
      setInvCode(`EQ-${Math.floor(100 + Math.random() * 900)}`);
      setInvName('');
      setInvCategory('Machinery');
      setInvStatus('Operational');
      setInvLocation('Central Shed');
      setInvStockQty('1');
      setInvUnit('unit');
      setInvNotes('');
      setInvMediaUrl('');
      setInvMediaType('image');
    }
    setShowInvModal(true);
  };

  const handleInventorySubmit = (e) => {
    e.preventDefault();
    if (!invName) return;

    const payload = {
      id: editingInv ? editingInv.id : `inv-${Date.now()}`,
      code: invCode || `EQ-${Math.floor(100 + Math.random() * 900)}`,
      name: invName,
      category: invCategory,
      status: invStatus,
      location: invLocation,
      stockQty: parseFloat(invStockQty) || 1,
      unit: invUnit,
      notes: invNotes,
      mediaUrl: invMediaUrl,
      mediaType: invMediaType,
      isHidden: editingInv ? editingInv.isHidden : false
    };

    if (editingInv) {
      onUpdateInventoryItem(payload);
    } else {
      onAddInventoryItem(payload);
    }
    setShowInvModal(false);
  };

  const handleDeleteInv = (id) => {
    if (isGuest) {
      onOpenLoginModal();
      return;
    }
    if (window.confirm('Delete this inventory item?')) {
      onDeleteInventoryItem(id);
    }
  };

  // --- Audit Log Handlers ---
  const handleOpenLogEdit = (log) => {
    if (isGuest) {
      onOpenLoginModal();
      return;
    }
    setEditingLog(log);
    setLogActionType(log.actionType || 'Planting & Sowing');
    setLogItemTagged(log.itemTagged || '');
    setLogCategory(log.category || 'Crops');
    setLogLocation(log.location || '');
    setLogQtyDetails(log.quantityDetails || '');
    setLogNotes(log.notes || '');
    setLogMediaUrl(log.mediaUrl || '');
    setLogMediaType(log.mediaType || 'image');
    setShowLogEditModal(true);
  };

  const handleLogEditSubmit = (e) => {
    e.preventDefault();
    if (!editingLog || !logItemTagged) return;

    const updatedLog = {
      ...editingLog,
      actionType: logActionType,
      itemTagged: logItemTagged,
      category: logCategory,
      location: logLocation,
      quantityDetails: logQtyDetails,
      notes: logNotes,
      mediaUrl: logMediaUrl,
      mediaType: logMediaType
    };

    onUpdateAuditLog(updatedLog);
    setShowLogEditModal(false);
    setEditingLog(null);
  };

  const handleDeleteLog = (id) => {
    if (isGuest) {
      onOpenLoginModal();
      return;
    }
    if (window.confirm('Delete this activity log?')) {
      onDeleteAuditLog(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tab Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-purple-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setSubTab('logs')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              subTab === 'logs'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Activity Logs ({displayLogs.length})</span>
          </button>

          <button
            onClick={() => setSubTab('inventory')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              subTab === 'inventory'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Tools & Inventory ({displayInventory.length})</span>
          </button>

          <button
            onClick={() => setSubTab('financials')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              subTab === 'financials'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Financial & Money</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {subTab === 'inventory' && (
            <button
              onClick={() => handleOpenInvModal()}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Equipment / Tool</span>
            </button>
          )}

          {subTab === 'logs' && (
            <button
              onClick={handleOpenAddLog}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md cursor-pointer ${
                isGuest 
                  ? 'bg-slate-700 hover:bg-slate-800 text-slate-200' 
                  : 'bg-gradient-to-r from-emerald-600 to-purple-600 text-white'
              }`}
            >
              {isGuest ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Plus className="w-4 h-4" />}
              <span>{isGuest ? 'Login to Record Log' : 'New Log Record'}</span>
            </button>
          )}

          {subTab === 'financials' && (
            <button
              onClick={() => handleOpenFinModal()}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md cursor-pointer ${
                isGuest ? 'bg-slate-700 text-slate-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isGuest ? <Lock className="w-3.5 h-3.5 text-amber-300" /> : <Plus className="w-4 h-4" />}
              <span>{isGuest ? 'Login to Add Money Record' : 'Add Money Record'}</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: ACTIVITY LOGS */}
      {subTab === 'logs' && (
        <div className="space-y-4">
          {displayLogs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-purple-100 shadow-sm space-y-4 max-w-xl mx-auto my-8">
              <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center mx-auto text-2xl font-bold">
                📋
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Activity Logs Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isGuest 
                  ? 'You are currently in Guest Mode. Login to record farm operations and track accountability.'
                  : 'Start recording field activities (who planted what, who used equipment, animal moves).'
                }
              </p>
              <button
                onClick={handleOpenAddLog}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs inline-flex items-center space-x-2 shadow-md cursor-pointer"
              >
                {isGuest ? <Lock className="w-4 h-4 text-amber-300" /> : <Plus className="w-4 h-4" />}
                <span>{isGuest ? 'Login to Add First Log' : 'Record First Activity Log'}</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Media</th>
                      <th className="p-4">Timestamp & User</th>
                      <th className="p-4">Action Type</th>
                      <th className="p-4">Item Tagged</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Details</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayLogs.map(log => (
                      <tr key={log.id} className={`hover:bg-purple-50/40 transition-colors ${log.isHidden ? 'bg-amber-50/30' : ''}`}>
                        <td className="p-4 w-20">
                          {log.mediaUrl ? (
                            <button
                              onClick={() => setPreviewMedia({ url: log.mediaUrl, type: log.mediaType, title: log.itemTagged })}
                              className="w-12 h-12 rounded-xl overflow-hidden border border-purple-200 relative group cursor-pointer"
                            >
                              <MediaDisplay mediaUrl={log.mediaUrl} mediaType={log.mediaType} showBadge={false} />
                              <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="w-4 h-4" />
                              </div>
                            </button>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs">
                              No clip
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <span>{log.user}</span>
                            {log.isHidden && isSuperAdmin && (
                              <span className="bg-amber-950 text-amber-300 border border-amber-400/60 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <EyeOff className="w-3 h-3 text-amber-400" /> Hidden
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                            {log.actionType}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-slate-900">{log.itemTagged}</td>
                        <td className="p-4 text-slate-700">{log.location}</td>
                        <td className="p-4 font-semibold text-slate-800">{log.quantityDetails}</td>
                        <td className="p-4 text-right space-x-1.5">
                          {!isGuest && (
                            <>
                              <button
                                onClick={() => handleOpenLogEdit(log)}
                                className="p-1.5 text-purple-700 hover:bg-purple-100 rounded-lg cursor-pointer"
                                title="Edit Log"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteLog(log.id)}
                                className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer"
                                title="Delete Log"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {isSuperAdmin && (
                            <button
                              onClick={() => onToggleHideAuditLog && onToggleHideAuditLog(log.id, !log.isHidden)}
                              className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                                log.isHidden ? 'bg-amber-900 text-amber-300 hover:bg-amber-800' : 'text-slate-500 hover:bg-slate-200'
                              }`}
                              title={log.isHidden ? "Unhide Log" : "Hide Log"}
                            >
                              {log.isHidden ? <Eye className="w-4 h-4 text-amber-300" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: TOOLS & EQUIPMENT INVENTORY */}
      {subTab === 'inventory' && (
        <div className="space-y-4">
          {displayInventory.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-emerald-100 shadow-sm space-y-4 max-w-xl mx-auto my-8">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
                📦
              </div>
              <h3 className="text-xl font-bold text-slate-900">Inventory is Empty</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No machinery or tools recorded yet. Click <span className="font-bold text-emerald-700">"Add Equipment / Tool"</span> to save items with attached photos/video clips.
              </p>
              <button
                onClick={() => handleOpenInvModal()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs inline-flex items-center space-x-2 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Equipment</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
              {displayInventory.map(item => (
                <div key={item.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col justify-between group ${item.isHidden ? 'border-amber-400/80 bg-amber-50/20 ring-2 ring-amber-400/30' : 'border-slate-200'}`}>
                  <div>
                    {item.mediaUrl && (
                      <div className="relative h-40 bg-slate-900 overflow-hidden">
                        <MediaDisplay mediaUrl={item.mediaUrl} mediaType={item.mediaType} altTitle={item.name} />
                      </div>
                    )}
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold uppercase text-slate-400">{item.code}</span>
                            {item.isHidden && isSuperAdmin && (
                              <span className="bg-amber-950 text-amber-300 border border-amber-400/60 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <EyeOff className="w-3 h-3 text-amber-400" /> Hidden
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          {item.status}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Qty:</span>
                          <span className="font-bold">{item.stockQty} {item.unit || 'pcs'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span>{item.location}</span>
                        </div>
                        {item.notes && <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">{item.notes}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <button
                      onClick={() => isGuest ? onOpenLoginModal() : onToggleEquipmentStatus(item.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {isGuest ? <Lock className="w-3 h-3 text-amber-300" /> : <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>Toggle Status</span>
                    </button>

                    <div className="flex items-center space-x-1">
                      {!isGuest && (
                        <>
                          <button
                            onClick={() => handleOpenInvModal(item)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg cursor-pointer"
                            title="Edit Equipment"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteInv(item.id)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer"
                            title="Delete Equipment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {isSuperAdmin && (
                        <button
                          onClick={() => onToggleHideInventoryItem && onToggleHideInventoryItem(item.id, !item.isHidden)}
                          className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                            item.isHidden ? 'bg-amber-900 text-amber-300 hover:bg-amber-800' : 'text-slate-500 hover:bg-slate-200'
                          }`}
                          title={item.isHidden ? "Unhide Equipment" : "Hide Equipment"}
                        >
                          {item.isHidden ? <Eye className="w-4 h-4 text-amber-300" /> : <EyeOff className="w-4 h-4" />}
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

      {/* SUB-TAB 3: FINANCIALS */}
      {subTab === 'financials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm">
              <div className="text-slate-400 text-xs font-bold uppercase mb-1">Total Revenue</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">₱{(financials.summary?.totalRevenue || 0).toLocaleString()}</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-purple-200 shadow-sm">
              <div className="text-slate-400 text-xs font-bold uppercase mb-1">Total Expenses</div>
              <div className="text-2xl sm:text-3xl font-black text-purple-600">₱{(financials.summary?.totalExpenses || 0).toLocaleString()}</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-sm">
              <div className="text-slate-400 text-xs font-bold uppercase mb-1">Net Farm Profit</div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-600">₱{(financials.summary?.netProfit || 0).toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg">Money Ledger</h3>

              <button
                onClick={() => handleOpenFinModal()}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-md cursor-pointer ${
                  isGuest ? 'bg-slate-700 text-slate-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isGuest ? <Lock className="w-3.5 h-3.5 text-amber-300" /> : <Plus className="w-4 h-4" />}
                <span>{isGuest ? 'Login to Add Money Record' : 'Add Money Record'}</span>
              </button>
            </div>

            {displayFinancials.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No financial transactions logged yet in database.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-3.5">Media</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Description</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayFinancials.map(t => (
                      <tr key={t.id} className={t.isHidden ? 'bg-amber-50/30' : ''}>
                        <td className="p-3.5 w-16">
                          {t.mediaUrl ? (
                            <button
                              onClick={() => setPreviewMedia({ url: t.mediaUrl, type: t.mediaType, title: t.title })}
                              className="w-10 h-10 rounded-lg overflow-hidden border border-indigo-200 relative group cursor-pointer"
                            >
                              <MediaDisplay mediaUrl={t.mediaUrl} mediaType={t.mediaType} showBadge={false} />
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-300">—</span>
                          )}
                        </td>
                        <td className="p-3.5">{t.date}</td>
                        <td className="p-3.5 font-bold">
                          <div className="flex items-center gap-1.5">
                            <span>{t.title}</span>
                            {t.isHidden && isSuperAdmin && (
                              <span className="bg-amber-950 text-amber-300 border border-amber-400/60 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <EyeOff className="w-3 h-3 text-amber-400" /> Hidden
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${t.type === 'Income' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {t.type}
                          </span>
                        </td>
                        <td className={`p-3.5 font-bold ${t.type === 'Income' ? 'text-emerald-600' : 'text-red-600'}`}>
                          ₱{t.amount.toLocaleString()}
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          {!isGuest && (
                            <>
                              <button
                                onClick={() => handleOpenFinModal(t)}
                                className="p-1.5 text-indigo-700 hover:bg-indigo-100 rounded-lg cursor-pointer"
                                title="Edit Transaction"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFin(t.id)}
                                className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer"
                                title="Delete Transaction"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {isSuperAdmin && (
                            <button
                              onClick={() => onToggleHideFinancial && onToggleHideFinancial(t.id, !t.isHidden)}
                              className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                                t.isHidden ? 'bg-amber-900 text-amber-300 hover:bg-amber-800' : 'text-slate-500 hover:bg-slate-200'
                              }`}
                              title={t.isHidden ? "Unhide Financial Record" : "Hide Financial Record"}
                            >
                              {t.isHidden ? <Eye className="w-4 h-4 text-amber-300" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Financial Transaction Modal */}
      {showFinModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleFinancialSubmit} className="bg-white rounded-3xl p-6 max-w-md w-full border border-indigo-200 shadow-2xl space-y-4 my-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingFin ? 'Edit Money Record' : 'Log Money Transaction'}
              </h3>
              <button type="button" onClick={() => setShowFinModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <input 
                type="text" 
                required 
                value={finTitle} 
                onChange={e => setFinTitle(e.target.value)} 
                placeholder="e.g. Bulk Harvest Sale" 
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Type</label>
                <select value={finType} onChange={e => setFinType(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold">
                  <option value="Income">Income (+)</option>
                  <option value="Expense">Expense (-)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Amount (₱)</label>
                <input 
                  type="number" 
                  required 
                  value={finAmount} 
                  onChange={e => setFinAmount(e.target.value)} 
                  placeholder="0.00" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none font-bold"
                />
              </div>
            </div>

            {/* Media Attachment for Receipt */}
            <MediaInput
              mediaUrl={finMediaUrl}
              setMediaUrl={setFinMediaUrl}
              mediaType={finMediaType}
              setMediaType={setFinMediaType}
            />

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => setShowFinModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-md cursor-pointer flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{editingFin ? 'Update Record' : 'Save Record'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add / Edit Inventory Modal */}
      {showInvModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleInventorySubmit} className="bg-white rounded-3xl p-6 max-w-md w-full border border-emerald-200 shadow-2xl space-y-4 my-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingInv ? 'Edit Inventory Item' : 'Add Inventory Item'}
              </h3>
              <button type="button" onClick={() => setShowInvModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Code</label>
                <input 
                  type="text" 
                  value={invCode} 
                  onChange={e => setInvCode(e.target.value)} 
                  placeholder="EQ-101" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                <select value={invCategory} onChange={e => setInvCategory(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold">
                  <option value="Machinery">Machinery & Vehicles</option>
                  <option value="Tools">Hand Tools</option>
                  <option value="Irrigation">Irrigation & Pumps</option>
                  <option value="Chemicals">Chemicals & Fertilizer</option>
                  <option value="Supplies">General Supplies</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Item Name</label>
              <input 
                type="text" 
                required 
                value={invName} 
                onChange={e => setInvName(e.target.value)} 
                placeholder="e.g. Kubota Mini Tractor" 
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                <select value={invStatus} onChange={e => setInvStatus(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold">
                  <option value="Operational">Operational</option>
                  <option value="In Use">In Use</option>
                  <option value="Under Maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stock Qty</label>
                <input 
                  type="number" 
                  value={invStockQty} 
                  onChange={e => setInvStockQty(e.target.value)} 
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Unit</label>
                <input 
                  type="text" 
                  value={invUnit} 
                  onChange={e => setInvUnit(e.target.value)} 
                  placeholder="pcs / kg" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
              <input 
                type="text" 
                value={invLocation} 
                onChange={e => setInvLocation(e.target.value)} 
                placeholder="Storage Shed A" 
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            {/* Media Attachment for Equipment Photo/Video */}
            <MediaInput
              mediaUrl={invMediaUrl}
              setMediaUrl={setInvMediaUrl}
              mediaType={invMediaType}
              setMediaType={setInvMediaType}
            />

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => setShowInvModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-md cursor-pointer flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{editingInv ? 'Update Equipment' : 'Save Equipment'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Audit Log Modal */}
      {showLogEditModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleLogEditSubmit} className="bg-white rounded-3xl p-6 max-w-md w-full border border-purple-200 shadow-2xl space-y-4 my-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Edit Activity Log</h3>
              <button type="button" onClick={() => setShowLogEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Action Type</label>
              <input 
                type="text" 
                required 
                value={logActionType} 
                onChange={e => setLogActionType(e.target.value)} 
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Item Tagged</label>
                <input 
                  type="text" 
                  required 
                  value={logItemTagged} 
                  onChange={e => setLogItemTagged(e.target.value)} 
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                <input 
                  type="text" 
                  required 
                  value={logLocation} 
                  onChange={e => setLogLocation(e.target.value)} 
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Details & Quantity</label>
              <input 
                type="text" 
                required 
                value={logQtyDetails} 
                onChange={e => setLogQtyDetails(e.target.value)} 
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <MediaInput
              mediaUrl={logMediaUrl}
              setMediaUrl={setLogMediaUrl}
              mediaType={logMediaType}
              setMediaType={setLogMediaType}
            />

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => setShowLogEditModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white shadow-md cursor-pointer flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Update Log</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Media Lightbox Modal */}
      {previewMedia && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 p-4 space-y-3">
            <div className="flex justify-between items-center text-white px-2">
              <h4 className="font-bold text-sm">{previewMedia.title || 'Attached Media Clip'}</h4>
              <button onClick={() => setPreviewMedia(null)} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
            </div>
            <div className="h-[60vh]">
              <MediaDisplay mediaUrl={previewMedia.url} mediaType={previewMedia.type} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
