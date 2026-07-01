import express from 'express';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const PORT = 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/', async (req, res) => {
  try {
    // Run a test query against Postgres
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({
      source: "Node/Express Gateway",
      db_status: "connected",
      postgres_time: result.rows[0].current_time
    });
  } catch (err) {
    res.status(500).json({ error: "DB connection failed", details: err.message });
  }
});

app.get('/gin-status', async (req, res) => {
  try {
    const response = await fetch('http://gin-server:8080/');
    const data = await response.json();

    res.json({
      gateway_status: "connected",
      received_from_go: data
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to communicate with Go backend", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Express gateway listening on port ${PORT}`);
});
