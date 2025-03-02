// src/App.tsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { createActor, canisterId } from "../../declarations/backend";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
  const [greeting, setGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setIsLoading(true);
    const backend = createActor(canisterId);
    backend.greet(name)
      .then((greeting: string) => {
        setGreeting(greeting);
      })
      .catch((error) => {
        console.error("Error fetching greeting:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<HomePage greeting={greeting} isLoading={isLoading} name={name} setName={setName} handleSubmit={handleSubmit} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Home page component to preserve your original greeting functionality
function HomePage({ greeting, isLoading, name, setName, handleSubmit }: {
  greeting: string;
  isLoading: boolean;
  name: string;
  setName: (name: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-4 flex items-center justify-center">
          <img src="/logo2.svg" alt="DFINITY logo" className="h-12" />
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome to Your dApp</h1>
          
          {/* Authentication Links */}
          <div className="mb-6 flex justify-center space-x-4">
            <Link 
              to="/login" 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Login
            </Link>
            <Link 
              to="/profile" 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Profile
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                What's your name?
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your name"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Get Greeting"}
            </button>
          </form>
          {greeting && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-lg text-center text-gray-800">{greeting}</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Powered by Internet Computer
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;