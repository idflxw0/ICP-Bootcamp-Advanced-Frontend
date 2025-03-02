// src/pages/Profile.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Profile: React.FC = () => {
  const { isAuthenticated, principalText, accountId, logout } = useAuth();
  const navigate = useNavigate();

  // Protect this route - redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // If not authenticated, don't render anything (will redirect via useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-4 flex items-center justify-center">
          <img src="/logo2.svg" alt="DFINITY logo" className="h-12" />
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Profile</h1>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium text-gray-700 mb-2">User Principal</h2>
              <p className="text-sm text-gray-800 break-all font-mono">{principalText}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium text-gray-700 mb-2">Account ID</h2>
              <p className="text-sm text-gray-800 break-all font-mono">{accountId}</p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Home
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;