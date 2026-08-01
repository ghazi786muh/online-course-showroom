const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_SECURITY_CODE = process.env.ADMIN_SECURITY_CODE || 'COURSE2026';
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '923001234567';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// File path helpers
const usersFilePath = path.join(__dirname, 'data.json');
const coursesFilePath = path.join(__dirname, 'courses.json');

// Helper functions for safely reading/writing JSON files
const readJSONFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
};

const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err);
    return false;
  }
};

// API Route: User Signup
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    const users = readJSONFile(usersFilePath);

    // Duplicate check
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone
    };

    users.push(newUser);
    const saved = writeJSONFile(usersFilePath, users);

    if (!saved) {
      return res.status(500).json({ success: false, message: 'Failed to save user data.' });
    }

    return res.status(201).json({ success: true, message: 'Account created successfully! Redirecting...' });
  } catch (error) {
    console.error('Signup Server Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// API Route: User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const users = readJSONFile(usersFilePath);
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid Email or Password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Email or Password' });
    }

    return res.status(200).json({ success: true, message: 'Login successful!', redirectUrl: '/courses.html' });
  } catch (error) {
    console.error('Login Server Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// API Route: Get Config (Public WhatsApp Number)
app.get('/api/config', (req, res) => {
  res.json({ whatsappNumber: WHATSAPP_NUMBER });
});

// API Route: Get All Courses
app.get('/api/courses', (req, res) => {
  const courses = readJSONFile(coursesFilePath);
  res.json({ success: true, courses });
});

// API Route: Add Course (Admin Only)
app.post('/api/courses', (req, res) => {
  try {
    const { securityCode, title, description, price, duration, image, instructor } = req.body;

    if (securityCode !== ADMIN_SECURITY_CODE) {
      return res.status(403).json({ success: false, message: 'Invalid security code. Access denied.' });
    }

    if (!title || !description || !price || !duration || !image || !instructor) {
      return res.status(400).json({ success: false, message: 'All course details are required.' });
    }

    const courses = readJSONFile(coursesFilePath);

    const newCourse = {
      id: Date.now(),
      title,
      description,
      price: String(price),
      duration,
      image,
      instructor
    };

    courses.push(newCourse);
    const saved = writeJSONFile(coursesFilePath, courses);

    if (!saved) {
      return res.status(500).json({ success: false, message: 'Failed to write course data.' });
    }

    return res.status(201).json({ success: true, message: 'Course added successfully!', course: newCourse });
  } catch (error) {
    console.error('Add Course Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});