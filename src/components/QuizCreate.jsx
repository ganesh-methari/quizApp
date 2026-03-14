import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuPlus, LuTrash2, LuCheck } from "react-icons/lu";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config/api";

function QuizCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // form state
  const [quizDetails, setQuizDetails] = useState({
    title: "",
    description: ""
  });

  // questions array with default 1 question
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    }
  ]);

  // handle title and description change
  const handleQuizDetailChange = (field, value) => {
    setQuizDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // add new question
  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: Date.now(),
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0
      }
    ]);
  };

  // delete question
  const removeQuestion = (questionId) => {
    if (questions.length > 1) {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    } else {
      alert("At least one question required!");
    }
  };

  // update question text
  const handleQuestionChange = (questionId, value) => {
    setQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, question: value } : q
    ));
  };

  // update option text
  const handleOptionChange = (questionId, optionIndex, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  // set correct answer
  const setCorrectAnswer = (questionId, optionIndex) => {
    setQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, correctAnswer: optionIndex } : q
    ));
  };

  // save quiz to database
  const handleSaveAndPublish = async () => {
    // validation
    if (!quizDetails.title.trim()) {
      alert("Please enter quiz title!");
      return;
    }

    if (!quizDetails.description.trim()) {
      alert("Please enter description!");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        alert(`Please fill question ${i + 1}`);
        return;
      }

      for (let j = 0; j < 4; j++) {
        if (!questions[i].options[j].trim()) {
          alert(`Please fill all options in question ${i + 1}`);
          return;
        }
      }
    }

    // create quiz object
    const newQuiz = {
      title: quizDetails.title,
      description: quizDetails.description,
      createdBy: user?.email,
      creatorName: user?.name,
      questions: questions
    };

    console.log("Saving quiz to database:", newQuiz);

    try {
      // save to database
      const response = await axios.post(`${API_BASE_URL}/quizzes/create`, newQuiz);

      console.log("Quiz saved successfully!");
      alert("Quiz published successfully!");

      // reset form
      setQuizDetails({ title: "", description: "" });
      setQuestions([{
        id: 1,
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0
      }]);

      navigate("/quizzes");

    } catch (error) {
      console.log("Error saving quiz:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to save quiz";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        {/* header */}
        <header className="text-center mb-10">
          <h1 className="text-5xl font-black text-slate-900 mb-3">
            Create New Quiz
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Design your quiz and share it with the world
          </p>
        </header>

        {/* quiz details section */}
        <section className="bg-white border-2 border-indigo-100 rounded-3xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Quiz Details
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">
                Title
              </label>
              <input
                type="text"
                value={quizDetails.title}
                onChange={(e) => handleQuizDetailChange("title", e.target.value)}
                placeholder="e.g., World Geography Masterclass"
                className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none text-lg font-bold"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">
                Description
              </label>
              <textarea
                value={quizDetails.description}
                onChange={(e) => handleQuizDetailChange("description", e.target.value)}
                placeholder="What is this quiz about?"
                rows="3"
                className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none text-lg font-bold resize-none"
              />
            </div>
          </div>
        </section>

        {/* questions section */}
        <section className="bg-white border-2 border-indigo-100 rounded-3xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Questions ({questions.length})
          </h2>

          <div className="space-y-8">
            {questions.map((q, questionIndex) => (
              <div
                key={q.id}
                className="border-2 border-dashed border-slate-200 rounded-3xl p-6"
              >
                {/* question header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    Question {questionIndex + 1}
                  </h3>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(q.id)}
                      className="text-red-500 hover:text-red-700 p-2 flex items-center gap-2"
                    >
                      <LuTrash2 className="w-5 h-5" />
                      Remove
                    </button>
                  )}
                </div>

                {/* question input */}
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                  placeholder="Enter your question here..."
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none text-lg mb-5"
                />

                {/* options */}
                <div className="space-y-3">
                  {q.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-3">
                      <button
                        onClick={() => setCorrectAnswer(q.id, optionIndex)}
                        className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          q.correctAnswer === optionIndex
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-slate-300 hover:border-green-400 text-slate-400"
                        }`}
                      >
                        {q.correctAnswer === optionIndex && <LuCheck className="w-5 h-5" />}
                      </button>

                      <span className="text-sm font-bold text-slate-600 w-24">
                        Option {optionIndex + 1}
                      </span>

                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(q.id, optionIndex, e.target.value)}
                        placeholder={`Enter option ${optionIndex + 1}`}
                        className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                      />

                      {q.correctAnswer === optionIndex && (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          Correct
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-3 pl-11">
                  Click the circle to mark correct answer
                </p>
              </div>
            ))}
          </div>

          {/* add question button */}
          <button
            onClick={addQuestion}
            className="mt-8 w-full border-2 border-dashed border-indigo-300 text-indigo-600 py-4 rounded-2xl font-bold hover:bg-indigo-50 flex items-center justify-center gap-2"
          >
            <LuPlus className="w-5 h-5" />
            Add Another Question
          </button>
        </section>

        {/* save button */}
        <button
          onClick={handleSaveAndPublish}
          className="w-full bg-yellow-500 text-slate-900 py-5 rounded-4xl font-black text-2xl uppercase tracking-widest hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black"
        >
          Save and Publish Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizCreate;
