// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Login: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginProvider, setLoginProvider] = useState<string | null>(null);

  // If already authenticated, redirect to profile
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleInternetIdentityLogin = async () => {
    try {
      setIsLoading(true);
      setLoginProvider('ii');
      await login('https://identity.ic0.app');
      navigate('/profile');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
      setLoginProvider(null);
    }
  };

  const handleNFIDLogin = async () => {
    try {
      setIsLoading(true);
      setLoginProvider('nfid');
      await login('https://nfid.one/authenticate');
      navigate('/profile');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
      setLoginProvider(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-4 flex items-center justify-center">
          <img src="/logo2.svg" alt="DFINITY logo" className="h-12" />
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to Your dApp</h1>
          
          <div className="space-y-4">
            <button
              onClick={handleInternetIdentityLogin}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginProvider === 'ii' ? 'Connecting...' : 'Login with Internet Identity'}
            </button>
            
            <button
              onClick={handleNFIDLogin}
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginProvider === 'nfid' ? 'Connecting...' : 'Login with NFID'}
            </button>
            
            <div className="mt-4 text-center">
              <a 
                href="/"
                className="text-indigo-600 hover:text-indigo-800 text-sm"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;