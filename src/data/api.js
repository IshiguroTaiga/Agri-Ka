const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for generic API requests with fallback to local state
async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[SQL API Warning] Failed to reach ${endpoint}:`, err.message);
    return null;
  }
}

// KNOWLEDGE HUB API
export const getKnowledgeItems = () => apiFetch('/knowledge');
export const createKnowledgeItem = (data) => apiFetch('/knowledge', { method: 'POST', body: JSON.stringify(data) });
export const updateKnowledgeItem = (id, data) => apiFetch(`/knowledge/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteKnowledgeItem = (id) => apiFetch(`/knowledge/${id}`, { method: 'DELETE' });

// INVENTORY API
export const getInventoryItems = () => apiFetch('/inventory');
export const createInventoryItem = (data) => apiFetch('/inventory', { method: 'POST', body: JSON.stringify(data) });
export const updateInventoryItem = (id, data) => apiFetch(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteInventoryItem = (id) => apiFetch(`/inventory/${id}`, { method: 'DELETE' });

// AUDIT LOGS API
export const getAuditLogs = () => apiFetch('/logs');
export const createAuditLog = (data) => apiFetch('/logs', { method: 'POST', body: JSON.stringify(data) });
export const updateAuditLog = (id, data) => apiFetch(`/logs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAuditLog = (id) => apiFetch(`/logs/${id}`, { method: 'DELETE' });

// FINANCIALS API
export const getFinancials = () => apiFetch('/financials');
export const createFinancial = (data) => apiFetch('/financials', { method: 'POST', body: JSON.stringify(data) });
export const updateFinancial = (id, data) => apiFetch(`/financials/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteFinancial = (id) => apiFetch(`/financials/${id}`, { method: 'DELETE' });

// MONITORING API
export const getMonitoringEntries = () => apiFetch('/monitoring');
export const createMonitoringEntry = (data) => apiFetch('/monitoring', { method: 'POST', body: JSON.stringify(data) });
export const updateMonitoringEntry = (id, data) => apiFetch(`/monitoring/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMonitoringEntry = (id) => apiFetch(`/monitoring/${id}`, { method: 'DELETE' });
