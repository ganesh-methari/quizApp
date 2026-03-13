import React from 'react';
import { LuSearch, LuSearchX, LuClock, LuFileText } from "react-icons/lu";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

function QuizList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleCreateQuiz = () => {
    if (isAuthenticated()) {
      navigate("/create");
    } else {
      navigate("/login");
    }
  };

  // load quizzes from database
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        console.log("Loading quizzes from database...");
        const response = await axios.get("http://localhost:5000/api/quizzes/all");
        console.log("Quizzes loaded:", response.data.quizzes.length);
        setQuizzes(response.data.quizzes);
        setLoading(false);
      } catch (error) {
        console.log("Error loading quizzes:", error);
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  // filter quizzes based on search
  const filteredQuizzes = quizzes.filter(quiz => {
    const searchLower = searchTerm.toLowerCase();
    return (
      quiz.title.toLowerCase().includes(searchLower) ||
      quiz.description.toLowerCase().includes(searchLower)
    );
  });

  // format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  console.log("Total quizzes:", quizzes.length);
  console.log("Filtered:", filteredQuizzes.length);

  return (
    <main className="w-full max-w-7xl mx-auto px-6 py-10">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* header text */}
        <header className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] uppercase tracking-tight">
            Explore Quizzes
          </h1>
          <p className="text-gray-500 text-lg font-medium">
            Find something new to learn today
          </p>
        </header>

        {/* search bar */}
        <div className="w-full md:w-96 group">
          <div className="relative flex items-center bg-white border-2 border-black rounded-full px-5 py-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <LuSearch className="text-gray-400 mr-3 w-5 h-5" />
            <input
              type="search"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700"
            />
          </div>
        </div>
      </section>

      {/* quiz list */}
      <section className="flex justify-center items-center w-full px-4 py-20">
        {loading ? (
          <div className="text-center">
            <p className="text-xl text-gray-500">Loading quizzes...</p>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="w-full max-w-4xl border-2 border-dashed border-indigo-200 rounded-4xl py-16 px-6 flex flex-col items-center text-center">
            <div className="bg-slate-200/40 p-4 rounded-2xl mb-6">
              <LuSearchX className="text-slate-400 w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {quizzes.length === 0 ? "No quizzes yet" : "No quizzes found"}
            </h3>
            <p className="text-slate-500 mb-8">
              {quizzes.length === 0
                ? "Be the first to create a quiz!"
                : "Try a different search term"}
            </p>

            <button
              onClick={handleCreateQuiz}
              className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-2"
            >
              Create a Quiz <span className="text-xl">→</span>
            </button>
          </div>
        ) : (
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Link
                key={quiz._id}
                to={`/quiz/${quiz._id}`}
                state={{ quiz }}
                className="bg-white border-2 border-indigo-100 rounded-4xl p-6 shadow-md hover:shadow-xl hover:border-indigo-300 cursor-pointer"
              >
                {/* quiz header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-indigo-600 line-clamp-2">
                    {quiz.title}
                  </h3>
                </div>

                {/* description */}
                {quiz.description && (
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {quiz.description}
                  </p>
                )}

                {/* quiz meta */}
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <LuFileText className="w-4 h-4" />
                    <span>{quiz.questions.length} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LuClock className="w-4 h-4" />
                    <span>{formatDate(quiz.createdAt)}</span>
                  </div>
                </div>

                {/* creator info */}
                <div className="text-xs text-gray-400 mb-4">
                  Created by: {quiz.creatorName}
                </div>

                {/* action button */}
                <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-bold">
                  Start Quiz →
                </button>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default QuizList;
