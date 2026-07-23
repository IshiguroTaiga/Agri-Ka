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
    id: 'user-ishi-superadmin',
    username: 'Ishi',
    name: 'Ishi',
    role: 'Super Admin',
    roleCode: 'super_admin',
    avatar: '👑',
    badgeColor: 'bg-purple-900 text-amber-300 border-amber-400 font-extrabold shadow-sm',
    description: 'System Super Administrator - Master Controls & Content Governance',
    isGuest: false
  },
  {
    id: 'user-1',
    username: 'Berto',
    name: 'JBenedict Alberto',
    role: 'Field Worker',
    roleCode: 'worker',
    avatar: '👨‍🌾',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Main field operator - Rice, Garlic & Corn Sectors (Ilocos Norte)',
    isGuest: false
  },
  {
    id: 'user-2',
    username: 'Nythan',
    name: 'Nythan Bagasani',
    role: 'Farm Manager',
    roleCode: 'manager',
    avatar: '👩‍💼',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Operations head, budgeting & approvals (Ilocos Norte)',
    isGuest: false
  },
  {
    id: 'user-3',
    username: 'Boni',
    name: 'Nathaniel Bonifacio',
    role: 'Inventory & Tech Specialist',
    roleCode: 'tech',
    avatar: '🛠️',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    description: 'Machinery maintenance & solar irrigation specialist (Ilocos Norte)',
    isGuest: false
  }
];

