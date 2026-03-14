// Quiz endpoints
const mongoose = require('mongoose');

let cached = global.mongo;
if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [{
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);

const connectDB = async () => {
  if (!cached.conn) {
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();

    // GET all quizzes
    if (req.method === 'GET') {
      const quizzes = await Quiz.find().sort({ createdAt: -1 });
      res.status(200).json({ quizzes });
      return;
    }

    // POST create quiz
    if (req.method === 'POST') {
      const { title, description, questions } = req.body;

      if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ message: 'Title and questions are required' });
      }

      const quiz = await Quiz.create({
        title,
        description,
        questions
      });

      res.status(201).json({
        message: 'Quiz created successfully',
        quiz
      });
      return;
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
