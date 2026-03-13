import { LuZap, LuCircleCheck, LuUsers } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  console.log("Home page loaded");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleCreateQuiz = () => {
    if (isAuthenticated()) {
      navigate("/create");
    } else {
      navigate("/login");
    }
  };

  const features = [
    {
      title: "Instant Feedback",
      description: "Get immediate results and see correct answers as soon as you finish a quiz.",
      icon: <LuZap className="text-red-500 w-6 h-6" />,
      bgColor: "bg-red-50",
    },
    {
      title: "Easy Creation",
      description: "Our intuitive builder lets you create complex quizzes in minutes, not hours.",
      icon: <LuCircleCheck className="text-purple-600 w-6 h-6" />,
      bgColor: "bg-purple-50",
    },
    {
      title: "Community Driven",
      description: "Explore thousands of quizzes created by users from all around the world.",
      icon: <LuUsers className="text-yellow-600 w-6 h-6" />,
      bgColor: "bg-yellow-50",
    },
  ];

  const stats = [
    { label: "QUIZZES CREATED", value: "10k+" },
    { label: "ACTIVE USERS", value: "50k+" },
    { label: "QUESTIONS ANSWERED", value: "1M+" },
    { label: "SUCCESS RATE", value: "94%" },
  ];

  return (
    <main>
      {/* Header Section */}
      <section className="flex flex-col items-center justify-center py-16">
        <header className="text-center space-y-4">
          <h1 className="text-8xl font-extrabold text-gray-900">
            MASTER ANY
          </h1>
          <h1 className="text-8xl font-extrabold text-indigo-600">
        TOPIC NOW
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl p-5">
            Create, share, and take quizzes on any subject. Whether you're a student, teacher, or lifelong learner, QuizMaster helps you test your knowledge.
          </p>
        </header>
      </section>

      {/* Buttons Section */}
      <section className="flex justify-center gap-4 pb-16">
        <button
          onClick={handleCreateQuiz}
          className="w-full sm:w-auto bg-yellow-400 text-slate-900 px-8 py-4 rounded-2xl text-lg font-black uppercase hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex items-center justify-center space-x-2"
        >
          Create Quiz
        </button>
        <a href="/quizzes" className="w-full sm:w-auto bg-white text-slate-900 border-4 border-black px-8 py-4 rounded-2xl text-lg font-black uppercase hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[8px_8px_0px_0px_rgba(125,60,255,1)] flex items-center justify-center space-x-2">
          Browse Quizzes
        </a>
      </section>

      {/* Features */}
      <section className="max-w-6xl m-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md flex flex-col items-start"
            >
              <div className={`${feature.bgColor} p-3 rounded-2xl mb-6`}>
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl m-10 mt-20">
        <div className="bg-[#0f172a] rounded-[3rem] py-20 px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#fbbf24] mb-2 tracking-tight">
                  {stat.value}
                </h2>
                <p className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
