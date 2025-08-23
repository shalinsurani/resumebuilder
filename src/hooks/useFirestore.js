
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  saveResumeData, 
  loadResumeData, 
  getUserResumes, 
  deleteResume,
  subscribeToResumeUpdates
} from '../services/firestore';

export const useFirestore = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveResume = async (resumeData) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    setLoading(true);
    setError(null);

    try {
      const result = await saveResumeData(user.uid, resumeData);
      return result;
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const loadResume = async (resumeId = 'default') => {
    if (!user) return { success: false, error: 'User not authenticated' };

    setLoading(true);
    setError(null);

    try {
      const result = await loadResumeData(user.uid, resumeId);
      return result;
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getResumes = async () => {
    if (!user) return { success: false, error: 'User not authenticated' };

    setLoading(true);
    setError(null);

    try {
      const result = await getUserResumes(user.uid);
      return result;
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeResume = async (resumeId) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    setLoading(true);
    setError(null);

    try {
      const result = await deleteResume(user.uid, resumeId);
      return result;
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const subscribeToUpdates = (resumeId, callback) => {
    if (!user) return null;

    return subscribeToResumeUpdates(user.uid, resumeId, callback);
  };

  return {
    saveResume,
    loadResume,
    getResumes,
    removeResume,
    subscribeToUpdates,
    loading,
    error,
    setError
  };
};
