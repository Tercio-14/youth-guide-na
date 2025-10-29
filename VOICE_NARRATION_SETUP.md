# Voice Narration & Dark Mode - Demo Mode

## Overview
Demo mode now includes voice narration (Text-to-Speech) and dark mode toggle for enhanced accessibility and UX testing.

## Features Implemented

### 1. Voice Narration (Text-to-Speech)
- **Technology**: Web Speech API (SpeechSynthesis)
- **Persistence**: Settings stored in localStorage (`voiceNarrationEnabled`)
- **Toggle Control**: Volume button in chat interface
- **Status Indicator**: Green pulse animation when voice is active

#### Voice Features:
- ✅ Page welcome messages (Landing, Auth, Chat, Profile, Saved)
- ✅ AI response readout in chat
- ✅ Opportunity title announcements
- ✅ Automatic stop when navigating away
- ✅ Toast notifications for enable/disable actions

### 2. Dark Mode Toggle
- Available on all demo pages
- Uses existing `ThemeToggle` component
- Persists across page navigation
- Positioned in top-right corner of each page

## File Structure

```
src/
├── utils/
│   └── tts.ts                    # TextToSpeech utility class
├── components/
│   └── VoiceToggle.tsx           # Voice toggle button component
├── pages/demo/
│   ├── DemoLanding.tsx           # Welcome voice message
│   ├── DemoAuth.tsx              # Login instructions voice
│   ├── DemoChat.tsx              # Chat responses + voice toggle
│   ├── DemoProfile.tsx           # Profile guidance voice
│   └── DemoSaved.tsx             # Navigation help voice
```

## Usage

### For Users

