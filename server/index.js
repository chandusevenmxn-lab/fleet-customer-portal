const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'fleet_user',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'fleet_db',
  password: process.env.DB_PASSWORD || 'fleet_password',
  port: 5432,
});

// Test DB Connection
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'OK', time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'Error', error: err.message });
  }
});

// GET all quotes
app.get('/api/quotes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quotes ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new policy (Issue Policy)
app.post('/api/policies', async (req, res) => {
  const { quote_id, policy_number, effective_date, receipt_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO policies (quote_id, policy_number, effective_date, receipt_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [quote_id, policy_number, effective_date, receipt_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
