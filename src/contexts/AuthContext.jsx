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
import { useOffline, isNetworkError } from './OfflineContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Get offline state - but handle case where OfflineContext isn't ready yet
  let offlineContext;
  try {
    offlineContext = useOffline();
  } catch (e) {
    // OfflineContext not available yet (happens during initial mount)
    offlineContext = { isOffline: false, offlineUser: null };
  }
  
  const { isOffline, offlineUser } = offlineContext;

  useEffect(() => {
    console.log('🔐 [AuthContext] Setting up auth state listener', { isOffline });
    
    // If offline, skip Firebase auth and use offline user
    if (isOffline && offlineUser) {
      console.log('📴 [AuthContext] Offline mode detected - using offline user', {
        offlineUserName: offlineUser.firstName,
        offlineUserEmail: offlineUser.email
      });
      
      // Create a mock Firebase user object for compatibility
      const mockUser = {
        uid: offlineUser.id || 'offline-user',
        email: offlineUser.email || 'offline@youthguide.na',
        displayName: `${offlineUser.firstName} ${offlineUser.lastName}`,
        emailVerified: true,
        // Mock Firebase user methods
        getIdToken: async () => 'offline-token',
        reload: async () => {},
        delete: async () => {},
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: 'offline-refresh-token',
        tenantId: null,
      };
      
      setUser(mockUser);
      setToken('offline-token');
      setUserProfile(offlineUser);
      setLoading(false);
      
      console.log('✅ [AuthContext] Offline user authenticated successfully');
      return;
    }
    
    // Online mode - use Firebase authentication
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔄 [AuthContext] Auth state changed', {
        hasUser: !!user,
        userEmail: user?.email,
        userId: user?.uid,
        timestamp: new Date().toISOString(),
        isOffline
      });
      
      if (user) {
        try {
          console.log('🎫 [AuthContext] Getting ID token for user:', user.email);
          const idTokenResult = await user.getIdTokenResult();
          const token = idTokenResult.token;
          const adminClaim = idTokenResult.claims.admin === true;
          setUser(user);
          setToken(token);
          setIsAdmin(adminClaim);
          
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
            error: error?.message || String(error),
            userEmail: user?.email,
            userId: user?.uid
          });

          // If the error looks like a network / Firebase error, switch the app to offline mode
          try {
            if (isNetworkError(error) && offlineContext?.forceOfflineMode) {
              console.warn('🔌 [AuthContext] Network error while fetching token, forcing offline mode');
              offlineContext.forceOfflineMode({ reason: 'auth-token-network-error' });

              // If we have offline user data, restore it into auth state so user isn't logged out
              if (offlineUser) {
                console.log('📴 [AuthContext] Restoring offline user to avoid logout', { offlineUserEmail: offlineUser.email });
                const mockUser = {
                  uid: offlineUser.id || 'offline-user',
                  email: offlineUser.email || 'offline@youthguide.na',
                  displayName: `${offlineUser.firstName} ${offlineUser.lastName}`,
                  emailVerified: true,
                  getIdToken: async () => 'offline-token'
                };
                setUser(mockUser);
                setToken('offline-token');
                setUserProfile(offlineUser);
                setLoading(false);
                console.log('✅ [AuthContext] Offline user restored, preventing logout');
                return;
              }
            }
          } catch (innerErr) {
            console.error('❌ [AuthContext] Error during network-error handling', innerErr);
          }

          // Default behavior: clear auth state
          setUser(null);
          setToken(null);
          setUserProfile(null);
        }
      } else {
        console.log('🚪 [AuthContext] User logged out');
        setUser(null);
        setToken(null);
        setUserProfile(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
      console.log('🏁 [AuthContext] Auth state update completed');
    });

    return unsubscribe;
  }, [isOffline, offlineUser]);

  const login = async (email, password) => {
    console.log('🔓 [AuthContext] Login attempt started', { email, isOffline });
    
    // Block login attempts in offline mode
    if (isOffline) {
      console.warn('📴 [AuthContext] Login blocked - offline mode active');
      throw new Error('Authentication requires an internet connection. Please try again when online.');
    }
    
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
    console.log('📝 [AuthContext] Registration attempt started', { email, isOffline });
    
    // Block registration in offline mode
    if (isOffline) {
      console.warn('📴 [AuthContext] Registration blocked - offline mode active');
      throw new Error('Account creation requires an internet connection. Please try again when online.');
    }
    
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
    console.log('🔍 [AuthContext] Google sign-in attempt started', { isOffline });
    
    // Block Google sign-in in offline mode
    if (isOffline) {
      console.warn('📴 [AuthContext] Google sign-in blocked - offline mode active');
      throw new Error('Google sign-in requires an internet connection. Please try again when online.');
    }
    
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
      hasProfile: !!userProfile,
      isOffline
    });
    
    // In offline mode, just clear the local state
    if (isOffline) {
      console.log('📴 [AuthContext] Offline logout - clearing local state only');
      setUser(null);
      setToken(null);
      setUserProfile(null);
      setIsAdmin(false);
      console.log('✅ [AuthContext] Offline logout successful');
      return;
    }
    
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
      firstName: profile?.firstName,
      isOffline
    });
    setUserProfile(profile);
    
    // If offline, also update the offline user in OfflineContext
    if (isOffline && offlineContext?.updateOfflineUser) {
      console.log('📴 [AuthContext] Updating offline user in OfflineContext');
      offlineContext.updateOfflineUser(profile);
    }
    
    console.log('✅ [AuthContext] User profile updated in context');
  };

  const value = {
    user,
    token,
    loading,
    userProfile,
    isAdmin,
    isOffline,
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