const express = require('express');

module.exports = function createApiRouter(db) {
  const router = express.Router();
  
  router.get('/revenue', (req, res) => {
    db.query('SELECT MAX(InvoiceDate) as latest_date FROM sales', (err, dateResults) => {
      if (err) return res.status(500).json({ error: 'Database error' });
     
      const latestDate = dateResults[0].latest_date;
     
      const query = `
        SELECT SUM(Revenue) AS total
        FROM sales
        WHERE user_id = ?
        AND MONTH(InvoiceDate) = MONTH(?)
        AND YEAR(InvoiceDate) = YEAR(?)
      `;
     
      db.query(query, [req.user.id, latestDate, latestDate], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
      });
    });
  });
  
  router.get('/top-products', (req, res) => {
    db.query('SELECT MAX(InvoiceDate) as latest_date FROM sales', (err, dateResults) => {
      if (err) return res.status(500).json({ error: 'Database error' });
     
      const latestDate = dateResults[0].latest_date;
     
      const query = `
        SELECT Description, SUM(Revenue) AS total
        FROM sales
        WHERE user_id = ?
        AND MONTH(InvoiceDate) = MONTH(?)
        AND YEAR(InvoiceDate) = YEAR(?)
        GROUP BY Description
        ORDER BY total DESC
        LIMIT 10
      `;
     
      db.query(query, [req.user.id, latestDate, latestDate], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
      });
    });
  });
  
  router.get('/total-orders', (req, res) => {
    db.query('SELECT MAX(InvoiceDate) as latest_date FROM sales', (err, dateResults) => {
      if (err) return res.status(500).json({ error: 'Database error' });
     
      const latestDate = dateResults[0].latest_date;
     
      const query = `
        SELECT COUNT(DISTINCT InvoiceNo) AS total_orders
        FROM sales
        WHERE user_id = ?
        AND MONTH(InvoiceDate) = MONTH(?)
        AND YEAR(InvoiceDate) = YEAR(?)
      `;
     
      db.query(query, [req.user.id, latestDate, latestDate], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
      });
    });
  });
  
  router.get('/top-country', (req, res) => {
    db.query('SELECT MAX(InvoiceDate) as latest_date FROM sales', (err, dateResults) => {
      if (err) return res.status(500).json({ error: 'Database error' });
     
      const latestDate = dateResults[0].latest_date;
     
      const query = `
        SELECT Country,
              SUM(Revenue) AS total_revenue,
              COUNT(DISTINCT InvoiceNo) AS total_orders
        FROM sales
        WHERE user_id = ?
        AND MONTH(InvoiceDate) = MONTH(?)
        AND YEAR(InvoiceDate) = YEAR(?)
        GROUP BY Country
        ORDER BY total_revenue DESC
        LIMIT 10
      `;
     
      db.query(query, [req.user.id, latestDate, latestDate], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
      });
    });
  });
  
  return router;
};