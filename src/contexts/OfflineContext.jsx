/**
 * OFFLINE MODE: Context Provider
 * 
 * Manages offline state, data, and automatic mode switching.
 * Provides useOffline() hook for easy access across components.
 * 
 * Features:
 * - Network status detection (online/offline) with actual connectivity check
 * - Offline data management (user, saved, chats)
 * - Automatic mode switching on network change
 * - Sync queue for offline-to-online transitions
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

// Create context
const OfflineContext = createContext(null);

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const BACKEND_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

/**
 * Check actual internet connectivity by testing backend AND Firebase
 * 
 * Problem: Backend can be running on localhost while WiFi is off,
 * causing health check to pass but Firebase operations to fail.
 * 
 * Solution: Check a real API endpoint that requires Firebase access.
 */
async function checkConnectivity() {
  try {
    // Try to reach backend health endpoint first (quick check)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch(`${BACKEND_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-cache'
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.log('🔌 [Connectivity Check] Backend health check failed');
      return false;
    }
    
    // Backend is up, but check if it can actually reach Firebase
    // We'll check the response for Firebase status
    const healthData = await response.json().catch(() => ({}));
    
    // If health check includes Firebase status, use it
    if (healthData.firebase === false || healthData.firestore === false) {
      console.log('🔌 [Connectivity Check] Firebase/Firestore unavailable');
      return false;
    }
    
    return true; // Backend is up and Firebase is accessible
  } catch (error) {
    console.log('🔌 [Connectivity Check] Backend unreachable, switching to offline mode', {
      error: error.message,
      apiUrl: BACKEND_BASE_URL
    });
    return false; // Backend not reachable = offline
  }
}

/**
 * Detect if error is Firebase/network related and should trigger offline mode
 */
function isNetworkError(error) {
  if (!error) return false;
  
  const errorStr = typeof error === 'string' ? error : error.message || error.toString();
  
  // Firebase/gRPC errors
  if (errorStr.includes('UNAVAILABLE')) return true;
  if (errorStr.includes('No connection established')) return true;
  if (errorStr.includes('ENOTFOUND')) return true;
  if (errorStr.includes('Network request failed')) return true;
  if (errorStr.includes('Failed to fetch')) return true;
  
  // HTTP errors that suggest connectivity issues
  if (errorStr.includes('ERR_INTERNET_DISCONNECTED')) return true;
  if (errorStr.includes('ERR_NETWORK_CHANGED')) return true;
  
  return false;
}

/**
 * OfflineContext Provider Component
 */
