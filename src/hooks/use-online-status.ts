import { useState, useEffect } from 'react';

export interface OnlineStatus {
  isOnline: boolean;
  wasOffline: boolean;
}

/**
 * Hook to detect online/offline network status
 * Tracks both current status and previous offline state for transition detection
 */
export function useOnlineStatus(): OnlineStatus {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    function handleOnline() {
      console.log('📡 Network: Back online');
      setIsOnline(true);
      
      // If we were offline before, mark transition for sync trigger
      if (wasOffline) {
        setWasOffline(false);
      }
    }

    function handleOffline() {
      console.log('📴 Network: Gone offline');
      setIsOnline(false);
      setWasOffline(true);
    }

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return { isOnline, wasOffline };
}
