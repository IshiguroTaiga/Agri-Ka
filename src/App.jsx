import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import KnowledgeHub from './components/KnowledgeHub';
import RecordInventory from './components/RecordInventory';
import DynamicMonitoring from './components/DynamicMonitoring';
import QuickLogModal from './components/QuickLogModal';
import LoginModal from './components/LoginModal';
import MobileNavBar from './components/MobileNavBar';

import { 
  GUEST_USER,
  INITIAL_USERS, 
  INITIAL_KNOWLEDGE_BASE, 
  INITIAL_SEASONAL_GUIDE, 
  INITIAL_INVENTORY, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_FINANCIALS, 
  INITIAL_MONITORING_SENSORS 
} from './data/initialData';

import { 
  getKnowledgeItems, createKnowledgeItem, updateKnowledgeItem, toggleHideKnowledgeItem, deleteKnowledgeItem,
  getInventoryItems, createInventoryItem, updateInventoryItem, toggleHideInventoryItem, deleteInventoryItem,
  getAuditLogs, createAuditLog, updateAuditLog, toggleHideAuditLog, deleteAuditLog,
  getFinancials, createFinancial, updateFinancial, toggleHideFinancial, deleteFinancial,
  getMonitoringEntries, createMonitoringEntry, updateMonitoringEntry, toggleHideMonitoringEntry, deleteMonitoringEntry
} from './data/api';

