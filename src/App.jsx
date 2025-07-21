import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Brand and Quiz Configuration ---
const APP_NAME = "BiasRisk";
const quizQuestions = [
  {
    question:
      "When leadership positions open up, who is more frequently encouraged to apply?",
    options: [
      { text: "Men are explicitly encouraged more often.", weight: 2 },
      { text: "It's roughly equal.", weight: 1 },
      { text: "Women are explicitly encouraged more often.", weight: 0 },
      { text: "No one is ever encouraged.", weight: 1 },
    ],
  },
  {
    question:
      "How are flexible work arrangements (like remote work or adjusted hours) perceived for men vs. women?",
    options: [
      {
        text: "More negatively for men; seen as a lack of commitment.",
        weight: 2,
      },
      { text: "Perceived equally for all genders.", weight: 0 },
      { text: "More negatively for women.", weight: 0 },
      { text: "The company doesn't offer flexible arrangements.", weight: 1 },
    ],
  },
  {
    question:
      "In meetings, whose contributions are more likely to be interrupted or dismissed?",
    options: [
      { text: "Men's contributions are interrupted more.", weight: 2 },
      { text: "Everyone is interrupted equally.", weight: 1 },
      { text: "Women's contributions are interrupted more.", weight: 0 },
      { text: "Interruptions are rare for anyone.", weight: 0 },
    ],
  },
  {
    question:
      "Think about high-visibility 'stretch' assignments. Who are they typically offered to?",
    options: [
      { text: "Primarily women.", weight: 0 },
      { text: "Primarily men.", weight: 2 },
      { text: "They are offered to everyone equally.", weight: 0 },
      { text: "Such assignments are not common here.", weight: 1 },
    ],
  },
  {
    question: "How is parental leave viewed for fathers?",
    options: [
      {
        text: "It's supported and encouraged, same as for mothers.",
        weight: 0,
      },
      {
        text: "It's available, but taking it is subtly discouraged for men.",
        weight: 2,
      },
      {
        text: "Parental leave policy is not favorable for fathers.",
        weight: 2,
      },
      {
        text: "The company has a poor parental leave policy for everyone.",
        weight: 1,
      },
    ],
  },
  {
    question:
      "When discussing salaries and promotions, is there a difference in negotiation expectations?",
    options: [
      { text: "Men who negotiate are seen as 'demanding'.", weight: 2 },
      { text: "Women who negotiate are seen as 'demanding'.", weight: 0 },
      { text: "Negotiation is viewed neutrally for all genders.", weight: 0 },
      { text: "Salaries are non-negotiable for everyone.", weight: 1 },
    ],
  },
  {
    question: "What does the informal 'after-hours' social culture look like?",
    options: [
      {
        text: "Inclusive events that appeal to a wide range of people.",
        weight: 0,
      },
      {
        text: "Activities that traditionally appeal more to one gender.",
        weight: 1,
      },
      { text: "There is no after-hours social culture.", weight: 0 },
      { text: "It's male-dominated and can feel exclusionary.", weight: 2 },
    ],
  },
  {
    question: "How is credit for successful team projects typically assigned?",
    options: [
      { text: "Credit is fairly distributed to all contributors.", weight: 0 },
      {
        text: "Often, credit gravitates towards female team members.",
        weight: 0,
      },
      {
        text: "Often, credit gravitates towards male team members.",
        weight: 2,
      },
      {
        text: "Credit is usually taken by team leads, regardless of gender.",
        weight: 1,
      },
    ],
  },
  {
    question:
      "Are there mentorship programs in place, and if so, are they equally accessible?",
    options: [
      { text: "Yes, and they are equally accessible to all.", weight: 0 },
      {
        text: "Yes, but mentors tend to be predominantly of one gender.",
        weight: 1,
      },
      { text: "Mentorship happens informally, favoring men.", weight: 2 },
      {
        text: "There are no formal or informal mentorship programs.",
        weight: 1,
      },
    ],
  },
  {
    question: "How are mistakes or failures handled for different genders?",
    options: [
      {
        text: "Failures are treated as learning experiences for everyone.",
        weight: 0,
      },
      { text: "Men's mistakes are scrutinized more heavily.", weight: 2 },
      { text: "Women's mistakes are scrutinized more heavily.", weight: 0 },
      { text: "Failure is heavily penalized for everyone.", weight: 1 },
    ],
  },
  {
    question:
      "What is the gender balance in non-leadership, entry-level roles?",
    options: [
      { text: "Roughly 50/50.", weight: 0 },
      { text: "Majority women.", weight: 0 },
      { text: "Majority men.", weight: 1 },
    ],
  },
  {
    question:
      "What is the gender balance in senior leadership roles (Director, VP, etc.)?",
    options: [
      { text: "Roughly 50/50.", weight: 0 },
      { text: "Majority women.", weight: 0 },
      { text: "Majority men.", weight: 2 },
    ],
  },
  {
    question:
      "When layoffs occur, which gender has been disproportionately affected?",
    options: [
      { text: "Men have been affected more.", weight: 2 },
      { text: "Women have been affected more.", weight: 0 },
      { text: "It has been proportional and fair.", weight: 0 },
      { text: "There have not been any recent layoffs.", weight: 0 },
    ],
  },
  {
    question:
      "Are 'office housework' tasks (e.g., planning parties, ordering lunch) distributed evenly?",
    options: [
      { text: "Yes, they are shared or voluntary.", weight: 0 },
      { text: "No, they disproportionately fall on women.", weight: 0 },
      { text: "No, they disproportionately fall on men.", weight: 2 },
      { text: "These tasks are handled by dedicated staff.", weight: 0 },
    ],
  },
  {
    question:
      "How does the company support employees' mental health and well-being?",
    options: [
      { text: "Excellent support for all genders.", weight: 0 },
      {
        text: "Support is offered, but there's a stigma for men seeking help.",
        weight: 2,
      },
      { text: "Support is generally lacking for everyone.", weight: 1 },
      {
        text: "Support is offered, but there's a stigma for women seeking help.",
        weight: 0,
      },
    ],
  },
];

