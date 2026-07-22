export const GUEST_USER = {
  id: 'guest',
  username: 'guest',
  name: 'Guest',
  role: 'Guest User',
  roleCode: 'guest',
  avatar: '👤',
  badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
  description: 'Unauthenticated visitor - View only access',
  isGuest: true
};

export const INITIAL_USERS = [
  GUEST_USER,
  {
    id: 'user-1',
    username: 'berto',
    name: 'Berto Dela Cruz',
    role: 'Farmer',
    roleCode: 'farmer',
    avatar: '👨‍🌾',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Registered Farm Personnel',
    isGuest: false
  },
  {
    id: 'user-2',
    username: 'nythan',
    name: 'Nythan Santos',
    role: 'Farmer',
    roleCode: 'farmer',
    avatar: '👨‍🌾',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Registered Farm Personnel',
    isGuest: false
  },
  {
    id: 'user-3',
    username: 'boni',
    name: 'Boni Reyes',
    role: 'Farmer',
    roleCode: 'farmer',
    avatar: '👨‍🌾',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Registered Farm Personnel',
    isGuest: false
  }
];

export const INITIAL_KNOWLEDGE_BASE = [];

export const INITIAL_SEASONAL_GUIDE = [];

export const INITIAL_INVENTORY = [];

export const INITIAL_AUDIT_LOGS = [];

export const INITIAL_FINANCIALS = {
  totalBudget: 0,
  currency: '₱',
  summary: {
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    projectedHarvestValue: 0
  },
  transactions: []
};

export const INITIAL_MONITORING_SENSORS = {
  fields: [],
  equipment: [],
  livestock: []
};