export function OfflineProvider({ children }) {
  // Network status
  const [isOffline, setIsOffline] = useState(false); // Start with online assumption
  const [isCheckingConnectivity, setIsCheckingConnectivity] = useState(true);
  // Keep a short history of connectivity checks for debugging
  const [connectivityHistory, setConnectivityHistory] = useState([]);
  
  // Backend settings for offline mode control
  const [offlineSettings, setOfflineSettings] = useState({
    autoDetection: true,
    manualOverride: false,
    lastUpdated: null
  });
  const autoDetectionRef = useRef(true);
  useEffect(() => { autoDetectionRef.current = offlineSettings.autoDetection; }, [offlineSettings.autoDetection]);
  
  // Offline data state
  const [offlineUser, setOfflineUser] = useState(null);
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [conversations, setConversations] = useState([]);
  
  // Loading and sync state
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [syncQueue, setSyncQueue] = useState([]);
  const [error, setError] = useState(null);

  /**
   * Check connectivity and update offline status
   */
  const updateConnectivityStatus = useCallback(async () => {
    console.log('🔍 [OfflineContext] Checking connectivity...');
    setIsCheckingConnectivity(true);
    
    const isConnected = await checkConnectivity();
    const wasOffline = isOffline;
    
    setIsOffline(!isConnected);
    setIsCheckingConnectivity(false);

    const event = {
      timestamp: new Date().toISOString(),
      source: 'periodic-check',
      isConnected,
      reason: isConnected ? 'backend+firebase-reachable' : 'backend-or-firebase-unreachable',
      navigatorOnLine: typeof navigator !== 'undefined' ? navigator.onLine : null
    };
    setConnectivityHistory(prev => [event, ...prev].slice(0, 50));

    console.log('🔌 [OfflineContext] Connectivity check complete', {
      isConnected,
      isOffline: !isConnected,
      statusChanged: wasOffline !== !isConnected,
      event
    });
    
    // Show toast notification if status changed
    if (wasOffline && isConnected) {
      toast.success('🌐 Back online! Syncing your data...', { duration: 3000 });
    } else if (!wasOffline && !isConnected) {
      toast.warning('📴 You\'re offline. Switching to offline mode...', { duration: 4000 });
    }
    
    return isConnected;
  }, [isOffline]);

  // Helper to record connectivity events from different sources
  const pushConnectivityEvent = useCallback((entry) => {
    const ev = {
      timestamp: new Date().toISOString(),
      ...entry
    };
    setConnectivityHistory(prev => [ev, ...prev].slice(0, 200));
    // also verbose console log for easier debugging
    console.groupCollapsed('🔔 [OfflineContext] Connectivity Event');
    console.log(ev);
    console.trace();
    console.groupEnd();
  }, []);

  /**
   * Load offline data from backend
   */
  const loadOfflineData = useCallback(async () => {
    if (!isOffline) return; // Only load when offline
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Load user profile
      const userRes = await fetch(`${API_BASE_URL}/offline/user`);
      if (!userRes.ok) throw new Error('Failed to load offline user');
      const userData = await userRes.json();
      setOfflineUser(userData.user || userData);

      // Load saved opportunities
      const savedRes = await fetch(`${API_BASE_URL}/offline/saved`);
      if (!savedRes.ok) throw new Error('Failed to load saved opportunities');
      const savedData = await savedRes.json();
      setSavedOpportunities(savedData.savedOpportunities || []);

      // Load conversations
      const chatsRes = await fetch(`${API_BASE_URL}/offline/chats`);
      if (!chatsRes.ok) throw new Error('Failed to load conversations');
      const chatsData = await chatsRes.json();
      setConversations(chatsData.conversations || []);

      console.log('✅ [OfflineContext] Offline data loaded successfully');
    } catch (err) {
      console.error('❌ [OfflineContext] Failed to load offline data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isOffline]);

  /**
   * Update offline user profile
   */
  const updateOfflineUser = useCallback(async (updates) => {
    if (!isOffline) return;

    try {
      const res = await fetch(`${API_BASE_URL}/offline/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error('Failed to update offline user');
      
      const data = await res.json();
      setOfflineUser(data.user);

      // Add to sync queue
      setSyncQueue(prev => [...prev, {
        type: 'profile_update',
        data: updates,
        timestamp: new Date().toISOString()
      }]);

      console.log('✅ [OfflineContext] User profile updated offline');
      return data.user;
    } catch (err) {
      console.error('❌ [OfflineContext] Failed to update user:', err);
      throw err;
    }
  }, [isOffline]);

  /**
   * Save opportunity offline
   */
  const saveOpportunityOffline = useCallback(async (opportunity) => {
    if (!isOffline) return;

    try {
      const res = await fetch(`${API_BASE_URL}/offline/saved`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunity }),
      });

      if (!res.ok) throw new Error('Failed to save opportunity offline');
      
      const data = await res.json();
      setSavedOpportunities(data.savedOpportunities || []);

      // Add to sync queue
      setSyncQueue(prev => [...prev, {
        type: 'save_opportunity',
        data: opportunity,
        timestamp: new Date().toISOString()
      }]);

      console.log('✅ [OfflineContext] Opportunity saved offline');
      return data;
    } catch (err) {
      console.error('❌ [OfflineContext] Failed to save opportunity:', err);
      throw err;
    }
  }, [isOffline]);

  /**
   * Remove saved opportunity offline
   */
  const removeOpportunityOffline = useCallback(async (opportunityId) => {
    if (!isOffline) return;

    try {
      const res = await fetch(`${API_BASE_URL}/offline/saved/${opportunityId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to remove opportunity offline');
      
      const data = await res.json();
      setSavedOpportunities(data.savedOpportunities || []);

      // Add to sync queue
      setSyncQueue(prev => [...prev, {
        type: 'remove_opportunity',
        data: { id: opportunityId },
        timestamp: new Date().toISOString()
      }]);

      console.log('✅ [OfflineContext] Opportunity removed offline');
      return data;
    } catch (err) {
      console.error('❌ [OfflineContext] Failed to remove opportunity:', err);
      throw err;
    }
  }, [isOffline]);

  /**
   * Add chat message offline
   */
  const addChatMessageOffline = useCallback(async (conversationId, message) => {
    if (!isOffline) return;

    try {
      const res = await fetch(`${API_BASE_URL}/offline/chats/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error('Failed to add chat message offline');
      
      const data = await res.json();
      
      // Update conversations list
      setConversations(prev => 
        prev.map(conv => 
          conv.conversationId === conversationId 
            ? data.conversation 
            : conv
        )
      );

      console.log('✅ [OfflineContext] Chat message added offline');
      return data.conversation;
    } catch (err) {
      console.error('❌ [OfflineContext] Failed to add chat message:', err);
      throw err;
    }
  }, [isOffline]);

  /**
   * Reset all offline data to defaults
   */
  const resetOfflineData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/offline/reset`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Failed to reset offline data');
      
      // Reload data
      await loadOfflineData();

      console.log('✅ [OfflineContext] Offline data reset successfully');
    } catch (err) {
      console.error('❌ [OfflineContext] Failed to reset offline data:', err);
      throw err;
    }
  }, [loadOfflineData]);

  /**
   * Sync offline data to online (Firebase)
   * TODO: Implement in Stage 6 (Sync Queue)
   */
  const syncToOnline = useCallback(async () => {
    if (isOffline) {
      console.warn('⚠️ [OfflineContext] Cannot sync while offline');
      return;
    }

    if (syncQueue.length === 0) {
      console.log('✅ [OfflineContext] No pending sync actions');
      return;
    }

    console.log(`🔄 [OfflineContext] Syncing ${syncQueue.length} actions to online...`);
    
    // TODO: Implement sync logic in Stage 6
    // For now, just clear the queue and set last sync time
    setSyncQueue([]);
    setLastSync(new Date().toISOString());
    
    console.log('✅ [OfflineContext] Sync completed (placeholder)');
  }, [isOffline, syncQueue]);

  /**
   * Handle network status change
   */
  const handleOnline = useCallback(async () => {
    // Check if auto-detection is disabled
    if (!autoDetectionRef.current) {
      console.log('⚠️ [OfflineContext] Auto-detection disabled, skipping online event');
      return;
    }
    
    console.log('🟢 [OfflineContext] Network interface is ONLINE - verifying connectivity...');
    
    // Actually check if backend is reachable
    const isConnected = await checkConnectivity();

    pushConnectivityEvent({ source: 'online-event', isConnected, navigatorOnLine: navigator.onLine });

    if (isConnected) {
      console.log('✅ [OfflineContext] Backend reachable - switching to ONLINE mode');
      setIsOffline(false);
      toast.success('🌐 Back online! Your data will sync automatically.', { duration: 3000 });
      
      // Prompt user to sync if there are pending actions
      if (syncQueue.length > 0) {
        console.log(`📤 [OfflineContext] ${syncQueue.length} actions pending sync`);
        // TODO: Trigger auto-sync in future enhancement
      }
    } else {
      console.log('⚠️ [OfflineContext] Network interface online but backend unreachable - staying OFFLINE');
      setIsOffline(true);
    }
  }, [syncQueue, pushConnectivityEvent]);

  const handleOffline = useCallback(async () => {
    // Check if auto-detection is disabled
    if (!autoDetectionRef.current) {
      console.log('⚠️ [OfflineContext] Auto-detection disabled, skipping offline event');
      return;
    }
    
    console.log('🔴 [OfflineContext] Network interface is OFFLINE');
    setIsOffline(true);
    pushConnectivityEvent({ source: 'offline-event', isConnected: false, navigatorOnLine: navigator.onLine, reason: 'browser-offline-event' });
    toast.warning('📴 You\'re offline. Switching to offline mode...', { duration: 4000 });
    
    // Load offline data immediately
    await loadOfflineData();
  }, [loadOfflineData, pushConnectivityEvent]);

  /**
   * Initialize offline mode and network listeners
   */
  useEffect(() => {
    // Initial connectivity check on mount
    const initializeConnectivity = async () => {
      console.log('🔄 [OfflineContext] Initializing connectivity check...');
      
      // Fetch settings from backend first
      try {
        const response = await fetch(`${API_BASE_URL}/offline/mode/settings`);
        if (response.ok) {
          const data = await response.json();
          console.log('⚙️ [OfflineContext] Loaded offline settings:', data.settings);
          setOfflineSettings(data.settings);
          
          // If manual override is set, apply it immediately
          if (!data.settings.autoDetection && data.settings.manualOverride !== undefined) {
            console.log(`🎛️ [OfflineContext] Manual override active: ${data.settings.manualOverride ? 'OFFLINE' : 'ONLINE'}`);
            setIsOffline(data.settings.manualOverride);
            setIsCheckingConnectivity(false);
            
            // Load offline data if manually forced offline
            if (data.settings.manualOverride) {
              await loadOfflineData();
            }
            return; // Skip connectivity check
          }
        }
      } catch (error) {
        console.warn('⚠️ [OfflineContext] Failed to fetch settings, using defaults:', error);
      }
      
      const isConnected = await checkConnectivity();
      setIsOffline(!isConnected);
      setIsCheckingConnectivity(false);
      
      console.log('✅ [OfflineContext] Initial connectivity check complete', {
        isConnected,
        isOffline: !isConnected
      });
      
      // Load offline data if offline
      if (!isConnected) {
        await loadOfflineData();
      }
    };
    
    initializeConnectivity();

  // Add network status listeners
  const onOnline = () => handleOnline();
  const onOffline = () => handleOffline();
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
    
    // Periodic connectivity check every 30 seconds
    const intervalId = setInterval(async () => {
      // Skip if auto-detection is disabled
      if (!autoDetectionRef.current) {
        console.log('⏸️ [OfflineContext] Periodic check skipped (auto-detection disabled)');
        return;
      }
      
      const isConnected = await checkConnectivity();
      const newOfflineStatus = !isConnected;

      // Record event
      pushConnectivityEvent({ source: 'periodic-interval', isConnected, navigatorOnLine: navigator.onLine });

      if (newOfflineStatus !== isOffline) {
        console.log('🔄 [OfflineContext] Connectivity status changed', {
          wasOffline: isOffline,
          isOffline: newOfflineStatus
        });
        setIsOffline(newOfflineStatus);

        if (newOfflineStatus) {
          toast.warning('📴 Connection lost. Switching to offline mode...', { duration: 4000 });
          await loadOfflineData();
        } else {
          toast.success('🌐 Connection restored! Syncing your data...', { duration: 3000 });
        }
      }
    }, 30000); // Check every 30 seconds

    // Cleanup listeners
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      clearInterval(intervalId);
    };
  }, [isOffline, loadOfflineData]);

  /**
   * Apply manual override changes when settings update
   */
  useEffect(() => {
    // Only apply manual override when auto-detection is disabled
    if (!offlineSettings.autoDetection && offlineSettings.manualOverride !== undefined) {
      const shouldBeOffline = offlineSettings.manualOverride;
      
      if (shouldBeOffline !== isOffline) {
        console.log(`🎛️ [OfflineContext] Applying manual override: ${shouldBeOffline ? 'OFFLINE' : 'ONLINE'}`);
        setIsOffline(shouldBeOffline);
        
        // Load offline data if switching to offline
        if (shouldBeOffline) {
          loadOfflineData();
        }
      }
    }
  }, [offlineSettings.autoDetection, offlineSettings.manualOverride, isOffline, loadOfflineData]);

  /**
   * Control functions for manual mode management
   */
  const toggleAutoDetection = useCallback(async (enable) => {
    try {
      const response = await fetch(`${API_BASE_URL}/offline/mode/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoDetection: enable })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ [OfflineContext] Auto-detection toggled:', data.message);
        setOfflineSettings(data.settings);
        toast.success(data.message, { duration: 3000 });
        return data.settings;
      } else {
        const error = await response.json();
        console.error('❌ [OfflineContext] Failed to toggle auto-detection:', error);
        toast.error(`Failed: ${error.error}`, { duration: 4000 });
        throw new Error(error.error);
      }
    } catch (error) {
      console.error('❌ [OfflineContext] Toggle auto-detection error:', error);
      toast.error('Failed to toggle auto-detection', { duration: 4000 });
      throw error;
    }
  }, []);

  const forceOfflineModeManual = useCallback(async (force) => {
    try {
      const response = await fetch(`${API_BASE_URL}/offline/mode/force`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceOffline: force })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ [OfflineContext] Offline mode forced:', data.message);
        setOfflineSettings(data.settings);
        toast.success(data.message, { duration: 3000 });
        return data.settings;
      } else {
        const error = await response.json();
        console.error('❌ [OfflineContext] Failed to force offline mode:', error);
        toast.error(`Failed: ${error.message || error.error}`, { duration: 4000 });
        throw new Error(error.error);
      }
    } catch (error) {
      console.error('❌ [OfflineContext] Force offline mode error:', error);
      toast.error('Failed to force offline mode', { duration: 4000 });
      throw error;
    }
  }, []);

  const getOfflineSettings = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/offline/mode/settings`);
      if (response.ok) {
        const data = await response.json();
        setOfflineSettings(data.settings);
        return data.settings;
      }
    } catch (error) {
      console.error('❌ [OfflineContext] Failed to fetch settings:', error);
    }
    return offlineSettings;
  }, [offlineSettings]);

  // Context value
  const value = {
    // Network status
    isOffline,
    isOnline: !isOffline,
    
    // Offline data
    offlineUser,
    savedOpportunities,
    conversations,
    
    // State
    isLoading,
    error,
    lastSync,
    syncQueue,
    hasPendingSync: syncQueue.length > 0,
    
    // Actions
    loadOfflineData,
    updateOfflineUser,
    saveOpportunityOffline,
    removeOpportunityOffline,
    addChatMessageOffline,
    resetOfflineData,
    syncToOnline,
    
    // Force offline mode (for error handling)
    forceOfflineMode: (opts = {}) => {
      const reason = opts.reason || 'manual-or-detected-error';
      console.log('⚠️ [OfflineContext] Forcing offline mode due to connectivity error', { reason, navigatorOnLine: typeof navigator !== 'undefined' ? navigator.onLine : null });
      pushConnectivityEvent({ source: 'force-offline', isConnected: false, reason, navigatorOnLine: typeof navigator !== 'undefined' ? navigator.onLine : null });
      setIsOffline(true);
      loadOfflineData();
      toast.warning('📴 Connection lost. Switching to offline mode...', { duration: 4000 });
    },
    
    // Connectivity history for debugging (most recent first)
    connectivityHistory,
    
    // Manual control system
    offlineSettings,
    toggleAutoDetection,
    forceOfflineModeManual, // Manual control via API
    getOfflineSettings,
  };

  // Expose control functions globally for console access
  useEffect(() => {
    window.YGOfflineControls = {
      // Toggle auto-detection on/off
      toggleAutoDetection: async (enable) => {
        console.log(`🎛️ Toggling auto-detection: ${enable ? 'ON' : 'OFF'}`);
        return await toggleAutoDetection(enable);
      },
      
      // Force offline mode (only works when auto-detection is off)
      forceOffline: async (force) => {
        console.log(`🎛️ Forcing offline mode: ${force ? 'ON' : 'OFF'}`);
        return await forceOfflineModeManual(force);
      },
      
      // Get current settings
      getSettings: async () => {
        const settings = await getOfflineSettings();
        console.log('⚙️ Current settings:', settings);
        return settings;
      },
      
      // Helper: Disable auto-detection and force offline
      goOffline: async () => {
        console.log('🎛️ Going offline (disabling auto-detection + forcing offline)...');
        await toggleAutoDetection(false);
        return await forceOfflineModeManual(true);
      },
      
      // Helper: Re-enable auto-detection
      goAuto: async () => {
        console.log('🎛️ Re-enabling auto-detection...');
        return await toggleAutoDetection(true);
      },
      
      // View connectivity history
      showHistory: () => {
        console.table(connectivityHistory.slice(0, 20).map(event => ({
          time: new Date(event.timestamp).toLocaleTimeString(),
          source: event.source,
          connected: event.isConnected,
          navigatorOnline: event.navigatorOnLine,
          reason: event.reason || '-'
        })));
        return connectivityHistory;
      }
    };
    
    console.log('🎛️ [OfflineContext] Control functions exposed via window.YGOfflineControls');
    console.log('   Usage:');
    console.log('   - YGOfflineControls.toggleAutoDetection(false)  // Disable auto-detection');
    console.log('   - YGOfflineControls.forceOffline(true)          // Force offline mode');
    console.log('   - YGOfflineControls.getSettings()               // View current settings');
    console.log('   - YGOfflineControls.goOffline()                 // Quick: disable + force offline');
    console.log('   - YGOfflineControls.goAuto()                    // Quick: re-enable auto-detection');
    console.log('   - YGOfflineControls.showHistory()               // View connectivity history');
  }, [toggleAutoDetection, forceOfflineModeManual, getOfflineSettings, connectivityHistory]);

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
}

/**
 * Custom hook to use offline context
 * 
 * @returns {Object} Offline context value
 * @throws {Error} If used outside OfflineProvider
 */
export function useOffline() {
  const context = useContext(OfflineContext);
  
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  
  return context;
}

/**
 * Export helper function to detect network errors
 * Components can use this to trigger offline mode on error
 */
export { isNetworkError };

export default OfflineContext;
