import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LuCheck, LuCircle } from "react-icons/lu";

function QuizTake() {
  const navigate = useNavigate();
  const location = useLocation();
  const quiz = location.state?.quiz;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  // if no quiz found
  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Quiz not found</h2>
          <button
            onClick={() => navigate("/quizzes")}
            className="text-indigo-600 font-bold hover:text-indigo-700"
          >
            Browse Quizzes
          </button>
        </div>
      </div>
    );
  }

  const questions = quiz.questions || [];

  // handle option selection
  const handleSelectOption = (questionIndex, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  // calculate final score
  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  // next question
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  // previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // submit and show result
  const handleSubmit = () => {
    const score = calculateScore();
    console.log("Final score:", score);
    navigate("/result", {
      state: {
        score,
        total: questions.length,
        quiz,
        selectedAnswers
      }
    });
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // show results screen
  if (showResult) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white border-2 border-indigo-100 rounded-3xl p-10 shadow-xl text-center">
            <h1 className="text-4xl font-black text-slate-900 mb-4">Quiz Complete!</h1>
            <p className="text-xl text-gray-600 mb-8">{quiz.title}</p>

            <div className="mb-8">
              <div className="text-7xl font-black text-indigo-600 mb-2">
                {Math.round(percentage)}%
              </div>
              <p className="text-gray-500 text-lg">
                You scored {score} out of {questions.length}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setShowResult(false);
                  setCurrentQuestion(0);
                  setSelectedAnswers({});
                }}
                className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => navigate("/quizzes")}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
              >
                Browse More Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // main quiz screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10">
      <div className="max-w-3xl mx-auto px-6">
        {/* header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-gray-600">{quiz.description}</p>
          )}
        </div>

        {/* progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-700">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-bold text-indigo-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* question card */}
        <div className="bg-white border-2 border-indigo-100 rounded-3xl p-8 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            {currentQ.question}
          </h2>

          {/* options */}
          <div className="space-y-4">
            {currentQ.options.map((option, optionIndex) => {
              const isSelected = selectedAnswers[currentQuestion] === optionIndex;
              return (
                <button
                  key={optionIndex}
                  onClick={() => handleSelectOption(currentQuestion, optionIndex)}
                  className={`w-full text-left p-5 rounded-2xl border-2 flex items-center gap-4 ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  {isSelected ? (
                    <LuCheck className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                  ) : (
                    <LuCircle className="w-6 h-6 text-slate-400 flex-shrink-0" />
                  )}
                  <span className="text-lg font-medium text-slate-800">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* navigation buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 rounded-xl font-bold ${
              currentQuestion === 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className={`px-8 py-3 rounded-xl font-bold ${
                selectedAnswers[currentQuestion] === undefined
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
              }`}
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className={`px-8 py-3 rounded-xl font-bold ${
                selectedAnswers[currentQuestion] === undefined
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Next
            </button>
          )}
        </div>

        {/* question navigator */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {questions.map((_, index) => {
            const isAnswered = selectedAnswers[index] !== undefined;
            const isCurrent = index === currentQuestion;
            return (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-xl font-bold text-sm ${
                  isCurrent
                    ? "bg-indigo-600 text-white"
                    : isAnswered
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default QuizTake;
