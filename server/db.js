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
    await safeAddColumn('inventory', 'media_url TEXT');
    await safeAddColumn('inventory', 'media_type TEXT');
    await safeAddColumn('financials', 'media_url TEXT');
    await safeAddColumn('financials', 'media_type TEXT');

    console.log('[SQL Database] Schema verified & initialized successfully.');

    // Seed default users if empty
    const existingUsers = await allQuery('SELECT * FROM users');
    if (existingUsers.length === 0) {
      console.log('[SQL Database] Seeding default farm personnel accounts...');
      
      const defaultPassword = await bcrypt.hash('farm123', 10);

      const usersToSeed = [
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
      console.log('[SQL Database] Default users seeded successfully! (Password for all: farm123)');
    }
  } catch (err) {
    console.error('[SQL Database] Initialization error:', err);
  }
};

export default db;
