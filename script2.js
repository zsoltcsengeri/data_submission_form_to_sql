const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 3000;

const DATABASE_CONFIG = {
  host: 'localhost',
  user: 'zsolt',
  password: 'BudaPest184576%',
  database: 'form_submission_data'
};

let connection;

// Connect to the database
mysql.createConnection(DATABASE_CONFIG)
  .then((conn) => {
    connection = conn;
    console.log(`Connected to the database as id ${connection.threadId}`);

    // Start listening for client requests
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Error connecting to the database: ${error.stack}`);
    process.exit(1);
  });

  app.post('/submit-form', async (req, res) => {
    // Validate the JSON request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).send({ error: 'Invalid JSON' });
    }
  
    const { name, email } = req.body;
  
    try {
      // Insert the data into the database
      const [results] = await connection.query('INSERT INTO users SET ?', { name, email });
      res.status(200).send({ message: 'Data inserted successfully', id: results.insertId });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  