export const INITIAL_KNOWLEDGE_BASE = [
  // --- TECHNOLOGIES & TOOLS (Ilocos Norte) ---
  {
    id: 'kb-1',
    category: 'tech',
    title: 'Solar-Powered Drip Fertigation System',
    summary: 'Micro-drip irrigation combined with automated liquid fertilizer dosing powered by 400W solar arrays.',
    description: 'Installed across garlic and dragonfruit farms in Batac & Laoag, Ilocos Norte. Reduces water usage by up to 60% during dry season (November to April) and delivers precise nitrogen-potassium nutrient mixes directly to plant roots.',
    tags: ['tech', 'Guide'],
    season: 'Dry Season (Nov - Apr)',
    mediaUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kb-2',
    category: 'tech',
    title: 'MMSU STDC Solar Thermal Multi-Crop Drier',
    summary: 'Solar thermal cabinet dryer engineered by Mariano Marcos State University (MMSU) Batac for high-capacity onion and garlic curing.',
    description: 'Prevents post-harvest fungal rot in Ilocos White Garlic and Red Granex Onions. Maintains internal temperatures at 38°C–42°C using solar collectors and thermal mass storage, cutting curing time from 14 days down to 4 days.',
    tags: ['tech', 'Guide'],
    season: 'Post-Harvest / Summer',
    mediaUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kb-3',
    category: 'tech',
    title: 'Smart Soil Moisture & EC Sensor Node',
    summary: 'LoRaWAN IoT moisture probe and soil pH monitoring system tailored for sandy loam soils of Solsona and Dingras.',
    description: 'Transmits real-time volumetric water content and salinity levels to field managers every 30 minutes. Helps farmers in Solsona prevent over-salinization and schedule irrigation cycles precisely during dry spells.',
    tags: ['tech', 'Guide'],
    season: 'Year-Round',
    mediaUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kb-4',
    category: 'tech',
    title: 'Off-Season Dragon Fruit LED Supplemental Lighting Canopy',
    summary: 'Nighttime artificial LED lighting grid to stimulate year-round flowering of red dragonfruit in Burgos, Ilocos Norte.',
    description: 'Burgos, Ilocos Norte is known as the Dragon Fruit Capital of the North. Utilizing 6W warm-white LED lamps suspended over rows for 4 extra nighttime hours induces off-season blooming during short-day months (October to February).',
    tags: ['tech', 'Guide'],
    season: 'Off-Season (Oct - Feb)',
    mediaUrl: 'https://images.unsplash.com/photo-1508873696983-2df5057c0256?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5057c0256?auto=format&fit=crop&w=800&q=80'
  },

  // --- FARMING TECHNIQUES (Ilocos Norte) ---
  {
    id: 'kb-5',
    category: 'knowledge',
    title: 'Rice-Garlic-Mungbean (R-G-M) Cropping System',
    summary: 'The flagship triple-crop rotation strategy optimized for Ilocos Norte climate and soil profile.',
    description: 'Wet season hybrid rice (July–Oct) is followed immediately by zero-tillage Ilocos White Garlic (Nov–Feb) using rice straw mulch, and finished with drought-tolerant Pagasa 7 Mungbean ("Black Gold", Mar–May) which fixes atmospheric nitrogen back into the soil.',
    tags: ['knowledge', 'Guide'],
    season: 'Annual Rotation Cycle',
    mediaUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kb-6',
    category: 'knowledge',
    title: 'Alternate Wetting and Drying (AWD) Water-Saving Technique',
    summary: 'Controlled irrigation practice developed with PhilRice Batac to conserve groundwater reserves in Ilocos Norte.',
    description: 'Allows field water to naturally recede to 15cm below the soil surface inside a perforated field water tube (Paniwalan) before re-flooding. Reduces water pumping costs by 35% and methane emissions by 48% without yield reduction.',
    tags: ['knowledge', 'Guide'],
    season: 'Rice Season (Jul - Nov)',
    mediaUrl: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kb-7',
    category: 'knowledge',
    title: 'Rice Straw Mulching for Ilocos White Garlic',
    summary: 'Traditional moisture-retention and weed suppression technique applied over garlic beds in Pasuquin and Bacarra.',
    description: 'Spread a 3 to 5 cm thick layer of clean, dry rice straw immediately after planting garlic cloves. Suppresses weed germination, keeps soil temperatures cool during dry Ilocano afternoons, and retains soil moisture.',
    tags: ['knowledge', 'Guide'],
    season: 'Dry Season (Nov - Mar)',
    mediaUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kb-8',
    category: 'knowledge',
    title: 'Silage Making & Urea-Treated Rice Straw for Ilocano Cattle',
    summary: 'Nutritious dry-season livestock feed preparation using corn stover, molasses, and urea treatment.',
    description: 'Addresses dry-season forage scarcity in Ilocos Norte (Jan–May). Chopped yellow corn stalks mixed with 5% molasses and sealed airtight in plastic drums create highly palatable fermented feed for native beef cattle and goats.',
    tags: ['knowledge', 'Guide'],
    season: 'Dry Season (Jan - May)',
    mediaUrl: 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=800&q=80'
  },

  // --- CROPS (Ilocos Norte) ---
  {
    id: 'kb-9',
    category: 'crops',
    title: 'Ilocos White Garlic ("Batanes / Native White Gold")',
    summary: 'Premier geographic garlic variety known for high pungency, long shelf-life, and firm cloves cultivated in Pasuquin & Bacarra.',
    description: 'Planted in November following the wet season rice harvest. Requires well-drained sandy loam soil and full sun exposure. Known for its strong aroma and up to 10 months of natural ambient storability.',
    tags: ['crops', 'Guide'],
    season: 'November to March',
    mediaUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kb-10',
    category: 'crops',
    title: 'NSIC Rc222 (Tubigan 26) Inbred Rice Variety',
    summary: 'High-yielding, drought-resilient rice variety widely grown across the Dingras and Sarrat agricultural plains.',
    description: 'Yields 6.1 to 10 tons per hectare under proper water management. Features strong resistance to stem borer and green leafhopper, ideal for Ilocos Norte lowland conditions.',
    tags: ['crops', 'Guide'],
    season: 'Wet Season (June - October)',
    mediaUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kb-11',
    category: 'crops',
    title: 'Yellow Granex & Red Pinoy Onions',
    summary: 'High-value bulb cash crop grown extensively in Dingras and Laoag City agricultural sectors.',
    description: 'High market demand crop grown during cool dry months. Requires carefully monitored nitrogen application and timely curing to achieve maximum bulb size and anti-rot durability.',
    tags: ['crops', 'Guide'],
    season: 'December to April',
    mediaUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kb-12',
    category: 'crops',
    title: 'Refructus Red Dragon Fruit (Burgos Strain)',
    summary: 'Premium high-sugar pitaya variety cultivated in Burgos and Laoag City dragonfruit farms.',
    description: 'Thrives in sunny coastal slopes with well-drained soil. Sweet red-fleshed variety harvested from May through October, generating high revenue per hectare.',
    tags: ['crops', 'Guide'],
    season: 'May to October',
    mediaUrl: 'https://images.unsplash.com/photo-1527325678964-549216416a27?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1527325678964-549216416a27?auto=format&fit=crop&w=800&q=80'
  },

  // --- LIVESTOCK (Ilocos Norte) ---
  {
    id: 'kb-13',
    category: 'livestock',
    title: 'Ilocos Native Goat (Kambing - Upgrade Strain)',
    summary: 'Hardy, disease-resistant native goat breed integrated into coconut and orchard farmlands in Badoc & Currimao.',
    description: 'Highly adapted to warm Ilocano dry spells. Browses on local forage like ipil-ipil and kakawate leaves. Provides high-protein meat (Papaitan/Kilawin staple) and fast kid rearing cycles.',
    tags: ['livestock', 'Guide'],
    season: 'Year-Round',
    mediaUrl: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kb-14',
    category: 'livestock',
    title: 'Ilocos Native Beef Cattle (Baka - Brahman Cross)',
    summary: 'Dual-purpose draft and beef cattle managed across Solsona and Marcos pasture areas.',
    description: 'Exceptionally resilient against hot weather and tick-borne diseases. Used for heavy field preparation during rice planting and fattened on corn forage for local meat markets.',
    tags: ['livestock', 'Guide'],
    season: 'Year-Round',
    mediaUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kb-15',
    category: 'livestock',
    title: 'Riverine Carabao (Damulag / Water Buffalo)',
    summary: 'High-value milk and draft carabao raised in Batac City dairy cooperatives supported by PCC MMSU.',
    description: 'Produces rich milk (7-8% butterfat content) utilized for Ilocano milk candy (Pastillas) and fresh carabao cheese (Kesong Puti), alongside land cultivation work.',
    tags: ['livestock', 'Guide'],
    season: 'Year-Round',
    mediaUrl: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kb-16',
    category: 'livestock',
    title: 'Ilocos Banaba Native Chicken Strain',
    summary: 'Free-range indigenous chicken raised in organic backyard farms across Vintar and San Nicolas.',
    description: 'Renowned for flavorful gourmet meat, high foraging ability, and natural resistance to Newcastle Disease. Feeds on fallen grains, insect larvae, and native grass.',
    tags: ['livestock', 'Guide'],
    season: 'Year-Round',
    mediaUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_SEASONAL_GUIDE = [];

export const INITIAL_INVENTORY = [
  {
    id: 'inv-101',
    code: 'EQ-INC-01',
    name: 'Kubota L3901 Mini Tractor & Rotary Tiller',
    category: 'Machinery',
    status: 'Operational',
    location: 'Dingras Central Shed, Ilocos Norte',
    assignedTo: 'JBenedict Alberto',
    stockQty: 2,
    unit: 'unit',
    minThreshold: 1,
    lastMaintained: '2026-07-10',
    notes: 'Low ground pressure tires suitable for wet rice paddies and dry garlic tilling.',
    mediaUrl: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image'
  },
  {
    id: 'inv-102',
    code: 'EQ-SOL-02',
    name: 'MMSU Solar Drip Fertigation Pump Kit',
    category: 'Irrigation',
    status: 'Operational',
    location: 'Batac Demonstration Farm, Ilocos Norte',
    assignedTo: 'Nathaniel Bonifacio',
    stockQty: 4,
    unit: 'set',
    minThreshold: 1,
    lastMaintained: '2026-07-15',
    notes: 'Includes 400W solar panel array, 24V DC pump, and Venturi fertilizer injector.',
    mediaUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image'
  },
  {
    id: 'inv-103',
    code: 'EQ-STDC-03',
    name: 'STDC Multi-Crop Solar Cabinet Drier',
    category: 'Supplies',
    status: 'Operational',
    location: 'Pasuquin Post-Harvest Facility, Ilocos Norte',
    assignedTo: 'Nythan Bagasani',
    stockQty: 3,
    unit: 'unit',
    minThreshold: 1,
    lastMaintained: '2026-07-08',
    notes: 'Capacity: 500kg garlic/onion bulbs per curing run.',
    mediaUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image'
  },
  {
    id: 'inv-104',
    code: 'SUP-GAR-04',
    name: 'Certified Ilocos White Garlic Seed Cloves',
    category: 'Supplies',
    status: 'Operational',
    location: 'Laoag Agri Cold Storage, Ilocos Norte',
    assignedTo: 'JBenedict Alberto',
    stockQty: 450,
    unit: 'kg',
    minThreshold: 100,
    lastMaintained: '2026-07-19',
    notes: 'High-grade disease-free seed stock prepared for November planting.',
    mediaUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-101',
    timestamp: '2026-07-20 08:30 AM',
    user: 'JBenedict Alberto',
    userRole: 'Field Worker',
    actionType: 'Planting & Sowing',
    itemTagged: 'Ilocos White Garlic Cloves',
    category: 'Crops',
    location: 'Pasuquin Coastal Plot, Ilocos Norte',
    quantityDetails: 'Planted 120 kg cloves over 0.5 hectare',
    notes: 'Applied rice straw mulching immediately after row placement to retain soil moisture.',
    verificationStatus: 'Logged & Verified',
    mediaUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image'
  },
  {
    id: 'log-102',
    timestamp: '2026-07-21 10:15 AM',
    user: 'Nathaniel Bonifacio',
    userRole: 'Inventory & Tech Specialist',
    actionType: 'Equipment Maintenance',
    itemTagged: 'Solar Drip Pump Assembly',
    category: 'Equipment',
    location: 'MMSU Agri Compound, Batac City, Ilocos Norte',
    quantityDetails: 'Replaced intake filter & cleaned 4x 100W PV panels',
    notes: 'Flow rate restored to 45 L/min. Solar battery backup charging properly.',
    verificationStatus: 'Logged & Verified',
    mediaUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image'
  },
  {
    id: 'log-103',
    timestamp: '2026-07-22 02:45 PM',
    user: 'Nythan Bagasani',
    userRole: 'Farm Manager',
    actionType: 'Livestock Movement & Care',
    itemTagged: 'Native Goat Breeding Herd',
    category: 'Livestock',
    location: 'Currimao Pasture Sector, Ilocos Norte',
    quantityDetails: 'Vaccinated 28 head of native goats with dewormer & vitamin boost',
    notes: 'All animals in healthy condition. 3 does scheduled for kid delivery next month.',
    verificationStatus: 'Logged & Verified',
    mediaUrl: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image'
  },
  {
    id: 'log-104',
    timestamp: '2026-07-22 04:00 PM',
    user: 'JBenedict Alberto',
    userRole: 'Field Worker',
    actionType: 'Harvest & Sales',
    itemTagged: 'Refructus Dragon Fruit',
    category: 'Crops',
    location: 'Burgos Dragonfruit Plantation, Ilocos Norte',
    quantityDetails: 'Harvested 350 kg prime Grade-A red dragonfruit',
    notes: 'Dispatched to Laoag City Central Market cooperative distributor.',
    verificationStatus: 'Logged & Verified',
    mediaUrl: 'https://images.unsplash.com/photo-1527325678964-549216416a27?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image'
  }
];

export const INITIAL_FINANCIALS = {
  totalBudget: 500000,
  currency: '₱',
  summary: {
    totalRevenue: 173400,
    totalExpenses: 60500,
    netProfit: 112900,
    projectedHarvestValue: 350000
  },
  transactions: [
    {
      id: 'fin-101',
      date: '2026-07-18',
      title: 'Bulk Ilocos White Garlic Sale - Laoag Wholesale',
      type: 'Income',
      amount: 145000,
      category: 'Crop Sales',
      loggedBy: 'Nythan Bagasani',
      mediaUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image'
    },
    {
      id: 'fin-102',
      date: '2026-07-19',
      title: 'Purchase of Solar Drip System Expansion Parts',
      type: 'Expense',
      amount: 38500,
      category: 'Equipment Maintenance',
      loggedBy: 'Nathaniel Bonifacio',
      mediaUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image'
    },
    {
      id: 'fin-103',
      date: '2026-07-20',
      title: 'Batac Dairy Carabao Milk Sales - Cooperative Delivery',
      type: 'Income',
      amount: 28400,
      category: 'Livestock Sales',
      loggedBy: 'Nythan Bagasani',
      mediaUrl: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image'
    },
    {
      id: 'fin-104',
      date: '2026-07-21',
      title: 'Organic Fertilizer & Mungbean Seeds Procurement',
      type: 'Expense',
      amount: 22000,
      category: 'Fertilizer & Seeds',
      loggedBy: 'JBenedict Alberto',
      mediaUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image'
    }
  ]
};

export const INITIAL_MONITORING_SENSORS = {
  fields: [
    {
      id: 'mon-101',
      type: 'crop',
      name: 'Batac Hybrid Rice Field (Sector 1)',
      location: 'MMSU Agri Field, Batac City, Ilocos Norte',
      status: 'Healthy / Operational',
      details: 'NSIC Rc222 at vegetative tillering stage. AWD water tube level at -5cm. Zero pest incidence.',
      crop: 'NSIC Rc222 (Tubigan 26)',
      stage: 'Vegetative Tillering',
      lastUpdated: '2026-07-22',
      mediaUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image'
    },
    {
      id: 'mon-102',
      type: 'crop',
      name: 'Laoag Organic Garlic Nursery',
      location: 'San Nicolas Road Plot, Laoag City, Ilocos Norte',
      status: 'Needs Attention / Water',
      details: 'Ilocos White Garlic seedbeds prepared for early mulching. Drip moisture check requested.',
      crop: 'Ilocos White Garlic',
      stage: 'Land Prep & Bedding',
      lastUpdated: '2026-07-22',
      mediaUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image'
    },
    {
      id: 'mon-103',
      type: 'crop',
      name: 'Burgos Dragonfruit Orchard Block B',
      location: 'Paayas Coastal Hill, Burgos, Ilocos Norte',
      status: 'Ready for Harvest / Duty',
      details: 'Off-season LED lighting triggered heavy blooming. 85% of fruit pods fully ripe for picking.',
      crop: 'Refructus Red Dragonfruit',
      stage: 'Fruit Maturation',
      lastUpdated: '2026-07-21',
      mediaUrl: 'https://images.unsplash.com/photo-1527325678964-549216416a27?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image'
    },
    {
      id: 'mon-104',
      type: 'crop',
      name: 'Dingras Red Onion Plot',
      location: 'Dingras Agricultural Valley, Ilocos Norte',
      status: 'Healthy / Operational',
      details: 'Yellow Granex onions showing robust foliage growth. Soil EC level optimal.',
      crop: 'Yellow Granex Onion',
      stage: 'Bulbing Stage',
      lastUpdated: '2026-07-20',
      mediaUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image'
    }
  ],
  equipment: [
    {
      id: 'mon-201',
      type: 'equipment',
      name: 'MMSU Solar Drip Pump Station',
      location: 'Batac Sector 2 Substation, Ilocos Norte',
      status: 'Healthy / Operational',
      details: 'Solar PV output at 390W peak. Water pressure steady at 2.2 bar across drip lines.',
      lastUpdated: '2026-07-22',
      mediaUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image'
    },
    {
      id: 'mon-202',
      type: 'equipment',
      name: 'Kubota Rotary Tiller 01',
      location: 'Pasuquin Machinery Shed, Ilocos Norte',
      status: 'Under Treatment / Maintenance',
      details: 'Undergoing scheduled oil change and blade sharpening prior to garlic land prep.',
      lastUpdated: '2026-07-21',
      mediaUrl: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image'
    },
    {
      id: 'mon-203',
      type: 'equipment',
      name: 'STDC Multi-Crop Solar Drier Unit A',
      location: 'Laoag Post-Harvest Center, Ilocos Norte',
      status: 'Healthy / Operational',
      details: 'Solar collector fan running automatically. Interior humidity at 32%.',
      lastUpdated: '2026-07-22',
      mediaUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image'
    }
  ],
  livestock: [
    {
      id: 'mon-301',
      type: 'livestock',
      name: 'Pasuquin Native Goat Herd',
      location: 'Pasuquin Hillside Grazing Range, Ilocos Norte',
      status: 'Healthy / Operational',
      details: '28 head of upgraded native goats. Daily forage supplementation with ipil-ipil and corn silage.',
      lastUpdated: '2026-07-22',
      mediaUrl: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image'
    },
    {
      id: 'mon-302',
      type: 'livestock',
      name: 'Batac PCC Dairy Carabao Pen',
      location: 'PCC MMSU Dairy Compound, Batac City, Ilocos Norte',
      status: 'Healthy / Operational',
      details: '12 lactating riverine carabaos. Morning milk production averaged 7.5 liters/head.',
      lastUpdated: '2026-07-22',
      mediaUrl: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image'
    },
    {
      id: 'mon-303',
      type: 'livestock',
      name: 'Solsona Native Cattle Fattening Group',
      location: 'Solsona Riverfront Pasture, Ilocos Norte',
      status: 'Healthy / Operational',
      details: '15 head of Brahman cross cattle undergoing 90-day corn silage weight gain program.',
      lastUpdated: '2026-07-20',
      mediaUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image'
    },
    {
      id: 'mon-304',
      type: 'livestock',
      name: 'Vintar Free-Range Banaba Chicken Flock',
      location: 'Vintar Agro-Forestry Farm, Ilocos Norte',
      status: 'Healthy / Operational',
      details: '60 native hens and roosters in free-range paddock. Egg production steady.',
      lastUpdated: '2026-07-21',
      mediaUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image'
    }
  ]
};
