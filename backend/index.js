const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env' });

const app = express();
const port = 3001;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());

const createAuthRouter = require('./routes/auth');
const createApiRouter = require('./routes/apiFunctions');

const { router: authRouter, authenticate } = createAuthRouter(supabase);
const apiRouter = createApiRouter(db);

app.use('/api/auth', authRouter);
app.use('/api', authenticate, apiRouter);

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