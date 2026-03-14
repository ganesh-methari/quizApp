  import React from "react";
import { LuUser, LuMail, LuLock } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("signup form submitted");

    const result = await register(username, email, password);

    if (result.success) {
      alert("Registration successful! Please login to continue.");
      navigate('/login');
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-sm border border-gray-100 p-10 md:p-12">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Create Account
          </h1>
          <p className="text-slate-400 font-medium">
            Sign up to get started
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <LuUser className="text-slate-400 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
            </div>

            <input
              type="text"
              placeholder="Username"
              className="w-full pl-12 pr-5 py-4 bg-white border border-gray-200 rounded-full outline-none
              focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all
              text-slate-700 placeholder:text-slate-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <LuMail className="text-slate-400 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
            </div>

            <input
              type="email"
              placeholder="Email id"
              className="w-full pl-12 pr-5 py-4 bg-white border border-gray-200 rounded-full outline-none
              focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all
              text-slate-700 placeholder:text-slate-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <LuLock className="text-slate-400 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
            </div>

            <input
              type="password"
              placeholder="Password"
              className="w-full pl-12 pr-5 py-4 bg-white border border-gray-200 rounded-full outline-none
              focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all
              text-slate-700 placeholder:text-slate-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-full
            transition-all transform active:scale-[0.98] mt-4
          shadow-[10px_0px_0px_0px_rgba(0,0,0,1)]
             hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
          >
            Create Account
          </button>

        </form>

        <div className="text-center mt-8 text-slate-500 font-medium">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-500 font-bold hover:underline">
            Login
          </a>
        </div>

      </div>

    </div>
  );
};

export default Signup;
