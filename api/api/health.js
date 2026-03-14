// Health check endpoint
const mongoose = require('mongoose');

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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: mongoose && mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      mongodb: process.env.MONGODB_URI ? 'configured' : 'not configured'
    });
  } catch (error) {
    res.status(500).json({ error: 'Health check failed' });
  }
};
