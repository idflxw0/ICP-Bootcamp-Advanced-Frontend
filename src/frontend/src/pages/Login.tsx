// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Login: React.FC = () => {
  const { isAuthenticated, login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [loginProvider, setLoginProvider] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  // Handle error messages
  useEffect(() => {
    setErrorMessage(error);
    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleInternetIdentityLogin = async () => {
    try {
      setLoginProvider('ii');
      await login('https://identity.ic0.app');
      navigate('/profile');
    } catch (error) {
      console.error('Login failed:', error);
      setLoginProvider(null);
    }
  };

  const handleNFIDLogin = async () => {
    try {
      setLoginProvider('nfid');
      await login('https://nfid.one/authenticate');
      navigate('/profile');
    } catch (error) {
      console.error('Login failed:', error);
      setLoginProvider(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700 flex flex-col items-center justify-center p-4">
      <div 
        className={`w-full max-w-md transform transition-all duration-700 ease-out ${
          animateIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="text-center mb-8">
          <img src="/logo2.svg" alt="DFINITY logo" className="h-20 w-20 mx-auto" />
          <h1 className="mt-6 text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-lg text-indigo-200">Choose your login method</p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200 text-red-600 animate-pulse">
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {errorMessage}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="space-y-5">
              {/* Internet Identity Login Button */}
              <button
                onClick={handleInternetIdentityLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-4 px-6 rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              >
                <div className="flex items-center justify-center">
                  {loginProvider === 'ii' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting to Internet Identity...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Login with Internet Identity
                    </>
                  )}
                </div>
              </button>
              
              {/* NFID Login Button */}
              <button
                onClick={handleNFIDLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-4 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              >
                <div className="flex items-center justify-center">
                  {loginProvider === 'nfid' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting to NFID...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      Login with NFID
                    </>
                  )}
                </div>
              </button>
            </div>
            
            <div className="mt-8 text-center">
              <a 
                href="/"
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
              >
                ← Back to Home
              </a>
            </div>
          </div>
          
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-center text-gray-600">
              By continuing, you agree to the{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-800">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-800">Privacy Policy</a>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-indigo-200">
            New to Internet Computer?{' '}
            <a 
              href="https://internetcomputer.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-indigo-100 font-medium underline transition-colors"
            >
              Learn more about IC
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;