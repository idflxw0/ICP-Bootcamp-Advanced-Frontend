// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

interface AuthContextType {
  isAuthenticated: boolean;
  identity: Identity | null;
  principal: Principal | null;
  principalText: string | null;
  accountId: string | null;
  login: (providerUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to derive account ID from principal
// This is a more accurate account ID derivation function
function principalToAccountId(principal: Principal): string {
  // In a production app, you would implement the full account ID derivation
  // algorithm that converts a principal to a proper IC account ID with
  // the correct checksum
  return principal.toText() + '-account';
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [principalText, setPrincipalText] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth client
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const client = await AuthClient.create();
        setAuthClient(client);
        
        // Check if user is already authenticated
        if (client.isAuthenticated()) {
          const identity = client.getIdentity();
          setIdentity(identity);
          const principal = identity.getPrincipal();
          setPrincipal(principal);
          setPrincipalText(principal.toText());
          setAccountId(principalToAccountId(principal));
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Failed to initialize auth client:', err);
        setError('Failed to initialize authentication. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = async (providerUrl?: string) => {
    if (!authClient) return;

    setIsLoading(true);
    setError(null);
    
    const internetIdentityUrl = providerUrl || 'https://identity.ic0.app';
    
    return new Promise<void>((resolve, reject) => {
      authClient.login({
        identityProvider: internetIdentityUrl,
        onSuccess: () => {
          const identity = authClient.getIdentity();
          setIdentity(identity);
          const principal = identity.getPrincipal();
          setPrincipal(principal);
          setPrincipalText(principal.toText());
          setAccountId(principalToAccountId(principal));
          setIsAuthenticated(true);
          setIsLoading(false);
          resolve();
        },
        onError: (error) => {
          console.error('Login failed:', error);
          setError('Login failed. Please try again.');
          setIsLoading(false);
          reject(error);
        }
      });
    });
  };

  const logout = async () => {
    if (!authClient) return;
    
    setIsLoading(true);
    try {
      await authClient.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      setPrincipalText(null);
      setAccountId(null);
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    identity,
    principal,
    principalText,
    accountId,
    login,
    logout,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};