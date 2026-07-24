import React, { useState, useEffect } from 'react';
import Header from './components/Header';
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
      const parsed = JSON.parse(saved);
      if (parsed.some(u => u.role !== 'Farmer' && !u.isGuest)) {
        return INITIAL_USERS;
      }
      return parsed;
    }
    return INITIAL_USERS;
  });

  const [activeUser, setActiveUser] = useState(() => {
    const saved = localStorage.getItem('agri_active_user');
    return saved ? JSON.parse(saved) : GUEST_USER;
  });

  // Navigation & Search State
  const [activeTab, setActiveTab] = useState('hub');
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

  // Real-time EventSource Listener (SSE) & Polling Fallback for instant cross-tab / cross-user updates
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
          console.warn('[Real-Time Sync warning] EventSource disconnected, retrying...', err);
          if (eventSource) eventSource.close();
          setTimeout(connectSSE, 3000);
        };
      } catch (err) {
        console.warn('[Real-Time Sync warning] Could not establish EventSource:', err);
      }
    };

    connectSSE();

    // 4-second polling fallback to guarantee real-time reflection across all users & sessions
    const pollInterval = setInterval(() => {
      fetchSqlData();
    }, 4000);

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
      console.warn(`[Storage Quota Exceeded] Skipped cache for '${key}'. Items are preserved in Express SQL Database.`, err.message);
    }
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

  // Preload system voices to prevent fallback to default male voice (Microsoft David)
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

      // Exclude male voice names explicitly
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

      // Priority 1: Japanese female voices (Nanami, Haruka, Kyoko, Mizuki, Ayumi)
      // Priority 2: Smooth English female voices (Jenny, Aria, Zira, Samantha, Victoria)
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

      // Ensure English text is pronounced clearly
      utterance.lang = 'en-US';

      // Pitch (1.18) & Rate (0.98) for sweet, cheerful female voice
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
    <div className="min-h-screen pb-20 md:pb-10 bg-gradient-to-br from-emerald-50/60 via-slate-50 to-purple-50/40 text-slate-900">
      
      {/* Top Header */}
      <Header
        activeUser={activeUser}
        setActiveUser={setActiveUser}
        users={users}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenQuickLog={() => setIsQuickLogOpen(true)}
        onStartVoice={handleStartVoice}
        logoUrl={logoUrl}
        setLogoUrl={setLogoUrl}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-[1700px] mx-auto px-4 sm:px-8 py-6">
        
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
          />
        )}

      </main>

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

      {/* Mobile Bottom Navigation */}
      <MobileNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickLog={() => setIsQuickLogOpen(true)}
      />
    </div>
  );
}
