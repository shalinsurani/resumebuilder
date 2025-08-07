
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { registerUser, loginUser, logoutUser, resetPassword } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, displayName) => {
    try {
      setError(null);
      setLoading(true);
      const result = await registerUser(email, password, displayName);
      if (!result.success) {
        setError(result.error);
      }
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const result = await loginUser(email, password);
      if (!result.success) {
        setError(result.error);
      }
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await logoutUser();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      const result = await resetPassword(email);
      if (!result.success) {
        setError(result.error);
      }
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    signup,
    login,
    logout,
    forgotPassword,
    loading,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
