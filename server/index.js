import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initDb, runQuery, getQuery, allQuery } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'agri-pulse-secret-key-2026';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Database
initDb();

// --- REAL-TIME EVENTS (SSE) SYSTEM ---
let sseClients = [];

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

const broadcastChange = (type, data = {}) => {
  const payload = JSON.stringify({ type, data, timestamp: Date.now() });
  sseClients.forEach(client => {
    try {
      client.res.write(`data: ${payload}\n\n`);
    } catch (err) {
      // client disconnected
    }
  });
};

// Health check & Root Endpoints
app.get(['/', '/healthz', '/api'], (req, res) => {
  res.json({ status: 'ok', service: 'AGRI-KA Express Backend API', time: new Date().toISOString() });
});

// --- AUTHENTICATION ENDPOINTS ---

// Register New User into SQL Database
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, name, role, role_code, avatar, badge_color, description } = req.body;

    if (!username || !password || !name) {
      return res.status(400).json({ error: 'Username, password, and name are required' });
    }

    const existing = await getQuery('SELECT id FROM users WHERE username = ?', [username]);
    if (existing) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const id = `user-${Date.now()}`;
    const password_hash = await bcrypt.hash(password, 10);
    const userRole = role || 'Field Worker';
    const roleCode = role_code || 'worker';
    const userAvatar = avatar || '👨‍🌾';
    const badgeColor = badge_color || 'bg-emerald-100 text-emerald-800 border-emerald-300';
    const desc = description || 'Registered Farm Personnel';

    await runQuery(
      `INSERT INTO users (id, username, password_hash, name, role, role_code, avatar, badge_color, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, username, password_hash, name, userRole, roleCode, userAvatar, badgeColor, desc]
    );

    const userObj = { id, username, name, role: userRole, roleCode, avatar: userAvatar, badgeColor, description: desc };
    const token = jwt.sign({ userId: id, username, role: userRole }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'User registered successfully in SQL Database', user: userObj, token });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Failed to register user in database' });
  }
});

// User Login against SQL Database
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await getQuery('SELECT * FROM users WHERE username = ? COLLATE NOCASE', [username]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const userProfile = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      roleCode: user.role_code,
      avatar: user.avatar,
      badgeColor: user.badge_color,
      description: user.description
    };

    res.json({ message: 'Login successful', user: userProfile, token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Database login failed' });
  }
});

// List all SQL Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await allQuery('SELECT id, username, name, role, role_code as roleCode, avatar, badge_color as badgeColor, description FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// --- CENTRALIZED KNOWLEDGE HUB ENDPOINTS ---
app.get('/api/knowledge', async (req, res) => {
  try {
    const rows = await allQuery('SELECT * FROM knowledge_hub ORDER BY created_at DESC');
    const formatted = rows.map(r => ({
      id: r.id,
      category: r.category,
      title: r.title,
      summary: r.summary,
      description: r.description,
      tags: r.tags ? JSON.parse(r.tags) : [],
      season: r.season || 'Year-Round',
      mediaUrl: r.media_url,
      mediaType: r.media_type || 'image',
      image: r.media_url,
      isHidden: Boolean(r.is_hidden)
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch knowledge hub items' });
  }
});

app.post('/api/knowledge', async (req, res) => {
  try {
    const { id, category, title, summary, description, tags, season, mediaUrl, mediaType, image, isHidden } = req.body;
    const itemDbId = id || `kb-${Date.now()}`;
    const mUrl = mediaUrl || image || '';
    const mType = mediaType || (mUrl.startsWith('data:video') || mUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image');
    const tagStr = Array.isArray(tags) ? JSON.stringify(tags) : JSON.stringify([category]);
    const hiddenVal = isHidden ? 1 : 0;

    await runQuery(
      `INSERT INTO knowledge_hub (id, category, title, summary, description, tags, season, media_url, media_type, is_hidden)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [itemDbId, category || 'tech', title, summary, description || summary, tagStr, season || 'Year-Round', mUrl, mType, hiddenVal]
    );

    broadcastChange('knowledge_updated', { id: itemDbId });
    res.status(201).json({ message: 'Guide saved to SQL database', id: itemDbId });
  } catch (err) {
    console.error('Insert Knowledge Error:', err);
    res.status(500).json({ error: 'Failed to insert knowledge guide' });
  }
});

