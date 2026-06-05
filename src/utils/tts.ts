/**
 * Text-to-Speech (TTS) Utility
 * Provides voice narration for accessibility and guidance
 */

interface TTSOptions {
  rate?: number;      // 0.1 to 10 (default: 1)
  pitch?: number;     // 0 to 2 (default: 1)
  volume?: number;    // 0 to 1 (default: 1)
  lang?: string;      // Language code (default: 'en-US')
}

class TextToSpeech {
  private synth: SpeechSynthesis;
  private enabled: boolean;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    // Load from localStorage
    this.enabled = localStorage.getItem('tts-enabled') === 'true';
  }

  /**
   * Check if TTS is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Enable TTS
   */
  enable(): void {
    this.enabled = true;
    localStorage.setItem('tts-enabled', 'true');
  }

  /**
   * Disable TTS
   */
  disable(): void {
    this.enabled = false;
    localStorage.setItem('tts-enabled', 'false');
    this.stop();
  }

  /**
   * Toggle TTS on/off
   */
  toggle(): boolean {
    if (this.enabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.enabled;
  }

  /**
   * Speak text with options
   */
  speak(text: string, options: TTSOptions = {}): void {
    if (!this.enabled || !text.trim()) return;

    // Cancel any ongoing speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;
    utterance.lang = options.lang || 'en-US';

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.synth.speaking) {
      this.synth.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synth.speaking;
  }
}

// Singleton instance
export const tts = new TextToSpeech();

/**
 * Predefined voice messages for different pages
 */
export const voiceMessages = {
  // Chat page
  chatWelcome: "Welcome to YouthGuide NA chat. You can ask me about jobs, training programs, internships, and scholarships in Namibia. Try asking something like: Show me jobs near me.",
  
  chatBotResponse: (response: string) => response,
  
  chatOpportunity: (title: string) => `Opportunity: ${title}`,
  
  // Profile page
  profileWelcome: "Welcome to your profile page. Here you can update your personal information, skills, and interests. This helps us recommend better opportunities for you. Fill in your details and click save when you're done.",
  
  profileSaved: "Your profile has been saved successfully. We'll use this information to find the best opportunities for you.",
  
  // Saved page
  savedWelcome: "This is your saved opportunities page. Here you can view all the opportunities you've bookmarked. Click on any opportunity to view more details or apply.",
  
  savedEmpty: "You haven't saved any opportunities yet. Go to the chat and ask about jobs, training, or scholarships. You can save interesting opportunities by clicking the bookmark icon.",
  
  savedRemoved: "Opportunity removed from your saved list.",
  
  // Demo mode
  demoLandingWelcome: "Welcome to YouthGuide NA demo mode. This is a test environment for trying out the interface without creating an account. Click Start Demo to begin exploring.",
  
  demoAuthWelcome: "This is demo mode. You can log in with any email and password - they don't need to be real. Just type something like demo at test dot com, and any password. Then click Log In to continue. This is only for testing the user interface.",
  
  demoChatWelcome: "You're now in demo mode chat. All responses are pre-programmed examples to show you how the interface works. Try asking about jobs, training, or internships to see sample results.",
  
  demoProfileWelcome: "This is the demo profile page. You can edit any fields to test the interface, but changes won't be saved. This is just to show you how the profile system works.",
  
  demoSavedWelcome: "This is the demo saved opportunities page. These are example opportunities to show you how your saved items would appear. In the real application, you'd see opportunities you actually bookmarked.",
  
  // General
  navigationHelp: "Use the menu button in the top left to navigate between pages. You can access your profile, saved opportunities, and start new conversations from there.",
  
  featureDisabled: "This feature is not available in demo mode.",
};

/**
 * Helper function to speak chat bot response
 */
export const speakChatResponse = (
  response: string,
  opportunities?: Array<{ title: string }>
) => {
  if (!tts.isEnabled()) return;

  // Speak the main response
  let fullMessage = response;

  // Add opportunity titles if any
  if (opportunities && opportunities.length > 0) {
    fullMessage += ". I found the following opportunities: ";
    fullMessage += opportunities.map(opp => opp.title).join(". ");
  }

  tts.speak(fullMessage);
};

/**
 * Helper function to speak page welcome message
 */
export const speakPageWelcome = (page: keyof typeof voiceMessages) => {
  if (!tts.isEnabled()) return;
  
  const message = voiceMessages[page];
  if (typeof message === 'string') {
    tts.speak(message);
  }
};

export default tts;