const maxScore = quizQuestions.reduce(
  (total, q) => total + Math.max(...q.options.map((o) => o.weight)),
  0
);

// --- Main App Component ---

export default function App() {
  const [page, setPage] = useState("home");
  const [biasScore, setBiasScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Mouse move effect for background
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;
      document.body.style.backgroundPosition = `${x}% ${y}%`;
    };
    document.body.style.background = `radial-gradient(circle at 50% 50%, #1a202c, #111)`;
    document.body.style.backgroundSize = "200% 200%";
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.style.background = "";
    };
  }, []);

  const handleStartQuiz = () => {
    setBiasScore(0);
    setCurrentQuestionIndex(0);
    setPage("quiz");
  };

  const handleAnswerSelect = (weight) => {
    setBiasScore((prev) => prev + weight);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex((prev) => prev + 1), 500);
    } else {
      setTimeout(() => setPage("results"), 500);
    }
  };

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage onStartQuiz={handleStartQuiz} />;
      case "quiz":
        return (
          <QuizPage
            question={quizQuestions[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quizQuestions.length}
          />
        );
      case "about":
        return <AboutPage />;
      case "results":
        return <ResultsPage score={biasScore} onRestart={handleStartQuiz} />;
      default:
        return <HomePage onStartQuiz={handleStartQuiz} />;
    }
  };

  return (
    <div className="min-h-screen text-white font-sans flex flex-col items-center justify-center p-4 overflow-hidden">
      <Navbar onNavigate={setPage} currentPage={page} />
      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

// --- Page Components ---

const Navbar = ({ onNavigate, currentPage }) => {
  const navItems = ["home", "about"];
  return (
    <nav className="absolute top-0 left-0 right-0 p-6 z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          {APP_NAME}
        </span>
        <div className="flex items-center space-x-6 bg-gray-800/50 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => onNavigate(item)}
              className={`capitalize text-lg font-medium transition-colors duration-300 ${
                currentPage === item
                  ? "text-cyan-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

const HomePage = ({ onStartQuiz }) => (
  <div className="text-center flex flex-col items-center justify-center min-h-[80vh]">
    <motion.h1
      className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: "spring" }}
    >
      The {APP_NAME} Calculator
    </motion.h1>
    <motion.p
      className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
    >
      Anonymously assess potential workplace bias. Answer 15 questions to get a
      confidential risk assessment.
    </motion.p>
    <motion.button
      onClick={onStartQuiz}
      className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-full text-xl shadow-lg shadow-cyan-500/30 transform transition-all duration-300"
      whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(0, 255, 255, 0.5)" }}
      whileTap={{ scale: 0.95 }}
    >
      Start Assessment
    </motion.button>
  </div>
);

const AboutPage = () => (
  <div className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 max-w-3xl mx-auto min-h-[80vh] flex flex-col justify-center">
    <h2 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">
      About {APP_NAME}
    </h2>
    <p className="text-lg text-gray-300 mb-4">
      The {APP_NAME} calculator is a tool designed to provide a snapshot of
      potential gender bias within a workplace. Bias can be subtle and systemic,
      impacting everyone.
    </p>
    <p className="text-lg text-gray-300 mb-6">
      By answering a series of situational questions, this tool calculates a
      risk score that helps quantify these often-unseen dynamics. The goal is
      not to assign blame, but to foster awareness and encourage conversations
      that lead to fairer, more equitable environments for all employees.
    </p>
    <div className="text-center text-gray-400">
      <p>
        This tool was built for the CVHS hackathon, this is not legal advice.
      </p>
      <p>Built with React, Tailwind CSS, and Framer Motion.</p>
    </div>
  </div>
);

const QuizPage = ({
  question,
  onAnswerSelect,
  questionNumber,
  totalQuestions,
}) => {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(false);
  }, [question]);

  const handleSelect = (weight) => {
    setSelected(true);
    onAnswerSelect(weight);
  };

  return (
    <div className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 w-full max-w-3xl mx-auto min-h-[80vh] flex flex-col">
      <div className="mb-6">
        <p className="text-cyan-400 font-semibold text-lg">
          Question {questionNumber} of {totalQuestions}
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
          <motion.div
            className="bg-cyan-500 h-2.5 rounded-full"
            initial={{
              width: `${((questionNumber - 1) / totalQuestions) * 100}%`,
            }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.question}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="flex-grow flex flex-col"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8 flex-grow">
            {question.question}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleSelect(option.weight)}
                disabled={selected}
                className="p-4 rounded-lg text-lg text-left transition-all duration-300 border-2 border-gray-600 bg-gray-700/50 enabled:hover:bg-gray-600/50 enabled:hover:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!selected ? { scale: 1.03 } : {}}
                whileTap={!selected ? { scale: 0.98 } : {}}
              >
                {option.text}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ResultsPage = ({ score, onRestart }) => {
  const percentage = Math.round((score / maxScore) * 100);

  let resultData = {};
  if (percentage <= 33) {
    resultData = {
      title: "Low Risk of Bias",
      description:
        "Based on your answers, the environment appears to have strong indicators of fairness and equity. Policies and culture seem to support all genders effectively.",
      color: "#22c55e", // green-500
      shadow: "rgba(34, 197, 94, 0.4)",
      gradient: ["#22d3ee", "#22c55e"],
    };
  } else if (percentage <= 66) {
    resultData = {
      title: "Moderate Risk of Bias",
      description:
        "Your responses suggest there may be some underlying issues or inconsistencies in the workplace culture that could lead to biased outcomes. It may be beneficial to pay closer attention to these dynamics.",
      color: "#f97316", // orange-500
      shadow: "rgba(249, 115, 22, 0.4)",
      gradient: ["#f59e0b", "#f97316"],
    };
  } else {
    resultData = {
      title: "High Risk of Bias",
      description:
        "The patterns indicated by your answers point to a significant risk of systemic bias. It may be creating substantial disadvantages and an unfair environment.",
      color: "#ef4444", // red-500
      shadow: "rgba(239, 68, 68, 0.4)",
      gradient: ["#f97316", "#ef4444"],
    };
  }

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 w-full max-w-3xl mx-auto min-h-[80vh] flex flex-col items-center text-center">
      <h2
        className="text-4xl font-bold mb-4"
        style={{ color: resultData.color }}
      >
        {resultData.title}
      </h2>

      <div className="relative w-52 h-52 my-6">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="#374151"
            strokeWidth="15"
          />
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke={`url(#result-gradient)`}
            strokeWidth="15"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
            transform="rotate(-90 100 100)"
          />
          <defs>
            <linearGradient
              id="result-gradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={resultData.gradient[0]} />
              <stop offset="100%" stopColor={resultData.gradient[1]} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-5xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {percentage}
            <span className="text-3xl opacity-50">%</span>
          </motion.span>
        </div>
      </div>

      <p className="text-lg text-gray-300 max-w-xl mb-10">
        {resultData.description}
      </p>

      <motion.button
        onClick={onRestart}
        className="px-10 py-4 text-white font-bold rounded-full text-xl transform transition-all duration-300"
        style={{
          background: `linear-gradient(to right, ${resultData.gradient[0]}, ${resultData.gradient[1]})`,
          boxShadow: `0 0 20px ${resultData.shadow}`,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Assess Again
      </motion.button>
    </div>
  );
};
