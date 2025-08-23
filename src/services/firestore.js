
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Clean data object by removing undefined values recursively
 * Firestore doesn't accept undefined values
 */
const cleanDataForFirestore = (obj) => {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanDataForFirestore).filter(item => item !== undefined);
  }

  if (typeof obj === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanDataForFirestore(value);
      }
    }
    return cleaned;
  }

  return obj;
};

export const saveResumeData = async (userId, resumeData) => {
  try {
    // Ensure we have a valid resume ID - never use 'default'
    if (!resumeData.id || resumeData.id === 'default' || resumeData.id === null) {
      const error = new Error('Invalid resume ID provided. Resume ID cannot be null, undefined, or "default"');
      return { success: false, error: error.message };
    }

    const resumeRef = doc(db, 'users', userId, 'resumes', resumeData.id);

    // Clean the data to remove undefined values
    const cleanedData = cleanDataForFirestore(resumeData);

    const dataToSave = {
      ...cleanedData,
      lastUpdated: serverTimestamp()
    };

    // Debug: Log the data being sent to Firestore
    if (typeof window !== 'undefined' && window.console) {
      console.log('[DEBUG] Saving resume to Firestore:', JSON.parse(JSON.stringify(dataToSave)));
    }

    await setDoc(resumeRef, dataToSave, { merge: true });
    return { success: true };
  } catch (error) {
    if (typeof window !== 'undefined' && window.console) {
      console.error('[DEBUG] Firestore save error:', error);
    }
    return { success: false, error: error.message };
  }
};

export const loadResumeData = async (userId, resumeId = 'default') => {
  try {
    const resumeRef = doc(db, 'users', userId, 'resumes', resumeId);
    const resumeSnap = await getDoc(resumeRef);

    if (resumeSnap.exists()) {
      return { success: true, data: resumeSnap.data() };
    } else {
      return { success: false, error: 'Resume not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserResumes = async (userId) => {
  try {
    console.log('Firestore: getUserResumes called for userId:', userId);
    const resumesRef = collection(db, 'users', userId, 'resumes');
    console.log('Firestore: Querying collection path:', `users/${userId}/resumes`);

    const querySnapshot = await getDocs(resumesRef);
    console.log('Firestore: Query snapshot size:', querySnapshot.size);

    const resumes = [];

    querySnapshot.forEach((doc) => {
      console.log('Firestore: Found document with ID:', doc.id, 'Data:', doc.data());
      resumes.push({ id: doc.id, ...doc.data() });
    });

    console.log('Firestore: Total resumes found:', resumes.length);
    console.log('Firestore: Returning resumes:', resumes);
    return { success: true, data: resumes };
  } catch (error) {
    console.error('Firestore: getUserResumes error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteResume = async (userId, resumeId) => {
  try {
    console.log('Firestore: deleteResume called with userId:', userId, 'resumeId:', resumeId);
    const resumeRef = doc(db, 'users', userId, 'resumes', resumeId);
    console.log('Firestore: Deleting document at path:', `users/${userId}/resumes/${resumeId}`);

    await deleteDoc(resumeRef);
    console.log('Firestore: Delete successful for resumeId:', resumeId);
    return { success: true };
  } catch (error) {
    console.error('Firestore: Delete error for resumeId:', resumeId, 'Error:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToResumeUpdates = (userId, resumeId, callback) => {
  const resumeRef = doc(db, 'users', userId, 'resumes', resumeId);
  return onSnapshot(resumeRef, (doc) => {
    if (doc.exists()) {
      callback({ success: true, data: doc.data() });
    } else {
      callback({ success: false, error: 'Resume not found' });
    }
  });
};
