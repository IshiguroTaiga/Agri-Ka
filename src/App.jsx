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
  getKnowledgeItems, createKnowledgeItem, updateKnowledgeItem, deleteKnowledgeItem,
  getInventoryItems, createInventoryItem, updateInventoryItem, deleteInventoryItem,
  getAuditLogs, createAuditLog, updateAuditLog, deleteAuditLog,
  getFinancials, createFinancial, updateFinancial, deleteFinancial,
  getMonitoringEntries, createMonitoringEntry, updateMonitoringEntry, deleteMonitoringEntry
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

  // Fetch initial data from SQL Database
  useEffect(() => {
    const fetchSqlData = async () => {
      const kb = await getKnowledgeItems();
      if (kb && Array.isArray(kb) && kb.length > 0) setKnowledgeItems(kb);
      else setKnowledgeItems(INITIAL_KNOWLEDGE_BASE);

      const inv = await getInventoryItems();
      if (inv && Array.isArray(inv) && inv.length > 0) setInventoryItems(inv);
      else setInventoryItems(INITIAL_INVENTORY);

      const logs = await getAuditLogs();
      if (logs && Array.isArray(logs) && logs.length > 0) setAuditLogs(logs);
      else setAuditLogs(INITIAL_AUDIT_LOGS);

      const fins = await getFinancials();
      if (fins && Array.isArray(fins) && fins.length > 0) {
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
      } else {
        setFinancials(INITIAL_FINANCIALS);
      }

      const mon = await getMonitoringEntries();
      if (mon && mon.fields && (mon.fields.length > 0 || mon.equipment?.length > 0 || mon.livestock?.length > 0)) {
        setMonitoringData(mon);
      } else {
        setMonitoringData(INITIAL_MONITORING_SENSORS);
      }
    };

    fetchSqlData();
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

  const handleSpeakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const voices = window.speechSynthesis.getVoices();
      
      // Select Japanese English voice or smooth female voice (e.g. Nanami, Jenny, Aria, Zira, Google)
      const selectedVoice = voices.find(v => 
        v.name.toLowerCase().includes('nanami') ||
        v.name.toLowerCase().includes('haruka') ||
        v.name.toLowerCase().includes('jenny') ||
        v.name.toLowerCase().includes('aria') ||
        v.name.toLowerCase().includes('google us english') ||
        v.name.toLowerCase().includes('natural')
      ) || voices.find(v => 
        v.lang.toLowerCase().includes('ja') ||
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('female')
      );

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Force English pronunciation so English words are clear and not Katakana-glitched
      utterance.lang = 'en-US';

      // Gentle, pleasant, sweet pitch (1.15) and smooth rate (0.98)
      utterance.pitch = 1.15;
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

  // --- KNOWLEDGE HUB CRUD ---
  const handleAddGuide = async (newGuide) => {
    setKnowledgeItems([newGuide, ...knowledgeItems]);
    await createKnowledgeItem(newGuide);
  };

  const handleUpdateGuide = async (updatedGuide) => {
    setKnowledgeItems(knowledgeItems.map(item => item.id === updatedGuide.id ? updatedGuide : item));
    await updateKnowledgeItem(updatedGuide.id, updatedGuide);
  };

  const handleDeleteGuide = async (id) => {
    setKnowledgeItems(knowledgeItems.filter(item => item.id !== id));
    await deleteKnowledgeItem(id);
  };

  // --- RECORD & INVENTORY CRUD ---
  const handleAddAuditLog = async (newLog) => {
    setAuditLogs([newLog, ...auditLogs]);
    await createAuditLog(newLog);
  };

  const handleUpdateAuditLog = async (log) => {
    setAuditLogs(auditLogs.map(l => l.id === log.id ? log : l));
    await updateAuditLog(log.id, log);
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

  // --- DYNAMIC MONITORING CRUD ---
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
            isGuest={activeUser.isGuest}
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
            onAddInventoryItem={handleAddInventoryItem}
            onUpdateInventoryItem={handleUpdateInventoryItem}
            onDeleteInventoryItem={handleDeleteInventoryItem}
            onUpdateAuditLog={handleUpdateAuditLog}
            onDeleteAuditLog={handleDeleteAuditLog}
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
            isGuest={activeUser.isGuest}
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
