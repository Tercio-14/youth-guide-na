import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { apiClient } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    console.log('🔐 [AuthContext] Setting up auth state listener');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔄 [AuthContext] Auth state changed', {
        hasUser: !!user,
        userEmail: user?.email,
        userId: user?.uid,
        timestamp: new Date().toISOString()
      });
      
      if (user) {
        try {
          console.log('🎫 [AuthContext] Getting ID token for user:', user.email);
          const token = await user.getIdToken();
          setUser(user);
          setToken(token);
          
          console.log('✅ [AuthContext] User authenticated, fetching profile...');
          
          // Try to fetch user profile
          try {
            console.log('📋 [AuthContext] Attempting to fetch user profile');
            const profileResponse = await apiClient.get('/users/profile', token);
            setUserProfile(profileResponse.profile);
            
            console.log('✅ [AuthContext] User profile loaded successfully', {
              hasProfile: !!profileResponse.profile,
              firstName: profileResponse.profile?.firstName,
              profileKeys: profileResponse.profile ? Object.keys(profileResponse.profile) : []
            });
          } catch (error) {
            console.warn('⚠️ [AuthContext] No user profile found - user needs to complete setup', {
              error: error.message,
              userEmail: user.email
            });
            setUserProfile(null);
          }
        } catch (error) {
          console.error('💥 [AuthContext] Error getting user token:', {
            error: error.message,
            userEmail: user?.email,
            userId: user?.uid
          });
          setUser(null);
          setToken(null);
          setUserProfile(null);
        }
      } else {
        console.log('🚪 [AuthContext] User logged out');
        setUser(null);
        setToken(null);
        setUserProfile(null);
      }
      
      setLoading(false);
      console.log('🏁 [AuthContext] Auth state update completed');
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    console.log('🔓 [AuthContext] Login attempt started', { email });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ [AuthContext] Login successful', {
        userId: result.user.uid,
        email: result.user.email,
        emailVerified: result.user.emailVerified
      });
      return result;
    } catch (error) {
      console.error('❌ [AuthContext] Login failed:', {
        email,
        error: error.message,
        code: error.code
      });
      throw error;
    }
  };

  const register = async (email, password) => {
    console.log('📝 [AuthContext] Registration attempt started', { email });
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ [AuthContext] Registration successful', {
        userId: result.user.uid,
        email: result.user.email,
        emailVerified: result.user.emailVerified
      });
      return result;
    } catch (error) {
      console.error('❌ [AuthContext] Registration failed:', {
        email,
        error: error.message,
        code: error.code
      });
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    console.log('🔍 [AuthContext] Google sign-in attempt started');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('✅ [AuthContext] Google sign-in successful', {
        userId: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      });
      return result;
    } catch (error) {
      console.error('❌ [AuthContext] Google sign-in failed:', {
        error: error.message,
        code: error.code
      });
      throw error;
    }
  };

  const logout = async () => {
    console.log('🚪 [AuthContext] Logout attempt started', {
      currentUser: user?.email,
      hasProfile: !!userProfile
    });
    try {
      await signOut(auth);
      setUserProfile(null);
      console.log('✅ [AuthContext] Logout successful');
    } catch (error) {
      console.error('❌ [AuthContext] Logout failed:', {
        error: error.message,
        code: error.code
      });
      throw error;
    }
  };

  const updateUserProfile = (profile) => {
    console.log('🔄 [AuthContext] Updating user profile in context', {
      oldProfile: userProfile ? Object.keys(userProfile) : null,
      newProfile: profile ? Object.keys(profile) : null,
      firstName: profile?.firstName
    });
    setUserProfile(profile);
    console.log('✅ [AuthContext] User profile updated in context');
  };

  const value = {
    user,
    token,
    loading,
    userProfile,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUserProfile
  };

  // Make auth state available for debugging
  if (typeof window !== 'undefined') {
    window.YGAuthState = value;
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};