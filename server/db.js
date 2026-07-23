import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = process.env.DATA_DIR || path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'farm.sqlite');
console.log(`[SQL Database] Connecting to SQLite at: ${dbPath}`);

const db = new sqlite3.Database(dbPath);

// Promisified query helpers
export const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize Tables and Seed Default Data
export const initDb = async () => {
  try {
    // 1. Users Table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        role_code TEXT NOT NULL,
        avatar TEXT,
        badge_color TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Audit Logs Table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        user TEXT NOT NULL,
        user_role TEXT NOT NULL,
        action_type TEXT NOT NULL,
        item_tagged TEXT NOT NULL,
        category TEXT NOT NULL,
        location TEXT NOT NULL,
        quantity_details TEXT,
        notes TEXT,
        verification_status TEXT,
        media_url TEXT,
        media_type TEXT
      )
    `);

    // 3. Inventory Table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS inventory (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL,
        location TEXT NOT NULL,
        assigned_to TEXT,
        stock_qty REAL DEFAULT 0,
        unit TEXT,
        min_threshold REAL DEFAULT 0,
        last_maintained TEXT,
        notes TEXT,
        media_url TEXT,
        media_type TEXT
      )
    `);

    // 4. Financials Table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS financials (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        logged_by TEXT NOT NULL,
        media_url TEXT,
        media_type TEXT
      )
    `);

    // 5. Knowledge Hub Table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS knowledge_hub (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        description TEXT,
        tags TEXT,
        season TEXT,
        media_url TEXT,
        media_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. Dynamic Monitoring Entries Table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS monitoring_entries (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT NOT NULL,
        details TEXT,
        crop TEXT,
        stage TEXT,
        last_updated TEXT,
        media_url TEXT,
        media_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Safe column additions for legacy tables
    const safeAddColumn = async (table, columnDef) => {
      try {
        await runQuery(`ALTER TABLE ${table} ADD COLUMN ${columnDef}`);
      } catch (err) {
        // Ignored if column already exists
      }
    };

    await safeAddColumn('audit_logs', 'media_url TEXT');
    await safeAddColumn('audit_logs', 'media_type TEXT');
    await safeAddColumn('audit_logs', 'is_hidden INTEGER DEFAULT 0');
    await safeAddColumn('inventory', 'media_url TEXT');
    await safeAddColumn('inventory', 'media_type TEXT');
    await safeAddColumn('inventory', 'is_hidden INTEGER DEFAULT 0');
    await safeAddColumn('financials', 'media_url TEXT');
    await safeAddColumn('financials', 'media_type TEXT');
    await safeAddColumn('financials', 'is_hidden INTEGER DEFAULT 0');
    await safeAddColumn('knowledge_hub', 'is_hidden INTEGER DEFAULT 0');
    await safeAddColumn('monitoring_entries', 'is_hidden INTEGER DEFAULT 0');

    console.log('[SQL Database] Schema verified & initialized successfully.');

    // Seed default users if empty
    const existingUsers = await allQuery('SELECT * FROM users');
    if (existingUsers.length === 0) {
      console.log('[SQL Database] Seeding default farm personnel accounts...');
      
      const defaultPassword = await bcrypt.hash('farm123', 10);
      const ishiPassword = await bcrypt.hash('Ishi123', 10);

      const usersToSeed = [
        {
          id: 'user-ishi-superadmin',
          username: 'Ishi',
          password_hash: ishiPassword,
          name: 'Ishi',
          role: 'Super Admin',
          role_code: 'super_admin',
          avatar: '👑',
          badge_color: 'bg-purple-900 text-amber-300 border-amber-400 font-extrabold shadow-sm',
          description: 'System Super Administrator - Master Controls & Content Governance'
        },
        {
          id: 'user-1',
          username: 'Berto',
          password_hash: defaultPassword,
          name: 'JBenedict Alberto',
          role: 'Field Worker',
          role_code: 'worker',
          avatar: '👨‍🌾',
          badge_color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          description: 'Main field operator - Rice & Corn Sectors'
        },
        {
          id: 'user-2',
          username: 'Nythan',
          password_hash: defaultPassword,
          name: 'Nythan Bagasani',
          role: 'Farm Manager',
          role_code: 'manager',
          avatar: '👩‍💼',
          badge_color: 'bg-purple-100 text-purple-800 border-purple-300',
          description: 'Operations head, budgeting & approvals'
        },
        {
          id: 'user-3',
          username: 'Boni',
          password_hash: defaultPassword,
          name: 'Nathaniel Bonifacio',
          role: 'Inventory & Tech Specialist',
          role_code: 'tech',
          avatar: '🛠️',
          badge_color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          description: 'Machinery maintenance & stock inventory controller'
        }
      ];

      for (const u of usersToSeed) {
        await runQuery(
          `INSERT INTO users (id, username, password_hash, name, role, role_code, avatar, badge_color, description)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [u.id, u.username, u.password_hash, u.name, u.role, u.role_code, u.avatar, u.badge_color, u.description]
        );
      }
      console.log('[SQL Database] Default users seeded successfully! (Password for Ishi: Ishi123, others: farm123)');
    } else {
      // Ensure Super Admin Ishi account exists even if table was previously seeded
      const ishiUser = await getQuery('SELECT id FROM users WHERE username = ?', ['Ishi']);
      if (!ishiUser) {
        const ishiPassword = await bcrypt.hash('Ishi123', 10);
        await runQuery(
          `INSERT INTO users (id, username, password_hash, name, role, role_code, avatar, badge_color, description)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            'user-ishi-superadmin',
            'Ishi',
            ishiPassword,
            'Ishi',
            'Super Admin',
            'super_admin',
            '👑',
            'bg-purple-900 text-amber-300 border-amber-400 font-extrabold shadow-sm',
            'System Super Administrator - Master Controls & Content Governance'
          ]
        );
        console.log('[SQL Database] Super Admin user "Ishi" added successfully.');
      }
    }

    // Seed Knowledge Hub
    const existingKb = await allQuery('SELECT * FROM knowledge_hub');
    if (existingKb.length === 0) {
      console.log('[SQL Database] Seeding default Knowledge Hub items for Ilocos Norte...');
      const kbSeed = [
        ['kb-1', 'tech', 'Solar-Powered Drip Fertigation System', 'Micro-drip irrigation combined with automated liquid fertilizer dosing powered by 400W solar arrays.', 'Installed across garlic and dragonfruit farms in Batac & Laoag, Ilocos Norte. Reduces water usage by up to 60% during dry season (November to April) and delivers precise nitrogen-potassium nutrient mixes directly to plant roots.', JSON.stringify(['tech', 'Guide']), 'Dry Season (Nov - Apr)', 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80', 'image'],
        ['kb-2', 'tech', 'MMSU STDC Solar Thermal Multi-Crop Drier', 'Solar thermal cabinet dryer engineered by Mariano Marcos State University (MMSU) Batac for high-capacity onion and garlic curing.', 'Prevents post-harvest fungal rot in Ilocos White Garlic and Red Granex Onions. Maintains internal temperatures at 38°C–42°C using solar collectors and thermal mass storage, cutting curing time from 14 days down to 4 days.', JSON.stringify(['tech', 'Guide']), 'Post-Harvest / Summer', 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80', 'image'],
        ['kb-3', 'tech', 'Smart Soil Moisture & EC Sensor Node', 'LoRaWAN IoT moisture probe and soil pH monitoring system tailored for sandy loam soils of Solsona and Dingras.', 'Transmits real-time volumetric water content and salinity levels to field managers every 30 minutes. Helps farmers in Solsona prevent over-salinization and schedule irrigation cycles precisely during dry spells.', JSON.stringify(['tech', 'Guide']), 'Year-Round', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', 'image'],
        ['kb-4', 'tech', 'Off-Season Dragon Fruit LED Supplemental Lighting Canopy', 'Nighttime artificial LED lighting grid to stimulate year-round flowering of red dragonfruit in Burgos, Ilocos Norte.', 'Burgos, Ilocos Norte is known as the Dragon Fruit Capital of the North. Utilizing 6W warm-white LED lamps suspended over rows for 4 extra nighttime hours induces off-season blooming during short-day months (October to February).', JSON.stringify(['tech', 'Guide']), 'Off-Season (Oct - Feb)', 'https://images.unsplash.com/photo-1508873696983-2df5057c0256?auto=format&fit=crop&w=800&q=80', 'image'],
        ['kb-5', 'knowledge', 'Rice-Garlic-Mungbean (R-G-M) Cropping System', 'The flagship triple-crop rotation strategy optimized for Ilocos Norte climate and soil profile.', 'Wet season hybrid rice (July–Oct) is followed immediately by zero-tillage Ilocos White Garlic (Nov–Feb) using rice straw mulch, and finished with drought-tolerant Pagasa 7 Mungbean ("Black Gold", Mar–May) which fixes atmospheric nitrogen back into the soil.', JSON.stringify(['knowledge', 'Guide']), 'Annual Rotation Cycle', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80', 'image'],
        ['kb-6', 'knowledge', 'Alternate Wetting and Drying (AWD) Water-Saving Technique', 'Controlled irrigation practice developed with PhilRice Batac to conserve groundwater reserves in Ilocos Norte.', 'Allows field water to naturally recede to 15cm below the soil surface inside a perforated field water tube (Paniwalan) before re-flooding. Reduces water pumping costs by 35% and methane emissions by 48% without yield reduction.', JSON.stringify(['knowledge', 'Guide']), 'Rice Season (Jul - Nov)', 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=800&q=80', 'image'],
        ['kb-7', 'knowledge', 'Rice Straw Mulching for Ilocos White Garlic', 'Traditional moisture-retention and weed suppression technique applied over garlic beds in Pasuquin and Bacarra.', 'Spread a 3 to 5 cm thick layer of clean, dry rice straw immediately after planting garlic cloves. Suppresses weed germination, keeps soil temperatures cool during dry Ilocano afternoons, and retains soil moisture.', JSON.stringify(['knowledge', 'Guide']), 'Dry Season (Nov - Mar)', 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80', 'image'],
        ['kb-8', 'knowledge', 'Silage Making & Urea-Treated Rice Straw for Ilocano Cattle', 'Nutritious dry-season livestock feed preparation using corn stover, molasses, and urea treatment.', 'Addresses dry-season forage scarcity in Ilocos Norte (Jan–May). Chopped yellow corn stalks mixed with 5% molasses and sealed airtight in plastic drums create highly palatable fermented feed for native beef cattle and goats.', JSON.stringify(['knowledge', 'Guide']), 'Dry Season (Jan - May)', 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=800&q=80', 'image'],
        ['kb-9', 'crops', 'Ilocos White Garlic ("Batanes / Native White Gold")', 'Premier geographic garlic variety known for high pungency, long shelf-life, and firm cloves cultivated in Pasuquin & Bacarra.', 'Planted in November following the wet season rice harvest. Requires well-drained sandy loam soil and full sun exposure. Known for its strong aroma and up to 10 months of natural ambient storability.', JSON.stringify(['crops', 'Guide']), 'November to March', 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80', 'image'],
        ['kb-10', 'crops', 'NSIC Rc222 (Tubigan 26) Inbred Rice Variety', 'High-yielding, drought-resilient rice variety widely grown across the Dingras and Sarrat agricultural plains.', 'Yields 6.1 to 10 tons per hectare under proper water management. Features strong resistance to stem borer and green leafhopper, ideal for Ilocos Norte lowland conditions.', JSON.stringify(['crops', 'Guide']), 'Wet Season (June - October)', 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80', 'image'],
        ['kb-11', 'crops', 'Yellow Granex & Red Pinoy Onions', 'High-value bulb cash crop grown extensively in Dingras and Laoag City agricultural sectors.', 'High market demand crop grown during cool dry months. Requires carefully monitored nitrogen application and timely curing to achieve maximum bulb size and anti-rot durability.', JSON.stringify(['crops', 'Guide']), 'December to April', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?auto=format&fit=crop&w=800&q=80', 'image'],
        ['kb-12', 'crops', 'Refructus Red Dragon Fruit (Burgos Strain)', 'Premium high-sugar pitaya variety cultivated in Burgos and Laoag City dragonfruit farms.', 'Thrives in sunny coastal slopes with well-drained soil. Sweet red-fleshed variety harvested from May through October, generating high revenue per hectare.', JSON.stringify(['crops', 'Guide']), 'May to October', 'https://images.unsplash.com/photo-1527325678964-549216416a27?auto=format&fit=crop&w=800&q=80', 'image'],
        ['kb-13', 'livestock', 'Ilocos Native Goat (Kambing - Upgrade Strain)', 'Hardy, disease-resistant native goat breed integrated into coconut and orchard farmlands in Badoc & Currimao.', 'Highly adapted to warm Ilocano dry spells. Browses on local forage like ipil-ipil and kakawate leaves. Provides high-protein meat (Papaitan/Kilawin staple) and fast kid rearing cycles.', JSON.stringify(['livestock', 'Guide']), 'Year-Round', 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80', 'image'],
        ['kb-14', 'livestock', 'Ilocos Native Beef Cattle (Baka - Brahman Cross)', 'Dual-purpose draft and beef cattle managed across Solsona and Marcos pasture areas.', 'Exceptionally resilient against hot weather and tick-borne diseases. Used for heavy field preparation during rice planting and fattened on corn forage for local meat markets.', JSON.stringify(['livestock', 'Guide']), 'Year-Round', 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80', 'image'],
        ['kb-15', 'livestock', 'Riverine Carabao (Damulag / Water Buffalo)', 'High-value milk and draft carabao raised in Batac City dairy cooperatives supported by PCC MMSU.', 'Produces rich milk (7-8% butterfat content) utilized for Ilocano milk candy (Pastillas) and fresh carabao cheese (Kesong Puti), alongside land cultivation work.', JSON.stringify(['livestock', 'Guide']), 'Year-Round', 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80', 'image'],
        ['kb-16', 'livestock', 'Ilocos Banaba Native Chicken Strain', 'Free-range indigenous chicken raised in organic backyard farms across Vintar and San Nicolas.', 'Renowned for flavorful gourmet meat, high foraging ability, and natural resistance to Newcastle Disease. Feeds on fallen grains, insect larvae, and native grass.', JSON.stringify(['livestock', 'Guide']), 'Year-Round', 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80', 'image']
      ];
      for (const k of kbSeed) {
        await runQuery(
          `INSERT INTO knowledge_hub (id, category, title, summary, description, tags, season, media_url, media_type)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          k
        );
      }
    }

    // Seed Inventory
    const existingInv = await allQuery('SELECT * FROM inventory');
    if (existingInv.length === 0) {
      console.log('[SQL Database] Seeding default Inventory items for Ilocos Norte...');
      const invSeed = [
        ['inv-101', 'EQ-INC-01', 'Kubota L3901 Mini Tractor & Rotary Tiller', 'Machinery', 'Operational', 'Dingras Central Shed, Ilocos Norte', 'JBenedict Alberto', 2, 'unit', 1, '2026-07-10', 'Low ground pressure tires suitable for wet rice paddies and dry garlic tilling.', 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=800&q=80', 'image'],
        ['inv-102', 'EQ-SOL-02', 'MMSU Solar Drip Fertigation Pump Kit', 'Irrigation', 'Operational', 'Batac Demonstration Farm, Ilocos Norte', 'Nathaniel Bonifacio', 4, 'set', 1, '2026-07-15', 'Includes 400W solar panel array, 24V DC pump, and Venturi fertilizer injector.', 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80', 'image'],
        ['inv-103', 'EQ-STDC-03', 'STDC Multi-Crop Solar Cabinet Drier', 'Supplies', 'Operational', 'Pasuquin Post-Harvest Facility, Ilocos Norte', 'Nythan Bagasani', 3, 'unit', 1, '2026-07-08', 'Capacity: 500kg garlic/onion bulbs per curing run.', 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80', 'image'],
        ['inv-104', 'SUP-GAR-04', 'Certified Ilocos White Garlic Seed Cloves', 'Supplies', 'Operational', 'Laoag Agri Cold Storage, Ilocos Norte', 'JBenedict Alberto', 450, 'kg', 100, '2026-07-19', 'High-grade disease-free seed stock prepared for November planting.', 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80', 'image']
      ];
      for (const i of invSeed) {
        await runQuery(
          `INSERT INTO inventory (id, code, name, category, status, location, assigned_to, stock_qty, unit, min_threshold, last_maintained, notes, media_url, media_type)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          i
        );
      }
    }

    // Seed Audit Logs
    const existingLogs = await allQuery('SELECT * FROM audit_logs');
    if (existingLogs.length === 0) {
      console.log('[SQL Database] Seeding default Audit Logs for Ilocos Norte...');
      const logSeed = [
        ['log-101', '2026-07-20 08:30 AM', 'JBenedict Alberto', 'Field Worker', 'Planting & Sowing', 'Ilocos White Garlic Cloves', 'Crops', 'Pasuquin Coastal Plot, Ilocos Norte', 'Planted 120 kg cloves over 0.5 hectare', 'Applied rice straw mulching immediately after row placement to retain soil moisture.', 'Logged & Verified', 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80', 'image'],
        ['log-102', '2026-07-21 10:15 AM', 'Nathaniel Bonifacio', 'Inventory & Tech Specialist', 'Equipment Maintenance', 'Solar Drip Pump Assembly', 'Equipment', 'MMSU Agri Compound, Batac City, Ilocos Norte', 'Replaced intake filter & cleaned 4x 100W PV panels', 'Flow rate restored to 45 L/min. Solar battery backup charging properly.', 'Logged & Verified', 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80', 'image'],
        ['log-103', '2026-07-22 02:45 PM', 'Nythan Bagasani', 'Farm Manager', 'Livestock Movement & Care', 'Native Goat Breeding Herd', 'Livestock', 'Currimao Pasture Sector, Ilocos Norte', 'Vaccinated 28 head of native goats with dewormer & vitamin boost', 'All animals in healthy condition. 3 does scheduled for kid delivery next month.', 'Logged & Verified', 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80', 'image'],
        ['log-104', '2026-07-22 04:00 PM', 'JBenedict Alberto', 'Field Worker', 'Harvest & Sales', 'Refructus Dragon Fruit', 'Crops', 'Burgos Dragonfruit Plantation, Ilocos Norte', 'Harvested 350 kg prime Grade-A red dragonfruit', 'Dispatched to Laoag City Central Market cooperative distributor.', 'Logged & Verified', 'https://images.unsplash.com/photo-1527325678964-549216416a27?auto=format&fit=crop&w=800&q=80', 'image']
      ];
      for (const l of logSeed) {
        await runQuery(
          `INSERT INTO audit_logs (id, timestamp, user, user_role, action_type, item_tagged, category, location, quantity_details, notes, verification_status, media_url, media_type)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          l
        );
      }
    }

    // Seed Financials
    const existingFin = await allQuery('SELECT * FROM financials');
    if (existingFin.length === 0) {
      console.log('[SQL Database] Seeding default Financial Transactions for Ilocos Norte...');
      const finSeed = [
        ['fin-101', '2026-07-18', 'Bulk Ilocos White Garlic Sale - Laoag Wholesale', 'Income', 145000, 'Crop Sales', 'Nythan Bagasani', 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80', 'image'],
        ['fin-102', '2026-07-19', 'Purchase of Solar Drip System Expansion Parts', 'Expense', 38500, 'Equipment Maintenance', 'Nathaniel Bonifacio', 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80', 'image'],
        ['fin-103', '2026-07-20', 'Batac Dairy Carabao Milk Sales - Cooperative Delivery', 'Income', 28400, 'Livestock Sales', 'Nythan Bagasani', 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80', 'image'],
        ['fin-104', '2026-07-21', 'Organic Fertilizer & Mungbean Seeds Procurement', 'Expense', 22000, 'Fertilizer & Seeds', 'JBenedict Alberto', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80', 'image']
      ];
      for (const f of finSeed) {
        await runQuery(
          `INSERT INTO financials (id, date, title, type, amount, category, logged_by, media_url, media_type)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          f
        );
      }
    }

    // Seed Monitoring Entries
    const existingMon = await allQuery('SELECT * FROM monitoring_entries');
    if (existingMon.length === 0) {
      console.log('[SQL Database] Seeding default Dynamic Monitoring entries for Ilocos Norte...');
      const monSeed = [
        ['mon-101', 'crop', 'Batac Hybrid Rice Field (Sector 1)', 'MMSU Agri Field, Batac City, Ilocos Norte', 'Healthy / Operational', 'NSIC Rc222 at vegetative tillering stage. AWD water tube level at -5cm. Zero pest incidence.', 'NSIC Rc222 (Tubigan 26)', 'Vegetative Tillering', '2026-07-22', 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80', 'image'],
        ['mon-102', 'crop', 'Laoag Organic Garlic Nursery', 'San Nicolas Road Plot, Laoag City, Ilocos Norte', 'Needs Attention / Water', 'Ilocos White Garlic seedbeds prepared for early mulching. Drip moisture check requested.', 'Ilocos White Garlic', 'Land Prep & Bedding', '2026-07-22', 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80', 'image'],
        ['mon-103', 'crop', 'Burgos Dragonfruit Orchard Block B', 'Paayas Coastal Hill, Burgos, Ilocos Norte', 'Ready for Harvest / Duty', 'Off-season LED lighting triggered heavy blooming. 85% of fruit pods fully ripe for picking.', 'Refructus Red Dragonfruit', 'Fruit Maturation', '2026-07-21', 'https://images.unsplash.com/photo-1527325678964-549216416a27?auto=format&fit=crop&w=800&q=80', 'image'],
        ['mon-104', 'crop', 'Dingras Red Onion Plot', 'Dingras Agricultural Valley, Ilocos Norte', 'Healthy / Operational', 'Yellow Granex onions showing robust foliage growth. Soil EC level optimal.', 'Yellow Granex Onion', 'Bulbing Stage', '2026-07-20', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?auto=format&fit=crop&w=800&q=80', 'image'],
        ['mon-201', 'equipment', 'MMSU Solar Drip Pump Station', 'Batac Sector 2 Substation, Ilocos Norte', 'Healthy / Operational', 'Solar PV output at 390W peak. Water pressure steady at 2.2 bar across drip lines.', null, null, '2026-07-22', 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80', 'image'],
        ['mon-202', 'equipment', 'Kubota Rotary Tiller 01', 'Pasuquin Machinery Shed, Ilocos Norte', 'Under Treatment / Maintenance', 'Undergoing scheduled oil change and blade sharpening prior to garlic land prep.', null, null, '2026-07-21', 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=800&q=80', 'image'],
        ['mon-203', 'equipment', 'STDC Multi-Crop Solar Drier Unit A', 'Laoag Post-Harvest Center, Ilocos Norte', 'Healthy / Operational', 'Solar collector fan running automatically. Interior humidity at 32%.', null, null, '2026-07-22', 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80', 'image'],
        ['mon-301', 'livestock', 'Pasuquin Native Goat Herd', 'Pasuquin Hillside Grazing Range, Ilocos Norte', 'Healthy / Operational', '28 head of upgraded native goats. Daily forage supplementation with ipil-ipil and corn silage.', null, null, '2026-07-22', 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80', 'image'],
        ['mon-302', 'livestock', 'Batac PCC Dairy Carabao Pen', 'PCC MMSU Dairy Compound, Batac City, Ilocos Norte', 'Healthy / Operational', '12 lactating riverine carabaos. Morning milk production averaged 7.5 liters/head.', null, null, '2026-07-22', 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80', 'image'],
        ['mon-303', 'livestock', 'Solsona Native Cattle Fattening Group', 'Solsona Riverfront Pasture, Ilocos Norte', 'Healthy / Operational', '15 head of Brahman cross cattle undergoing 90-day corn silage weight gain program.', null, null, '2026-07-20', 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80', 'image'],
        ['mon-304', 'livestock', 'Vintar Free-Range Banaba Chicken Flock', 'Vintar Agro-Forestry Farm, Ilocos Norte', 'Healthy / Operational', '60 native hens and roosters in free-range paddock. Egg production steady.', null, null, '2026-07-21', 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80', 'image']
      ];
      for (const m of monSeed) {
        await runQuery(
          `INSERT INTO monitoring_entries (id, type, name, location, status, details, crop, stage, last_updated, media_url, media_type)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          m
        );
      }
    }
  } catch (err) {
    console.error('[SQL Database] Initialization error:', err);
  }
};

export default db;