app.put('/api/knowledge/:id/hide', async (req, res) => {
  try {
    const { isHidden } = req.body;
    const hiddenVal = isHidden ? 1 : 0;
    await runQuery('UPDATE knowledge_hub SET is_hidden = ? WHERE id = ?', [hiddenVal, req.params.id]);
    broadcastChange('knowledge_updated', { id: req.params.id, isHidden: Boolean(hiddenVal) });
    res.json({ message: 'Knowledge item hide status updated', isHidden: Boolean(hiddenVal) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle hide status' });
  }
});

app.put('/api/knowledge/:id', async (req, res) => {
  try {
    const { category, title, summary, description, tags, season, mediaUrl, mediaType, image, isHidden } = req.body;
    const mUrl = mediaUrl || image || '';
    const mType = mediaType || (mUrl.startsWith('data:video') || mUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image');
    const tagStr = Array.isArray(tags) ? JSON.stringify(tags) : JSON.stringify([category]);
    const hiddenVal = isHidden !== undefined ? (isHidden ? 1 : 0) : 0;

    await runQuery(
      `UPDATE knowledge_hub SET category = ?, title = ?, summary = ?, description = ?, tags = ?, season = ?, media_url = ?, media_type = ?, is_hidden = ? WHERE id = ?`,
      [category, title, summary, description, tagStr, season, mUrl, mType, hiddenVal, req.params.id]
    );

    broadcastChange('knowledge_updated', { id: req.params.id });
    res.json({ message: 'Guide updated in SQL database' });
  } catch (err) {
    console.error('Update Knowledge Error:', err);
    res.status(500).json({ error: 'Failed to update knowledge guide' });
  }
});

app.delete('/api/knowledge/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM knowledge_hub WHERE id = ?', [req.params.id]);
    broadcastChange('knowledge_updated', { id: req.params.id });
    res.json({ message: 'Guide deleted from SQL database' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete knowledge guide' });
  }
});

// --- RECORD & INVENTORY ENDPOINTS ---

// 1. Audit Logs
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await allQuery('SELECT * FROM audit_logs ORDER BY timestamp DESC');
    const formatted = logs.map(l => ({
      id: l.id,
      timestamp: l.timestamp,
      user: l.user,
      userRole: l.user_role,
      actionType: l.action_type,
      itemTagged: l.item_tagged,
      category: l.category,
      location: l.location,
      quantityDetails: l.quantity_details,
      notes: l.notes,
      verificationStatus: l.verification_status,
      mediaUrl: l.media_url,
      mediaType: l.media_type || 'image',
      isHidden: Boolean(l.is_hidden)
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

app.post('/api/logs', async (req, res) => {
  try {
    const { id, timestamp, user, userRole, actionType, itemTagged, category, location, quantityDetails, notes, verificationStatus, mediaUrl, mediaType, isHidden } = req.body;
    
    const logId = id || `log-${Date.now()}`;
    const mType = mediaType || (mediaUrl?.startsWith('data:video') || mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image');
    const hiddenVal = isHidden ? 1 : 0;

    await runQuery(
      `INSERT INTO audit_logs (id, timestamp, user, user_role, action_type, item_tagged, category, location, quantity_details, notes, verification_status, media_url, media_type, is_hidden)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [logId, timestamp, user, userRole, actionType, itemTagged, category, location, quantityDetails, notes, verificationStatus, mediaUrl || null, mType, hiddenVal]
    );

    broadcastChange('logs_updated', { id: logId });
    res.status(201).json({ message: 'Log recorded in SQL database', id: logId });
  } catch (err) {
    console.error('Insert Log Error:', err);
    res.status(500).json({ error: 'Failed to insert log' });
  }
});

app.put('/api/logs/:id/hide', async (req, res) => {
  try {
    const { isHidden } = req.body;
    const hiddenVal = isHidden ? 1 : 0;
    await runQuery('UPDATE audit_logs SET is_hidden = ? WHERE id = ?', [hiddenVal, req.params.id]);
    broadcastChange('logs_updated', { id: req.params.id, isHidden: Boolean(hiddenVal) });
    res.json({ message: 'Audit log hide status updated', isHidden: Boolean(hiddenVal) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle log hide status' });
  }
});

app.put('/api/logs/:id', async (req, res) => {
  try {
    const { timestamp, user, userRole, actionType, itemTagged, category, location, quantityDetails, notes, verificationStatus, mediaUrl, mediaType, isHidden } = req.body;
    const mType = mediaType || (mediaUrl?.startsWith('data:video') || mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image');
    const hiddenVal = isHidden !== undefined ? (isHidden ? 1 : 0) : 0;

    await runQuery(
      `UPDATE audit_logs SET timestamp = ?, user = ?, user_role = ?, action_type = ?, item_tagged = ?, category = ?, location = ?, quantity_details = ?, notes = ?, verification_status = ?, media_url = ?, media_type = ?, is_hidden = ? WHERE id = ?`,
      [timestamp, user, userRole, actionType, itemTagged, category, location, quantityDetails, notes, verificationStatus, mediaUrl || null, mType, hiddenVal, req.params.id]
    );

    broadcastChange('logs_updated', { id: req.params.id });
    res.json({ message: 'Log updated in SQL database' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update log' });
  }
});

app.delete('/api/logs/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM audit_logs WHERE id = ?', [req.params.id]);
    broadcastChange('logs_updated', { id: req.params.id });
    res.json({ message: 'Log deleted from SQL database' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete log' });
  }
});

// 2. Inventory Items
app.get('/api/inventory', async (req, res) => {
  try {
    const items = await allQuery('SELECT * FROM inventory');
    const formatted = items.map(i => ({
      id: i.id,
      code: i.code,
      name: i.name,
      category: i.category,
      status: i.status,
      location: i.location,
      assignedTo: i.assigned_to,
      stockQty: i.stock_qty,
      unit: i.unit,
      minThreshold: i.min_threshold,
      lastMaintained: i.last_maintained,
      notes: i.notes,
      mediaUrl: i.media_url,
      mediaType: i.media_type || 'image',
      isHidden: Boolean(i.is_hidden)
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

app.post('/api/inventory', async (req, res) => {
  try {
    const { id, code, name, category, status, location, assignedTo, stockQty, unit, minThreshold, lastMaintained, notes, mediaUrl, mediaType, isHidden } = req.body;
    const invId = id || `inv-${Date.now()}`;
    const itemCode = code || `EQ-${Math.floor(100 + Math.random() * 900)}`;
    const mType = mediaType || (mediaUrl?.startsWith('data:video') || mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image');
    const hiddenVal = isHidden ? 1 : 0;

    await runQuery(
      `INSERT INTO inventory (id, code, name, category, status, location, assigned_to, stock_qty, unit, min_threshold, last_maintained, notes, media_url, media_type, is_hidden)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [invId, itemCode, name, category || 'Tools', status || 'Operational', location || 'Storage', assignedTo || null, stockQty || 1, unit || 'pcs', minThreshold || 0, lastMaintained || null, notes || '', mediaUrl || null, mType, hiddenVal]
    );

    broadcastChange('inventory_updated', { id: invId });
    res.status(201).json({ message: 'Inventory item added to SQL database', id: invId });
  } catch (err) {
    console.error('Insert Inventory Error:', err);
    res.status(500).json({ error: 'Failed to add inventory item' });
  }
});

app.put('/api/inventory/:id/hide', async (req, res) => {
  try {
    const { isHidden } = req.body;
    const hiddenVal = isHidden ? 1 : 0;
    await runQuery('UPDATE inventory SET is_hidden = ? WHERE id = ?', [hiddenVal, req.params.id]);
    broadcastChange('inventory_updated', { id: req.params.id, isHidden: Boolean(hiddenVal) });
    res.json({ message: 'Inventory item hide status updated', isHidden: Boolean(hiddenVal) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle inventory hide status' });
  }
});

app.put('/api/inventory/:id', async (req, res) => {
  try {
    const { code, name, category, status, location, assignedTo, stockQty, unit, minThreshold, lastMaintained, notes, mediaUrl, mediaType, isHidden } = req.body;
    const mType = mediaType || (mediaUrl?.startsWith('data:video') || mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image');
    const hiddenVal = isHidden !== undefined ? (isHidden ? 1 : 0) : 0;

    if (name) {
      await runQuery(
        `UPDATE inventory SET code = ?, name = ?, category = ?, status = ?, location = ?, assigned_to = ?, stock_qty = ?, unit = ?, min_threshold = ?, last_maintained = ?, notes = ?, media_url = ?, media_type = ?, is_hidden = ? WHERE id = ?`,
        [code, name, category, status, location, assignedTo, stockQty, unit, minThreshold, lastMaintained, notes, mediaUrl || null, mType, hiddenVal, req.params.id]
      );
    } else {
      // Partial update (e.g. status toggle)
      await runQuery('UPDATE inventory SET status = ? WHERE id = ?', [status, req.params.id]);
    }

    broadcastChange('inventory_updated', { id: req.params.id });
    res.json({ message: 'Inventory item updated in SQL DB' });
  } catch (err) {
    console.error('Update Inventory Error:', err);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

app.delete('/api/inventory/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM inventory WHERE id = ?', [req.params.id]);
    broadcastChange('inventory_updated', { id: req.params.id });
    res.json({ message: 'Inventory item deleted from SQL database' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

// 3. Financial Transactions
app.get('/api/financials', async (req, res) => {
  try {
    const transactions = await allQuery('SELECT * FROM financials ORDER BY date DESC');
    const formatted = transactions.map(t => ({
      id: t.id,
      date: t.date,
      title: t.title,
      type: t.type,
      amount: t.amount,
      category: t.category,
      loggedBy: t.logged_by,
      mediaUrl: t.media_url,
      mediaType: t.media_type || 'image',
      isHidden: Boolean(t.is_hidden)
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch financials' });
  }
});

app.post('/api/financials', async (req, res) => {
  try {
    const { id, date, title, type, amount, category, loggedBy, mediaUrl, mediaType, isHidden } = req.body;
    const transId = id || `fin-${Date.now()}`;
    const mType = mediaType || (mediaUrl?.startsWith('data:video') || mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image');
    const hiddenVal = isHidden ? 1 : 0;

    await runQuery(
      `INSERT INTO financials (id, date, title, type, amount, category, logged_by, media_url, media_type, is_hidden)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [transId, date, title, type, amount, category, loggedBy, mediaUrl || null, mType, hiddenVal]
    );

    broadcastChange('financials_updated', { id: transId });
    res.status(201).json({ message: 'Financial transaction stored in SQL DB', id: transId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record transaction' });
  }
});

app.put('/api/financials/:id/hide', async (req, res) => {
  try {
    const { isHidden } = req.body;
    const hiddenVal = isHidden ? 1 : 0;
    await runQuery('UPDATE financials SET is_hidden = ? WHERE id = ?', [hiddenVal, req.params.id]);
    broadcastChange('financials_updated', { id: req.params.id, isHidden: Boolean(hiddenVal) });
    res.json({ message: 'Financial record hide status updated', isHidden: Boolean(hiddenVal) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle financial hide status' });
  }
});

app.put('/api/financials/:id', async (req, res) => {
  try {
    const { date, title, type, amount, category, loggedBy, mediaUrl, mediaType, isHidden } = req.body;
    const mType = mediaType || (mediaUrl?.startsWith('data:video') || mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image');
    const hiddenVal = isHidden !== undefined ? (isHidden ? 1 : 0) : 0;

    await runQuery(
      `UPDATE financials SET date = ?, title = ?, type = ?, amount = ?, category = ?, logged_by = ?, media_url = ?, media_type = ?, is_hidden = ? WHERE id = ?`,
      [date, title, type, amount, category, loggedBy, mediaUrl || null, mType, hiddenVal, req.params.id]
    );

    broadcastChange('financials_updated', { id: req.params.id });
    res.json({ message: 'Financial transaction updated in SQL DB' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

app.delete('/api/financials/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM financials WHERE id = ?', [req.params.id]);
    broadcastChange('financials_updated', { id: req.params.id });
    res.json({ message: 'Financial record deleted from SQL DB' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// --- DYNAMIC MONITORING ENDPOINTS ---
app.get('/api/monitoring', async (req, res) => {
  try {
    const rows = await allQuery('SELECT * FROM monitoring_entries ORDER BY created_at DESC');
    const fields = [];
    const equipment = [];
    const livestock = [];

    rows.forEach(r => {
      const item = {
        id: r.id,
        type: r.type,
        name: r.name,
        location: r.location,
        status: r.status,
        details: r.details,
        crop: r.crop,
        stage: r.stage,
        lastUpdated: r.last_updated,
        mediaUrl: r.media_url,
        mediaType: r.media_type || 'image',
        isHidden: Boolean(r.is_hidden)
      };
      if (r.type === 'crop') fields.push(item);
      else if (r.type === 'equipment') equipment.push(item);
      else livestock.push(item);
    });

    res.json({ fields, equipment, livestock });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch monitoring entries' });
  }
});

app.post('/api/monitoring', async (req, res) => {
  try {
    const { id, type, name, location, status, details, crop, stage, lastUpdated, mediaUrl, mediaType, isHidden } = req.body;
    const entryId = id || `status-${Date.now()}`;
    const mType = mediaType || (mediaUrl?.startsWith('data:video') || mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image');
    const hiddenVal = isHidden ? 1 : 0;

    await runQuery(
      `INSERT INTO monitoring_entries (id, type, name, location, status, details, crop, stage, last_updated, media_url, media_type, is_hidden)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [entryId, type || 'crop', name, location, status, details, crop || null, stage || null, lastUpdated || new Date().toLocaleDateString(), mediaUrl || null, mType, hiddenVal]
    );

    broadcastChange('monitoring_updated', { id: entryId });
    res.status(201).json({ message: 'Monitoring entry saved in SQL DB', id: entryId });
  } catch (err) {
    console.error('Insert Monitoring Error:', err);
    res.status(500).json({ error: 'Failed to insert monitoring entry' });
  }
});

app.put('/api/monitoring/:id/hide', async (req, res) => {
  try {
    const { isHidden } = req.body;
    const hiddenVal = isHidden ? 1 : 0;
    await runQuery('UPDATE monitoring_entries SET is_hidden = ? WHERE id = ?', [hiddenVal, req.params.id]);
    broadcastChange('monitoring_updated', { id: req.params.id, isHidden: Boolean(hiddenVal) });
    res.json({ message: 'Monitoring entry hide status updated', isHidden: Boolean(hiddenVal) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle monitoring hide status' });
  }
});

app.put('/api/monitoring/:id', async (req, res) => {
  try {
    const { type, name, location, status, details, crop, stage, lastUpdated, mediaUrl, mediaType, isHidden } = req.body;
    const mType = mediaType || (mediaUrl?.startsWith('data:video') || mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image');
    const hiddenVal = isHidden !== undefined ? (isHidden ? 1 : 0) : 0;

    await runQuery(
      `UPDATE monitoring_entries SET type = ?, name = ?, location = ?, status = ?, details = ?, crop = ?, stage = ?, last_updated = ?, media_url = ?, media_type = ?, is_hidden = ? WHERE id = ?`,
      [type, name, location, status, details, crop || null, stage || null, lastUpdated || new Date().toLocaleDateString(), mediaUrl || null, mType, hiddenVal, req.params.id]
    );

    broadcastChange('monitoring_updated', { id: req.params.id });
    res.json({ message: 'Monitoring entry updated in SQL DB' });
  } catch (err) {
    console.error('Update Monitoring Error:', err);
    res.status(500).json({ error: 'Failed to update monitoring entry' });
  }
});

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

if (fs.existsSync(distPath)) {
  console.log(`[Express Server] Serving static production build from: ${distPath}`);
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 AGRI-PULSE Express SQL Server active on http://localhost:${PORT}`);
});

