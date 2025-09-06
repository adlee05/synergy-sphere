import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

const authService = {
  // Sign up a new user
  signup: async (userData) => {
    try {
      const { email, password, firstName, lastName } = userData;
      
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Get the ID token
      const token = await user.getIdToken();
      
      return {
        token,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified
        }
      };
    } catch (error) {
      throw { message: getFirebaseErrorMessage(error.code) };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const { email, password } = credentials;
      
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get the ID token
      const token = await user.getIdToken();
      
      return {
        token,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified
        }
      };
    } catch (error) {
      throw { message: getFirebaseErrorMessage(error.code) };
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw { message: 'No user logged in' };
      }
      
      const token = await user.getIdToken();
      
      return {
        token,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified
        }
      };
    } catch (error) {
      throw { message: 'Failed to fetch profile' };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw { message: 'Logout failed' };
    }
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  }
};

// Helper function to convert Firebase error codes to user-friendly messages
const getFirebaseErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please use a different email.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'An error occurred. Please try again.';
  }
};

export default authService;
