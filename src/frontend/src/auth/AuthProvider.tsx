// First, you'll need to install Identity Kit:
// npm install @identity-kit/react @identity-kit/core @identity-kit/providers --save

// src/auth/AuthProvider.tsx
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { IdentityKitProvider } from '@identity-kit/react';
import { NfidProvider } from '@identity-kit/providers/nfid';
import { InternetIdentityProvider } from '@identity-kit/providers/internet-identity';

// Define auth context types
type AuthContextType = {
  isAuthenticated: boolean;
  userPrincipal: string | null;
  userAccountId: string | null;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPrincipal, setUserPrincipal] = useState<string | null>(null);
  const [userAccountId, setUserAccountId] = useState<string | null>(null);
  
  // Configure Identity Kit providers
  const providers = [
    new InternetIdentityProvider({
      providerUrl: 'https://identity.ic0.app',
      derivationOrigin: window.location.origin,
    }),
    new NfidProvider({
      appName: 'My dApp',
      logoUrl: '/logo2.svg',
    })
  ];

  const handleLogin = () => {
    // This will be handled by Identity Kit
    console.log('Login initiated');
  };

  const handleLogout = () => {
    // This will be handled by Identity Kit
    setIsAuthenticated(false);
    setUserPrincipal(null);
    setUserAccountId(null);
  };

  // Listen for Identity Kit authentication events
  const onSuccess = (identity: any) => {
    setIsAuthenticated(true);
    
    // Get the principal and convert to string
    setUserPrincipal(identity.getPrincipal().toString());
    
    // Derive account ID (simplified, you might need a proper derivation function)
    // This is a placeholder - you'll need to implement the actual account ID derivation
    setUserAccountId(`${identity.getPrincipal().toString()}-account`);
  };

  const value = {
    isAuthenticated,
    userPrincipal,
    userAccountId,
    login: handleLogin,
    logout: handleLogout,
  };

  return (
    <IdentityKitProvider
      providers={providers}
      onSuccess={onSuccess}
      onError={(error) => console.error('Authentication error:', error)}
    >
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </IdentityKitProvider>
  );
};