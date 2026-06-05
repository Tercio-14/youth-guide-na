/**
 * Voice Toggle Button
 * Button to enable/disable text-to-speech narration
 */

import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";
import { tts } from "@/utils/tts";
import { toast } from "sonner";

interface VoiceToggleProps {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export const VoiceToggle = ({ 
  variant = "ghost", 
  size = "icon",
  showLabel = false 
}: VoiceToggleProps) => {
  const [isEnabled, setIsEnabled] = useState(tts.isEnabled());

  useEffect(() => {
    // Sync state with TTS service
    setIsEnabled(tts.isEnabled());
  }, []);

  const handleToggle = () => {
    const newState = tts.toggle();
    setIsEnabled(newState);
    
    if (newState) {
      toast.success("Voice narration enabled");
      tts.speak("Voice narration is now on. I will read messages out loud.");
    } else {
      toast.info("Voice narration disabled");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      className="relative"
      title={isEnabled ? "Disable voice narration" : "Enable voice narration"}
    >
      {isEnabled ? (
        <Volume2 className={size === "icon" ? "h-5 w-5" : "h-4 w-4"} />
      ) : (
        <VolumeX className={size === "icon" ? "h-5 w-5" : "h-4 w-4"} />
      )}
      {showLabel && (
        <span className="ml-2">
          {isEnabled ? "Voice On" : "Voice Off"}
        </span>
      )}
      {isEnabled && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      )}
    </Button>
  );
};