export default function App() {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('agri_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_USERS;
  });

  const [activeUser, setActiveUser] = useState(() => {
    const saved = localStorage.getItem('agri_active_user');
    return saved ? JSON.parse(saved) : GUEST_USER;
  });

  // Sidebar & Navigation States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState('hub'); // 'hub', 'inventory', 'monitoring'
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'tech', 'knowledge', 'crops', 'livestock'
  const [inventorySubTab, setInventorySubTab] = useState('logs'); // 'logs', 'inventory', 'financials'
  const [monitoringSubTab, setMonitoringSubTab] = useState('crops'); // 'crops', 'equipment', 'livestock'

  const [searchQuery, setSearchQuery] = useState('');
  const [logoUrl, setLogoUrl] = useState(() => {
    return localStorage.getItem('agri_logo_url') || '/THerta_LogoWFrame.png';
  });

  // Module Data States
  const [knowledgeItems, setKnowledgeItems] = useState(() => {
    const saved = localStorage.getItem('agri_knowledge');
    return saved ? JSON.parse(saved) : INITIAL_KNOWLEDGE_BASE;
  });

  const [seasonalGuides] = useState(INITIAL_SEASONAL_GUIDE);

  const [inventoryItems, setInventoryItems] = useState(() => {
    const saved = localStorage.getItem('agri_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('agri_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [financials, setFinancials] = useState(() => {
    const saved = localStorage.getItem('agri_financials');
    return saved ? JSON.parse(saved) : INITIAL_FINANCIALS;
  });

  const [monitoringData, setMonitoringData] = useState(() => {
    const saved = localStorage.getItem('agri_monitoring');
    return saved ? JSON.parse(saved) : INITIAL_MONITORING_SENSORS;
  });

  // Modals State
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);

  // Fetch initial data from SQL Database & helper
  const fetchSqlData = async () => {
    const kb = await getKnowledgeItems();
    if (kb && Array.isArray(kb)) {
      setKnowledgeItems(kb);
    }

    const inv = await getInventoryItems();
    if (inv && Array.isArray(inv)) {
      setInventoryItems(inv);
    }

    const logs = await getAuditLogs();
    if (logs && Array.isArray(logs)) {
      setAuditLogs(logs);
    }

    const fins = await getFinancials();
    if (fins && Array.isArray(fins)) {
      let rev = 0;
      let exp = 0;
      fins.forEach(t => {
        if (t.type === 'Income') rev += Number(t.amount || 0);
        else exp += Number(t.amount || 0);
      });
      setFinancials({
        totalBudget: 500000,
        currency: '₱',
        summary: {
          totalRevenue: rev,
          totalExpenses: exp,
          netProfit: rev - exp,
          projectedHarvestValue: 350000
        },
        transactions: fins
      });
    }

    const mon = await getMonitoringEntries();
    if (mon && (mon.fields !== undefined || mon.equipment !== undefined || mon.livestock !== undefined)) {
      setMonitoringData(mon);
    }
  };

  useEffect(() => {
    fetchSqlData();
  }, []);

  // Instant Cross-Tab Sync via BroadcastChannel & window storage event
  useEffect(() => {
    let syncChannel;
    try {
      syncChannel = new BroadcastChannel('agri_ka_sync');
      syncChannel.onmessage = () => {
        fetchSqlData();
      };
    } catch (e) {}

    const handleStorageChange = () => {
      try {
        const savedKb = localStorage.getItem('agri_knowledge');
        if (savedKb) setKnowledgeItems(JSON.parse(savedKb));
        const savedInv = localStorage.getItem('agri_inventory');
        if (savedInv) setInventoryItems(JSON.parse(savedInv));
        const savedLogs = localStorage.getItem('agri_audit_logs');
        if (savedLogs) setAuditLogs(JSON.parse(savedLogs));
        const savedFins = localStorage.getItem('agri_financials');
        if (savedFins) setFinancials(JSON.parse(savedFins));
        const savedMon = localStorage.getItem('agri_monitoring');
        if (savedMon) setMonitoringData(JSON.parse(savedMon));
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (syncChannel) syncChannel.close();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Real-time EventSource Listener (SSE) & Polling Fallback
  useEffect(() => {
    let eventSource;

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/events');

        eventSource.onopen = () => {
          console.log('[Real-Time Sync] SSE connected successfully.');
        };

        eventSource.onmessage = (e) => {
          console.log('[Real-Time Sync] Received server change event:', e.data);
          fetchSqlData();
        };

        eventSource.onerror = (err) => {
          if (eventSource) eventSource.close();
          setTimeout(connectSSE, 2000);
        };
      } catch (err) {}
    };

    connectSSE();

    const pollInterval = setInterval(() => {
      fetchSqlData();
    }, 1500);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(pollInterval);
    };
  }, []);

  // Safe localStorage helper to prevent QuotaExceededError when uploading images/media
  const safeSetLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      try {
        const sanitized = JSON.parse(JSON.stringify(data, (k, v) => {
          if (typeof v === 'string' && v.startsWith('data:image') && v.length > 500) {
            return '';
          }
          return v;
        }));
        localStorage.setItem(key, JSON.stringify(sanitized));
      } catch (e) {}
    }

    try {
      const bc = new BroadcastChannel('agri_ka_sync');
      bc.postMessage({ key });
      bc.close();
    } catch (e) {}
  };

  // Sync state to localStorage for offline fallback
  useEffect(() => {
    safeSetLocalStorage('agri_users', users);
  }, [users]);

  useEffect(() => {
    safeSetLocalStorage('agri_active_user', activeUser);
  }, [activeUser]);

  useEffect(() => {
    try { localStorage.setItem('agri_logo_url', logoUrl); } catch (e) {}
  }, [logoUrl]);

  useEffect(() => {
    safeSetLocalStorage('agri_knowledge', knowledgeItems);
  }, [knowledgeItems]);

  useEffect(() => {
    safeSetLocalStorage('agri_inventory', inventoryItems);
  }, [inventoryItems]);

  useEffect(() => {
    safeSetLocalStorage('agri_audit_logs', auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    safeSetLocalStorage('agri_financials', financials);
  }, [financials]);

  useEffect(() => {
    safeSetLocalStorage('agri_monitoring', monitoringData);
  }, [monitoringData]);

  const handleLoginSuccess = (user) => {
    setActiveUser(user);
    if (!users.some(u => u.id === user.id)) {
      setUsers([user, ...users]);
    }
  };

  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const list = window.speechSynthesis.getVoices();
        if (list && list.length > 0) {
          setAvailableVoices(list);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleSpeakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();

      const nonMaleVoices = voices.filter(v => {
        const name = v.name.toLowerCase();
        return !(
          name.includes('david') || 
          name.includes('mark') || 
          name.includes('george') || 
          name.includes('richard') || 
          name.includes('james') || 
          name.includes('guy') || 
          name.includes('otoya') ||
          (name.includes('male') && !name.includes('female'))
        );
      });

      const selectedVoice = nonMaleVoices.find(v => 
        v.name.toLowerCase().includes('nanami') ||
        v.name.toLowerCase().includes('haruka') ||
        v.name.toLowerCase().includes('kyoko') ||
        v.name.toLowerCase().includes('mizuki') ||
        v.name.toLowerCase().includes('ayumi') ||
        v.name.toLowerCase().includes('jenny') ||
        v.name.toLowerCase().includes('aria') ||
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('victoria') ||
        v.name.toLowerCase().includes('google us english')
      ) || nonMaleVoices.find(v => v.lang.toLowerCase().includes('ja'))
        || nonMaleVoices[0] 
        || voices[0];

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.lang = 'en-US';
      utterance.pitch = 1.18;
      utterance.rate = 0.98;

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported on this browser.');
    }
  };

  const handleStartVoice = () => {
    if (activeUser.isGuest) {
      handleSpeakText("Welcome to Agri-Ka Smart Farm Hub. You are browsing in Guest Mode. Log in to record activities.");
    } else {
      handleSpeakText(`Hello ${activeUser.name}. How can I assist with your farm logs or crop guides today?`);
    }
  };

  // --- KNOWLEDGE HUB CRUD & HIDE ---
  const handleAddGuide = async (newGuide) => {
    setKnowledgeItems([newGuide, ...knowledgeItems]);
    await createKnowledgeItem(newGuide);
  };

  const handleUpdateGuide = async (updatedGuide) => {
    setKnowledgeItems(knowledgeItems.map(item => item.id === updatedGuide.id ? updatedGuide : item));
    await updateKnowledgeItem(updatedGuide.id, updatedGuide);
  };

  const handleToggleHideGuide = async (id, isHidden) => {
    setKnowledgeItems(knowledgeItems.map(item => item.id === id ? { ...item, isHidden } : item));
    await toggleHideKnowledgeItem(id, isHidden);
  };

  const handleDeleteGuide = async (id) => {
    setKnowledgeItems(knowledgeItems.filter(item => item.id !== id));
    await deleteKnowledgeItem(id);
  };

  // --- RECORD & INVENTORY CRUD & HIDE ---
  const handleAddAuditLog = async (newLog) => {
    setAuditLogs([newLog, ...auditLogs]);
    await createAuditLog(newLog);
  };

  const handleUpdateAuditLog = async (log) => {
    setAuditLogs(auditLogs.map(l => l.id === log.id ? log : l));
    await updateAuditLog(log.id, log);
  };

  const handleToggleHideAuditLog = async (id, isHidden) => {
    setAuditLogs(auditLogs.map(l => l.id === id ? { ...l, isHidden } : l));
    await toggleHideAuditLog(id, isHidden);
  };

  const handleDeleteAuditLog = async (id) => {
    setAuditLogs(auditLogs.filter(l => l.id !== id));
    await deleteAuditLog(id);
  };

  const handleAddInventoryItem = async (item) => {
    setInventoryItems([item, ...inventoryItems]);
    await createInventoryItem(item);
  };

  const handleUpdateInventoryItem = async (item) => {
    setInventoryItems(inventoryItems.map(i => i.id === item.id ? item : i));
    await updateInventoryItem(item.id, item);
  };

  const handleToggleHideInventoryItem = async (id, isHidden) => {
    setInventoryItems(inventoryItems.map(i => i.id === id ? { ...i, isHidden } : i));
    await toggleHideInventoryItem(id, isHidden);
  };

  const handleDeleteInventoryItem = async (id) => {
    setInventoryItems(inventoryItems.filter(i => i.id !== id));
    await deleteInventoryItem(id);
  };

  const handleToggleEquipmentStatus = async (itemId) => {
    const itemToToggle = inventoryItems.find(i => i.id === itemId);
    if (!itemToToggle) return;

    const nextStatus = itemToToggle.status === 'Operational' ? 'In Use' : 
                       itemToToggle.status === 'In Use' ? 'Under Maintenance' : 'Operational';
    
    const updated = { ...itemToToggle, status: nextStatus };
    setInventoryItems(inventoryItems.map(item => item.id === itemId ? updated : item));
    await updateInventoryItem(itemId, { status: nextStatus });
  };

  const calculateFinancialSummary = (transactions) => {
    let totalRevenue = 0;
    let totalExpenses = 0;
    transactions.forEach(t => {
      if (t.type === 'Income') totalRevenue += Number(t.amount || 0);
      else totalExpenses += Number(t.amount || 0);
    });
    return {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      projectedHarvestValue: 0
    };
  };

  const handleAddTransaction = async (newTrans) => {
    const newTransactions = [newTrans, ...financials.transactions];
    const newSummary = calculateFinancialSummary(newTransactions);

    setFinancials({
      ...financials,
      summary: newSummary,
      transactions: newTransactions
    });

    await createFinancial(newTrans);
  };

  const handleUpdateTransaction = async (trans) => {
    const updatedTransactions = financials.transactions.map(t => t.id === trans.id ? trans : t);
    const newSummary = calculateFinancialSummary(updatedTransactions);

    setFinancials({
      ...financials,
      summary: newSummary,
      transactions: updatedTransactions
    });

    await updateFinancial(trans.id, trans);
  };

  const handleToggleHideFinancial = async (id, isHidden) => {
    const updatedTransactions = financials.transactions.map(t => t.id === id ? { ...t, isHidden } : t);
    setFinancials({ ...financials, transactions: updatedTransactions });
    await toggleHideFinancial(id, isHidden);
  };

  const handleDeleteTransaction = async (id) => {
    const filteredTransactions = financials.transactions.filter(t => t.id !== id);
    const newSummary = calculateFinancialSummary(filteredTransactions);

    setFinancials({
      ...financials,
      summary: newSummary,
      transactions: filteredTransactions
    });

    await deleteFinancial(id);
  };

  // --- DYNAMIC MONITORING CRUD & HIDE ---
  const handleSimulateSensorPing = () => {};

  const handleAddStatusEntry = async ({ type, item }) => {
    if (type === 'crop') {
      setMonitoringData({ ...monitoringData, fields: [item, ...monitoringData.fields] });
    } else if (type === 'equipment') {
      setMonitoringData({ ...monitoringData, equipment: [item, ...monitoringData.equipment] });
    } else {
      setMonitoringData({ ...monitoringData, livestock: [item, ...monitoringData.livestock] });
    }
    await createMonitoringEntry({ ...item, type });
  };

  const handleUpdateStatusEntry = async ({ type, item }) => {
    if (type === 'crop') {
      setMonitoringData({
        ...monitoringData,
        fields: monitoringData.fields.map(f => f.id === item.id ? item : f)
      });
    } else if (type === 'equipment') {
      setMonitoringData({
        ...monitoringData,
        equipment: monitoringData.equipment.map(e => e.id === item.id ? item : e)
      });
    } else {
      setMonitoringData({
        ...monitoringData,
        livestock: monitoringData.livestock.map(l => l.id === item.id ? item : l)
      });
    }
    await updateMonitoringEntry(item.id, { ...item, type });
  };

  const handleToggleHideMonitoringEntry = async (id, isHidden) => {
    setMonitoringData({
      fields: (monitoringData.fields || []).map(f => f.id === id ? { ...f, isHidden } : f),
      equipment: (monitoringData.equipment || []).map(e => e.id === id ? { ...e, isHidden } : e),
      livestock: (monitoringData.livestock || []).map(l => l.id === id ? { ...l, isHidden } : l)
    });
    await toggleHideMonitoringEntry(id, isHidden);
  };

  const handleDeleteStatusEntry = async ({ id, type }) => {
    if (type === 'crop') {
      setMonitoringData({ ...monitoringData, fields: monitoringData.fields.filter(f => f.id !== id) });
    } else if (type === 'equipment') {
      setMonitoringData({ ...monitoringData, equipment: monitoringData.equipment.filter(e => e.id !== id) });
    } else {
      setMonitoringData({ ...monitoringData, livestock: monitoringData.livestock.filter(l => l.id !== id) });
    }
    await deleteMonitoringEntry(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        inventorySubTab={inventorySubTab}
        setInventorySubTab={setInventorySubTab}
        monitoringSubTab={monitoringSubTab}
        setMonitoringSubTab={setMonitoringSubTab}
        activeUser={activeUser}
        setActiveUser={setActiveUser}
        onOpenQuickLog={() => setIsQuickLogOpen(true)}
        onStartVoice={handleStartVoice}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        logoUrl={logoUrl}
        onOpenLogoModal={() => setShowLogoModal(true)}
      />

      {/* Main Wrapper Next to Sidebar */}
      <div className={`flex-1 transition-all duration-300 flex flex-col min-w-0 ${
        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
      }`}>
        
        {/* Top Header Bar */}
        <Header
          activeUser={activeUser}
          setActiveUser={setActiveUser}
          users={users}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenQuickLog={() => setIsQuickLogOpen(true)}
          onStartVoice={handleStartVoice}
          logoUrl={logoUrl}
          setLogoUrl={setLogoUrl}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenLogoModal={() => setShowLogoModal(true)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1800px] w-full mx-auto">
          
          {/* Module 1: Centralized Knowledge Hub */}
          {activeTab === 'hub' && (
            <KnowledgeHub
              knowledgeItems={knowledgeItems}
              seasonalGuides={seasonalGuides}
              searchQuery={searchQuery}
              onSpeakText={handleSpeakText}
              onAddGuide={handleAddGuide}
              onUpdateGuide={handleUpdateGuide}
              onDeleteGuide={handleDeleteGuide}
              onToggleHideGuide={handleToggleHideGuide}
              isGuest={activeUser.isGuest}
              activeUser={activeUser}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          )}

          {/* Module 2: Record & Inventory Management System */}
          {activeTab === 'inventory' && (
            <RecordInventory
              auditLogs={auditLogs}
              inventoryItems={inventoryItems}
              financials={financials}
              activeUser={activeUser}
              onOpenQuickLog={() => setIsQuickLogOpen(true)}
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onToggleHideFinancial={handleToggleHideFinancial}
              onAddInventoryItem={handleAddInventoryItem}
              onUpdateInventoryItem={handleUpdateInventoryItem}
              onDeleteInventoryItem={handleDeleteInventoryItem}
              onToggleHideInventoryItem={handleToggleHideInventoryItem}
              onUpdateAuditLog={handleUpdateAuditLog}
              onDeleteAuditLog={handleDeleteAuditLog}
              onToggleHideAuditLog={handleToggleHideAuditLog}
              onToggleEquipmentStatus={handleToggleEquipmentStatus}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              subTab={inventorySubTab}
              setSubTab={setInventorySubTab}
            />
          )}

          {/* Module 3: Dynamic Monitoring Application */}
          {activeTab === 'monitoring' && (
            <DynamicMonitoring
              monitoringData={monitoringData}
              onSimulateSensorPing={handleSimulateSensorPing}
              onAddStatusEntry={handleAddStatusEntry}
              onUpdateStatusEntry={handleUpdateStatusEntry}
              onDeleteStatusEntry={handleDeleteStatusEntry}
              onToggleHideMonitoringEntry={handleToggleHideMonitoringEntry}
              isGuest={activeUser.isGuest}
              activeUser={activeUser}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              activeTab={monitoringSubTab}
              setActiveTab={setMonitoringSubTab}
            />
          )}

        </main>

      </div>

      {/* Quick Action Modal */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        activeUser={activeUser}
        inventoryItems={inventoryItems}
        onAddAuditLog={handleAddAuditLog}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        users={users}
      />

      {/* Logo Upload Modal */}
      {showLogoModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <span>🖼️ Update System Logo</span>
              </h3>
              <button 
                onClick={() => setShowLogoModal(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Choose a custom emblem/logo image from your computer to update the system branding across the sidebar and header.
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 p-1 border border-purple-500/60 flex items-center justify-center overflow-hidden">
                <img 
                  src={logoUrl || '/THerta_LogoWFrame.png'} 
                  alt="Current Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/THerta_LogoWFrame.png';
                  }}
                />
              </div>
            </div>

            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setLogoUrl(reader.result);
                    try { localStorage.setItem('agri_logo_url', reader.result); } catch (err) {}
                    setShowLogoModal(false);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full text-xs text-slate-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gradient-to-r file:from-emerald-600 file:to-purple-600 file:text-white hover:file:from-emerald-500 hover:file:to-purple-500 cursor-pointer"
            />

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setLogoUrl('/THerta_LogoWFrame.png');
                  try { localStorage.removeItem('agri_logo_url'); } catch (err) {}
                  setShowLogoModal(false);
                }}
                className="text-xs text-slate-400 hover:text-amber-400 font-semibold underline cursor-pointer"
              >
                Reset to Default
              </button>

              <button 
                onClick={() => setShowLogoModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-slate-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Bar */}
      <MobileNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickLog={() => setIsQuickLogOpen(true)}
      />

    </div>
  );
}
