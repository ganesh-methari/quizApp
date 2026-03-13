import { useNavigate, useLocation } from "react-router-dom";
import { LuCheck, LuX, LuHouse, LuRefreshCw } from "react-icons/lu";

function QuizResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const { score, total, quiz, selectedAnswers } = location.state || {
    score: 0,
    total: 0,
    quiz: null,
    selectedAnswers: {}
  };

  console.log("Quiz result - Score:", score, "Total:", total);

  // if no quiz data
  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">No quiz results found</h2>
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

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  // get colors based on score
  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = () => {
    if (percentage >= 80) return "bg-green-50";
    if (percentage >= 60) return "bg-yellow-50";
    return "bg-red-50";
  };

  // get message based on performance
  const getMessage = () => {
    if (percentage === 100) return "Perfect Score! 🎉";
    if (percentage >= 80) return "Excellent Work! 🌟";
    if (percentage >= 60) return "Good Job! 👍";
    if (percentage >= 40) return "Keep Practicing! 📚";
    return "Don't Give Up! 💪";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        {/* result header */}
        <div className={`${getScoreBgColor()} border-2 border-indigo-100 rounded-3xl p-10 shadow-xl text-center mb-8`}>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Quiz Complete!</h1>
          <p className="text-xl text-gray-600 mb-6">{quiz.title}</p>

          <div className="mb-6">
            <div className={`text-8xl font-black ${getScoreColor()} mb-2`}>
              {percentage}%
            </div>
            <p className="text-2xl font-bold text-slate-700 mb-1">{getMessage()}</p>
            <p className="text-gray-600">
              You answered {score} out of {total} questions correctly
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 flex items-center justify-center gap-2"
            >
              <LuHouse className="w-5 h-5" />
              Home
            </button>
            <button
              onClick={() => navigate("/quizzes")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
            >
              Browse More Quizzes
            </button>
          </div>
        </div>

        {/* question review */}
        <div className="bg-white border-2 border-indigo-100 rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Review Your Answers</h2>

          <div className="space-y-6">
            {quiz.questions.map((question, questionIndex) => {
              const userAnswer = selectedAnswers[questionIndex];
              const correctAnswer = question.correctAnswer;
              const isCorrect = userAnswer === correctAnswer;
              const wasAnswered = userAnswer !== undefined;

              return (
                <div
                  key={questionIndex}
                  className={`border-2 rounded-2xl p-6 ${
                    isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  {/* question header */}
                  <div className="flex items-start gap-3 mb-4">
                    {wasAnswered ? (
                      isCorrect ? (
                        <div className="bg-green-500 text-white p-2 rounded-full flex-shrink-0">
                          <LuCheck className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="bg-red-500 text-white p-2 rounded-full flex-shrink-0">
                          <LuX className="w-5 h-5" />
                        </div>
                      )
                    ) : (
                      <div className="bg-slate-400 text-white p-2 rounded-full flex-shrink-0">
                        <LuX className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">
                        Question {questionIndex + 1}
                      </h3>
                      <p className="text-slate-700">{question.question}</p>
                    </div>
                  </div>

                  {/* options */}
                  <div className="space-y-2 pl-12">
                    {question.options.map((option, optionIndex) => {
                      const isUserAnswer = userAnswer === optionIndex;
                      const isCorrectOption = correctAnswer === optionIndex;

                      let optionClass = "bg-white border-slate-200 text-slate-700";
                      let statusIcon = null;

                      if (isCorrectOption) {
                        optionClass = "bg-green-100 border-green-400 text-green-800 font-bold";
                        statusIcon = <LuCheck className="w-5 h-5 text-green-600" />;
                      } else if (isUserAnswer && !isCorrect) {
                        optionClass = "bg-red-100 border-red-400 text-red-800 font-bold";
                        statusIcon = <LuX className="w-5 h-5 text-red-600" />;
                      }

                      return (
                        <div
                          key={optionIndex}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${optionClass}`}
                        >
                          <span className="flex-shrink-0 w-6">{statusIcon}</span>
                          <span className="flex-1">{option}</span>
                          {isCorrectOption && (
                            <span className="text-xs font-bold bg-green-600 text-white px-2 py-1 rounded-full">
                              Correct Answer
                            </span>
                          )}
                          {isUserAnswer && !isCorrect && (
                            <span className="text-xs font-bold bg-red-600 text-white px-2 py-1 rounded-full">
                              Your Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* retake button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate(`/quiz/${quiz.id}`, { state: { quiz } })}
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 inline-flex items-center gap-2"
            >
              <LuRefreshCw className="w-5 h-5" />
              Retake This Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizResult;
