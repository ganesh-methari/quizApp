import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import QuizList from "./components/QuizList";
import QuizCreate from "./components/QuizCreate";
import QuizTake from "./components/QuizTake";
import QuizResult from "./components/QuizResult";

function App() {
  console.log("App rendered - Database mode enabled");

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/quizzes" element={<QuizList />} />
              <Route path="/create" element={<QuizCreate />} />
              <Route path="/quiz/:id" element={<QuizTake />} />
              <Route path="/result" element={<QuizResult />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
