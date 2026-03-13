/**
 * Validation Utility
 * Common validation functions for input data
 */

const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return passwordRegex.test(password);
};

const validateUsername = (username) => {
  // Alphanumeric, 3-20 characters
  const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
  return usernameRegex.test(username);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

const validateQuizData = (quizData) => {
  const errors = [];

  if (!quizData.title || quizData.title.length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (!quizData.questions || quizData.questions.length < 1) {
    errors.push('At least one question is required');
  }

  quizData.questions?.forEach((question, index) => {
    if (!question.question || question.question.trim().length === 0) {
      errors.push(`Question ${index + 1} cannot be empty`);
    }

    if (!question.options || question.options.length < 2) {
      errors.push(`Question ${index + 1} must have at least 2 options`);
    }

    if (typeof question.correctAnswer !== 'number') {
      errors.push(`Question ${index + 1} must have a valid correct answer index`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  sanitizeInput,
  validateQuizData
};
