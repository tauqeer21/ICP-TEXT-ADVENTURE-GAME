import { useState, useEffect, useCallback } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../utils/agent';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [principal, setPrincipal] = useState(null);
  const [authClient, setAuthClient] = useState(null);

  // Initialize auth client
  useEffect(() => {
    const initAuth = async () => {
      try {
        const client = await AuthClient.create({
          idleOptions: {
            disableIdle: true,
            disableDefaultIdleCallback: true
          }
        });
        
        setAuthClient(client);
        
        // Check if already authenticated
        const authenticated = await client.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const identity = client.getIdentity();
          setPrincipal(identity.getPrincipal().toText());
        }
        
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback(async () => {
    if (!authClient) return;

    setIsLoading(true);
    
    try {
      // Get the Internet Identity URL for local development
      const identityProvider = process.env.NODE_ENV === 'development' 
        ? `http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`
        : 'https://identity.ic0.app';

      await new Promise((resolve, reject) => {
        authClient.login({
          identityProvider,
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
          windowOpenerFeatures: 'width=525,height=525,left=100,top=100'
        });
      });

      const identity = authClient.getIdentity();
      const principalText = identity.getPrincipal().toText();
      
      setIsAuthenticated(true);
      setPrincipal(principalText);
      
      console.log('Successfully authenticated with principal:', principalText);
      
    } catch (error) {
      console.error('Login failed:', error);
      // Show user-friendly error
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [authClient]);

  // Logout function
  const logout = useCallback(async () => {
    if (!authClient) return;

    try {
      await authClient.logout();
      setIsAuthenticated(false);
      setPrincipal(null);
      console.log('Successfully logged out');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [authClient]);

  // Get identity for actor creation
  const getIdentity = useCallback(() => {
    return authClient?.getIdentity();
  }, [authClient]);

  return {
    isAuthenticated,
    isLoading,
    principal,
    login,
    logout,
    getIdentity,
    authClient
  };
};
