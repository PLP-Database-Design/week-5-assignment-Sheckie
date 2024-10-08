const express = require('express');
const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables from .env file
const app = express();
const PORT = 3000;

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Middleware to parse JSON requests
app.use(express.json());

// 1. Retrieve all patients
app.get('/api/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching patients:', err);
      return res.status(500).send('Error fetching patients');
    }
    res.json(results);
  });
});

// 2. Retrieve all providers
app.get('/api/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching providers:', err);
      return res.status(500).send('Error fetching providers');
    }
    res.json(results);
  });
});

// 3. Filter patients by First Name
app.get('/api/patients/filter/:firstName', (req, res) => {
  const firstName = req.params.firstName;
  const query = 'SELECT * FROM patients WHERE first_name = ?';
  db.query(query, [firstName], (err, results) => {
    if (err) {
      console.error('Error filtering patients:', err);
      return res.status(500).send('Error filtering patients');
    }
    res.json(results);
  });
});

// 4. Retrieve all providers by their specialty
app.get('/api/providers/specialty/:specialty', (req, res) => {
  const specialty = req.params.specialty;
  const query = 'SELECT * FROM providers WHERE provider_specialty = ?';
  db.query(query, [specialty], (err, results) => {
    if (err) {
      console.error('Error filtering providers:', err);
      return res.status(500).send('Error filtering providers');
    }
    res.json(results);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
