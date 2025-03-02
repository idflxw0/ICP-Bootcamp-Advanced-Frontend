// First, install the necessary packages:
// npm install @dfinity/auth-client @dfinity/identity @dfinity/principal react-router-dom --save

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
// This uses the standard algorithm for IC account IDs
function principalToAccountId(principal: Principal): string {
  // This is a simplified version. In a production app, you would use
  // a proper account ID derivation function from a library
  return principal.toString() + '-account';
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

  // Initialize auth client
  useEffect(() => {
    AuthClient.create().then(client => {
      setAuthClient(client);
      
      // Check if user is already authenticated
      if (client.isAuthenticated()) {
        client.getIdentity().then(identity => {
          setIdentity(identity);
          const principal = identity.getPrincipal();
          setPrincipal(principal);
          setPrincipalText(principal.toString());
          setAccountId(principalToAccountId(principal));
          setIsAuthenticated(true);
        });
      }
    });
  }, []);

  const login = async (providerUrl?: string) => {
    if (!authClient) return;

    const internetIdentityUrl = providerUrl || 'https://identity.ic0.app';
    
    return new Promise<void>((resolve, reject) => {
      authClient.login({
        identityProvider: internetIdentityUrl,
        onSuccess: () => {
          const identity = authClient.getIdentity();
          setIdentity(identity);
          const principal = identity.getPrincipal();
          setPrincipal(principal);
          setPrincipalText(principal.toString());
          setAccountId(principalToAccountId(principal));
          setIsAuthenticated(true);
          resolve();
        },
        onError: (error) => {
          console.error('Login failed:', error);
          reject(error);
        }
      });
    });
  };

  const logout = async () => {
    if (!authClient) return;
    
    await authClient.logout();
    setIsAuthenticated(false);
    setIdentity(null);
    setPrincipal(null);
    setPrincipalText(null);
    setAccountId(null);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    identity,
    principal,
    principalText,
    accountId,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};