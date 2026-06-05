const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/landmark';

const connectDB = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');
};

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  course: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', StudentSchema);

app.post('/api/signup', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    console.log(`New signup: ${student.name} - ${student.email} - ${student.course}`);
    res.status(201).json(student);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/students', async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });
  res.json(students);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(5000, () => console.log('Server running on port 5000'));
  });
}

module.exports = { app, connectDB, Student };