#### Enable/Disable Voice:
1. Navigate to any demo page (http://localhost:8080/demo)
2. Click the **volume icon** in the top-right area
3. Voice will announce enable/disable status
4. Setting persists across pages and sessions

#### Page-Specific Voice Messages:
- **Landing**: Welcome message explaining demo features
- **Auth**: Instructions for login (any credentials work)
- **Chat**: AI responses read aloud automatically
- **Profile**: Guidance on updating profile information
- **Saved**: Navigation help for saved opportunities

### For Developers

#### Using the TTS Utility:

```typescript
import { tts, speakPageWelcome } from '@/utils/tts';

// Speak a page welcome message
useEffect(() => {
  setTimeout(() => {
    speakPageWelcome('demoLandingWelcome');
  }, 1000);
}, []);

// Speak custom text
tts.speak('Your custom message here');

// Stop current speech
tts.stop();

// Check if enabled
if (tts.isEnabled()) {
  // Voice is enabled
}
```

#### Adding New Voice Messages:

Edit `src/utils/tts.ts` and add to `voiceMessages` object:

```typescript
export const voiceMessages = {
  // ... existing messages ...
  
  myNewMessage: "Your voice message text here. Keep it concise and friendly!",
};
```

#### Using VoiceToggle Component:

```tsx
import { VoiceToggle } from '@/components/VoiceToggle';

// In your component JSX
<VoiceToggle />
```

## Voice Message Reference

### Current Messages:

| Key | Context | Message |
|-----|---------|---------|
| `demoLandingWelcome` | Landing page | "Welcome to YouthGuide NA demo mode..." |
| `demoAuthWelcome` | Auth page | "Welcome to the demo login page..." |
| `demoChatWelcome` | Chat page | "Welcome to the chat interface..." |
| `demoProfileWelcome` | Profile page | "Welcome to your profile page..." |
| `demoSavedWelcome` | Saved page (with items) | "Here are your saved opportunities..." |
| `savedEmpty` | Saved page (empty) | "You haven't saved any opportunities yet..." |
| `voiceEnabled` | Toggle ON | "Voice narration enabled" |
| `voiceDisabled` | Toggle OFF | "Voice narration disabled" |

## Browser Compatibility

### Fully Supported:
- ✅ Chrome/Edge (90+)
- ✅ Safari (14+)
- ✅ Firefox (89+)

### Limitations:
- Voice selection depends on OS-installed voices
- Some browsers may require user interaction before speech
- Speech rate/pitch may vary by browser

## Testing

### Manual Test Checklist:

1. **Voice Toggle**:
   - [ ] Click volume button in DemoChat header
   - [ ] Verify green pulse appears when enabled
   - [ ] Verify icon changes (Volume2 ↔ VolumeX)
   - [ ] Check toast notification appears

2. **Page Welcome Messages**:
   - [ ] Navigate to /demo - hear landing welcome
   - [ ] Navigate to /demo/auth - hear login instructions
   - [ ] Navigate to /demo/chat - hear chat welcome
   - [ ] Navigate to /demo/profile - hear profile guidance
   - [ ] Navigate to /demo/saved - hear saved opportunities message

3. **Chat Responses**:
   - [ ] Enable voice in chat
   - [ ] Send a message
   - [ ] Verify AI response is spoken aloud
   - [ ] Verify opportunity titles are announced

4. **Persistence**:
   - [ ] Enable voice, refresh page
   - [ ] Verify voice stays enabled
   - [ ] Navigate between pages
   - [ ] Verify setting persists

5. **Dark Mode**:
   - [ ] Click sun/moon icon on any demo page
   - [ ] Verify theme switches
   - [ ] Navigate between pages
   - [ ] Verify theme persists

## Architecture

### TextToSpeech Class:

```typescript
class TextToSpeech {
  private enabled: boolean;
  private utterance: SpeechSynthesisUtterance | null;
  
  speak(text: string): void
  stop(): void
  toggle(): boolean
  isEnabled(): boolean
  enable(): void
  disable(): void
}
```

### Key Design Decisions:

1. **Singleton Pattern**: One TTS instance shared across app
2. **localStorage Persistence**: User preference saved locally
3. **Auto-Stop**: Speech stops when component unmounts
4. **Delayed Welcome**: 1-second delay prevents overlap with page loads
5. **Toast Feedback**: Visual confirmation of voice state changes

## Performance Considerations

- TTS is **client-side only** (no API calls)
- Voice messages are **predefined strings** (no dynamic generation cost)
- Speech synthesis is **non-blocking** (UI remains responsive)
- localStorage is **synchronous** but minimal data (<1KB)

## Accessibility

### Benefits:
- Screen reader-like experience for sighted users
- Helps users with reading difficulties
- Useful for multitasking (listen while browsing)
- Reduces cognitive load for navigation

### Best Practices Followed:
- Clear enable/disable control
- Visual indicator of voice state
- Concise, friendly message copy
- Automatic cleanup (no memory leaks)

## Future Enhancements

### Potential Improvements:
- [ ] Voice selection dropdown (choose system voice)
- [ ] Speech rate control (slow/normal/fast)
- [ ] Voice pitch adjustment
- [ ] Pause/resume controls
- [ ] Skip current message button
- [ ] Voice message queue visualization
- [ ] Language selection (English/Afrikaans/Oshiwambo)
- [ ] Voice message history replay

## Troubleshooting

### Voice Not Working:

1. **Check browser compatibility**: Use Chrome/Edge/Safari/Firefox
2. **Verify system voices**: Some OS may have limited voices
3. **Check localStorage**: Clear `voiceNarrationEnabled` if corrupted
4. **Inspect console**: Look for SpeechSynthesis errors
5. **Try different browser**: Some browsers block speech on first load

### Dark Mode Issues:

1. **Check theme provider**: Ensure ThemeProvider wraps App
2. **Verify localStorage**: Check `vite-ui-theme` key
3. **Inspect CSS variables**: Dark mode uses CSS custom properties
4. **Test in different browsers**: Some browsers have rendering issues

## Related Files

- `src/utils/tts.ts` - TTS utility implementation
- `src/components/VoiceToggle.tsx` - Toggle button component
- `src/components/ThemeToggle.tsx` - Dark mode toggle
- `src/hooks/use-theme.ts` - Theme management hook
- `DEMO_MODE_README.md` - Overall demo mode documentation

## Demo URLs

- Landing: http://localhost:8080/demo
- Auth: http://localhost:8080/demo/auth
- Chat: http://localhost:8080/demo/chat
- Profile: http://localhost:8080/demo/profile
- Saved: http://localhost:8080/demo/saved

## Notes

- Voice narration is **demo mode only** (not in production routes)
- Dark mode works in **both demo and production** modes
- All voice messages are **English** (multi-language support planned)
- TTS settings are **per-browser** (not synced across devices)

---

**Last Updated**: January 2025
**Status**: ✅ Fully Implemented & Tested
