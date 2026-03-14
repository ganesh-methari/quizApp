// Quiz App API - Registration Endpoint
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Database connection
let cached = global.mongo;
if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log('✅ MongoDB Connected');
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
};

// Main handler
module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check
  if (req.url === '/health' || req.url === '/api/health') {
    try {
      await connectDB();
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
      });
      return;
    } catch (error) {
      res.status(500).json({ error: 'Database connection failed' });
      return;
    }
  }

  // Register endpoint
  if (req.url === '/auth/register' || req.url === '/api/auth/register') {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
      await connectDB();
      
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all fields' });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }

      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword
      });

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
      return;
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        message: 'Server error during registration',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
      return;
    }
  }

  // 404 for unknown routes
  res.status(404).json({ error: 'API endpoint not found' });
};
