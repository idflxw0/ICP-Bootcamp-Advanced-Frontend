// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

interface HomePageProps {
  greeting: string;
  isLoading: boolean;
  name: string;
  setName: (name: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
  greeting, 
  isLoading, 
  name, 
  setName, 
  handleSubmit 
}) => {
  const { isAuthenticated, principalText } = useAuth();
  const [showGreeting, setShowGreeting] = useState(false);

  // Animation effect for greeting
  useEffect(() => {
    if (greeting) {
      setShowGreeting(false);
      const timer = setTimeout(() => {
        setShowGreeting(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [greeting]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700 flex flex-col items-center pt-24 pb-12 px-4">
      {/* Hero Section */}
      <div className="w-full max-w-4xl text-center mb-12 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
          Welcome to Internet Computer dApp
        </h1>
        <p className="text-lg md:text-xl opacity-80 max-w-3xl mx-auto">
          Experience the power of decentralized applications on the Internet Computer.
          {isAuthenticated ? " You're logged in and ready to go!" : " Login to access your personalized experience."}
        </p>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transform transition duration-500 hover:shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo2.svg" alt="DFINITY logo" className="h-10 w-10" />
            <h2 className="ml-3 text-xl font-bold text-white">IC Greeter</h2>
          </div>
          {isAuthenticated && (
            <div className="bg-white/20 rounded-full px-3 py-1 text-xs text-white">
              Authenticated
            </div>
          )}
        </div>

        <div className="p-8">
          {isAuthenticated && (
            <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <p className="text-sm text-indigo-700">
                <span className="font-semibold">Logged in as:</span> 
                <span className="ml-1 font-mono text-xs break-all">
                  {principalText?.substring(0, 10)}...
                </span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                What should we call you?
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Enter your name"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                "Get Personal Greeting"
              )}
            </button>
          </form>

          {/* Animated Greeting Card */}
          {greeting && (
            <div 
              className={`mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 transform transition-all duration-500 ease-out ${
                showGreeting ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-lg font-medium text-gray-800">{greeting}</p>
                  <p className="mt-1 text-sm text-gray-600">Greeting generated by your Internet Computer canister</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Powered by Internet Computer
            </p>
            <a 
              href="https://internetcomputer.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Learn more →
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-4xl mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white border border-white/20">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Secure Authentication</h3>
          <p className="text-white/70">Login with Internet Identity or NFID for secure, anonymous authentication.</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white border border-white/20">
          <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Decentralized Storage</h3>
          <p className="text-white/70">Your data is stored securely on the Internet Computer blockchain.</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white border border-white/20">
          <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Fast Performance</h3>
          <p className="text-white/70">Experience lightning-fast interactions with Web3 technology.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;