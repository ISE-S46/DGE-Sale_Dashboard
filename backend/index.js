const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env' });

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
    connection.release();
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Authentication Middleware
async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Unauthorized' });

  req.user = user;
  next();
}

// Fetch sale data
app.get('/api/sales', authenticate, (req, res) => {
  const query = `
    SELECT SUM(Revenue) AS total FROM sales 
    WHERE user_id = ?
  `;
  db.query(query, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Fetch Top product
app.get('/api/top-products', authenticate, (req, res) => {
  const query = `
    SELECT Description, SUM(Revenue) AS total 
    FROM sales 
    WHERE user_id = ?
    GROUP BY Description 
    ORDER BY total DESC 
    LIMIT 10
  `;
  db.query(query, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.use(cors({ origin: 'http://localhost:3000' })); //will replace ip with frontend ip later