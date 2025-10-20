import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import TodoModel from './models/todo.js';

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// ---------------------- ROUTES ----------------------

// Get all tasks
app.get('/get', (req, res) => {
  TodoModel.find()
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

// Add a new task
app.post('/add', (req, res) => {
  const { task } = req.body;
  TodoModel.create({ task })
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

// Delete a task
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  TodoModel.findByIdAndDelete(id)
    .then(() => res.json({ message: "Task deleted successfully" }))
    .catch(err => res.json(err));
});

// Edit (update) a task
app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  TodoModel.findByIdAndUpdate(id, { task }, { new: true })
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

// Mark as done or undone
app.put('/toggle/:id', (req, res) => {
  const { id } = req.params;
  TodoModel.findById(id)
    .then(todo => {
      todo.done = !todo.done;
      return todo.save();
    })
    .then(updated => res.json(updated))
    .catch(err => res.json(err));
});

// ----------------------------------------------------

app.listen(3001, () => {
  console.log('🚀 Server is running on port 3001');
});
