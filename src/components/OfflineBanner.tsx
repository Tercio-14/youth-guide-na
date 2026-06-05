import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff, Wifi, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOffline } from "@/contexts/OfflineContext";
import { useToast } from "@/hooks/use-toast";

/**
 * OfflineBanner Component
 * 
 * Displays a persistent banner at the top of the screen when the user goes offline.
 * Shows a temporary success message when connectivity is restored.
 * 
 * Features:
 * - Animated slide-in/out transitions
 * - Toast notifications for offline/online transitions
 * - Auto-dismissing reconnection banner (5 seconds)
 * - Integrates with OfflineContext for consistent state management
 */
export function OfflineBanner() {
  const { isOffline } = useOffline();
  const isOnline = !isOffline;
  const { toast } = useToast();
  const [showReconnected, setShowReconnected] = useState(false);
  const [hasShownOfflineToast, setHasShownOfflineToast] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  // Track offline state changes
  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    }
  }, [isOnline]);

  // Handle offline transition
  useEffect(() => {
    if (!isOnline && !hasShownOfflineToast) {
      toast({
        title: "You're offline",
        description: "You're now using offline mode. Simulated responses and cached data available.",
        variant: "destructive",
        duration: 5000,
      });
      setHasShownOfflineToast(true);
    }
  }, [isOnline, hasShownOfflineToast, toast]);

  // Handle reconnection
  useEffect(() => {
    if (isOnline && wasOffline && hasShownOfflineToast) {
      // Show reconnected banner
      setShowReconnected(true);
      
      // Show success toast
      toast({
        title: "Back online!",
        description: "Your connection has been restored. Online features are now available.",
        duration: 3000,
      });

      // Hide reconnected banner after 5 seconds
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setHasShownOfflineToast(false); // Reset for next offline event
        setWasOffline(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline, hasShownOfflineToast, toast]);

  const slideAnimation = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 },
    transition: { 
      type: "spring" as const, 
      stiffness: 300, 
      damping: 30 
    }
  };

  return (
    <AnimatePresence mode="wait">
      {/* Offline Banner */}
      {!isOnline && (
        <motion.div
          key="offline-banner"
          {...slideAnimation}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <Alert variant="warning" className="rounded-none border-x-0 border-t-0">
            <WifiOff className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span className="font-medium">
                You're in offline mode. Chat will provide simulated responses and show cached opportunities.
                Your saved items will sync when you're back online.
              </span>
              <Info className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Reconnected Banner */}
      {showReconnected && isOnline && (
        <motion.div
          key="reconnected-banner"
          {...slideAnimation}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <Alert variant="success" className="rounded-none border-x-0 border-t-0">
            <Wifi className="h-4 w-4" />
            <AlertDescription>
              <span className="font-medium">
                You're back online! Your connection has been restored.
              </span>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
