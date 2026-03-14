// Quiz App API - Registration & Login
const bcrypt = require('bcryptjs');

// Database connection (using global cache for serverless)
let mongoose;
try {
  mongoose = require('mongoose');
} catch (e) {
  // Mongoose not available, will handle gracefully
}

let cached = global.mongo;
if (!cached) {
  cached = global.mongo = { conn: null, promise: null, models: {} };
};

// User Schema (only if mongoose is available)
let User;
if (mongoose) {
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false }
  }, { timestamps: true });
  
  User = mongoose.models.User || mongoose.model('User', userSchema);
}

const connectDB = async () => {
  if (!mongoose || !process.env.MONGODB_URI) {
    return null;
  }
  
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log('✅ MongoDB Connected');
      return mongoose;
    }).catch(err => {
      console.error('❌ MongoDB Connection Error:', err);
      throw err;
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
  // CORS headers
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
        database: mongoose && mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        mongodb: process.env.MONGODB_URI ? 'configured' : 'not configured'
      });
      return;
    } catch (error) {
      res.status(500).json({ error: 'Health check failed' });
      return;
    }
  }

  // Register endpoint
  if (req.url === '/auth/register' || req.url === '/api/auth/register') {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    if (!mongoose || !process.env.MONGODB_URI) {
      return res.status(500).json({ message: 'Database not configured' });
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

  // Login endpoint
  if (req.url === '/auth/login' || req.url === '/api/auth/login') {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    if (!mongoose || !process.env.MONGODB_URI) {
      return res.status(500).json({ message: 'Database not configured' });
    }

    try {
      await connectDB();
      
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
      }

      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found with this email' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
      return;
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        message: 'Server error during login',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
      return;
    }
  }

  // Default response for other routes
  res.status(200).json({
    message: 'Quiz App API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      register: '/api/auth/register',
      login: '/api/auth/login'
    }
  });
};
