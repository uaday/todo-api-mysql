const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

// need to add those field, can find in the RDS
const db = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: '',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

const app = express();
app.use(bodyParser.json());

// Get all tasks
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Create a new task
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  db.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, result) => {
    if (err) throw err;
    res.status(201).json({ id: result.insertId, title });
  });
});

// Update a task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  db.query('UPDATE tasks SET completed = ? WHERE id = ?', [completed, id], (err, result) => {
    if (err) throw err;
    res.json({ id, completed });
  });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.sendStatus(204);
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
