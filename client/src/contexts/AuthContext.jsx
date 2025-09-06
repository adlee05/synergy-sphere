import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get the ID token
        const token = await firebaseUser.getIdToken();
        
        // Create user object with Firebase data
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          token: token
        };
        
        setUser(userData);
        
        // Sync user with backend
        try {
          await syncUserWithBackend(userData);
        } catch (error) {
          console.error('Failed to sync user with backend:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sync user data with backend
  const syncUserWithBackend = async (userData) => {
    try {
      console.log('Syncing user with backend:', { uid: userData.uid, email: userData.email });
      
      const response = await fetch('http://localhost:5000/api/auth/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`
        },
        body: JSON.stringify({
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Backend sync failed: ${errorData.error || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Backend sync successful:', result);
      return result;
    } catch (error) {
      console.error('User sync error:', error);
      throw error;
    }
  };

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      console.log('Starting signup process...', { email, displayName });
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Firebase user created successfully:', user.uid);
      
      // Update display name if provided (Firebase v9+ syntax)
      if (displayName) {
        await updateProfile(user, { displayName });
        console.log('Display name updated:', displayName);
      }
      
      // Get fresh token for backend sync
      const token = await user.getIdToken();
      console.log('Got Firebase ID token for backend sync');
      
      // Sync user with backend
      try {
        await syncUserWithBackend({
          uid: user.uid,
          email: user.email,
          displayName: displayName || user.displayName,
          photoURL: user.photoURL,
          token: token
        });
        console.log('User synced with backend successfully');
      } catch (syncError) {
        console.error('Backend sync failed (non-critical):', syncError);
        // Don't throw here - signup can still succeed even if backend sync fails
      }
      
      return user;
    } catch (error) {
      console.error('Signup error details:', {
        code: error.code,
        message: error.message,
        email: email
      });
      throw error;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get fresh token
  const getToken = async () => {
    if (user) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  };

  const value = {
    user,
    signup,
    login,
    loginWithGoogle,
    logout,
    getToken,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
