/**
 * Quiz Routes
 * Handles quiz creation, retrieval, and submission
 */

const express = require('express');
const Quiz = require('../models/Quiz');

const router = express.Router();

// @route   POST /api/quiz/create
// @desc    Create a new quiz
// @access  Private (should add auth middleware)
router.post('/create', async (req, res) => {
  try {
    const { title, description, questions, createdBy } = req.body;

    // Validation
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({
        message: 'Please provide title and at least one question'
      });
    }

    // Create quiz
    const quiz = new Quiz({
      title: title.trim(),
      description: description?.trim() || '',
      questions,
      createdBy: createdBy || null
    });

    await quiz.save();

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz
    });

  } catch (error) {
    console.error('Quiz creation error:', error);
    res.status(500).json({
      message: 'Server error during quiz creation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/quiz/all
// @desc    Get all quizzes
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const quizzes = await Quiz.find({})
      .sort({ createdAt: -1 });

    res.json({
      count: quizzes.length,
      quizzes
    });

  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({
      message: 'Server error while fetching quizzes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/quiz/:id
// @desc    Get a single quiz by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found'
      });
    }

    res.json({ quiz });

  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      message: 'Server error while fetching quiz',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/quiz/:id
// @desc    Update a quiz
// @access  Private (should add auth middleware)
router.put('/:id', async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      {
        title: title?.trim(),
        description: description?.trim(),
        questions,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found'
      });
    }

    res.json({
      message: 'Quiz updated successfully',
      quiz
    });

  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({
      message: 'Server error during quiz update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/quiz/:id
// @desc    Delete a quiz
// @access  Private (should add auth middleware)
router.delete('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found'
      });
    }

    res.json({
      message: 'Quiz deleted successfully'
    });

  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      message: 'Server error during quiz deletion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/quiz/:id/submit
// @desc    Submit quiz answers
// @access  Public
router.post('/:id/submit', async (req, res) => {
  try {
    const { answers } = req.body;

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found'
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const results = quiz.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;

      if (isCorrect) correctAnswers++;

      return {
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect
      };
    });

    const score = {
      correct: correctAnswers,
      total: quiz.questions.length,
      percentage: (correctAnswers / quiz.questions.length) * 100
    };

    res.json({
      message: 'Quiz submitted successfully',
      score,
      results
    });

  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      message: 'Server error during quiz submission',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
