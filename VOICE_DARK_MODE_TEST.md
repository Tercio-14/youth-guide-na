# Voice Narration & Dark Mode - Quick Test Guide

## Test Environment
- **Frontend URL**: http://localhost:8080
- **Demo Mode URL**: http://localhost:8080/demo

## Prerequisites
✅ Frontend must be running (Vite dev server)
✅ Browser with Web Speech API support (Chrome, Edge, Safari, Firefox)
✅ System audio enabled

## Quick Test (5 minutes)

### 1. Voice Narration - Chat Interface

```bash
# Navigate to demo chat
http://localhost:8080/demo/chat
```

**Test Steps**:
1. Look for **volume icon** (🔊) in top-right header (next to "New Chat" button)
2. Click the volume icon
   - Should see green pulse indicator appear
   - Should hear: "Voice narration enabled"
   - Should see toast notification
3. Send a chat message: "Show me jobs in Windhoek"
   - Wait for bot response
   - Should hear the AI response spoken aloud
4. Click volume icon again to disable
   - Green pulse disappears
   - Should hear: "Voice narration disabled"

**Expected Behavior**:
- ✅ Voice toggle button visible
- ✅ Icon changes: Volume2 (enabled) ↔ VolumeX (disabled)
- ✅ Green pulse when enabled
- ✅ Toast notifications on toggle
- ✅ Chat responses spoken when enabled

### 2. Page Welcome Messages

**Landing Page**:
```bash
http://localhost:8080/demo
```
- Enable voice first if not enabled
- Refresh page
- Should hear: "Welcome to YouthGuide NA demo mode..."

**Auth Page**:
```bash
http://localhost:8080/demo/auth
```
- Should hear: "This is demo mode. You can log in with any email..."

**Profile Page**:
```bash
http://localhost:8080/demo/profile
```
- Should hear: "Welcome to your profile page. Here you can update..."

**Saved Page**:
```bash
http://localhost:8080/demo/saved
```
- Should hear: "This is the demo saved opportunities page..."

### 3. Dark Mode Toggle

**Test on Any Demo Page**:
1. Look for **sun/moon icon** (☀️/🌙) in top-right corner
2. Click to toggle theme
3. Verify:
   - Background changes light ↔ dark
   - Text color adjusts automatically
   - Button styles update
4. Navigate to different demo page
   - Theme should persist
5. Refresh page
   - Theme should remain the same

**Test URLs**:
```bash
http://localhost:8080/demo         # Landing
http://localhost:8080/demo/auth    # Auth
http://localhost:8080/demo/chat    # Chat
http://localhost:8080/demo/profile # Profile
http://localhost:8080/demo/saved   # Saved
```

### 4. Persistence Test

**Voice Setting**:
1. Enable voice on chat page
2. Refresh browser (Ctrl+R / Cmd+R)
3. Verify: Voice still enabled (green pulse visible)
4. Navigate to profile page
5. Verify: Voice setting persists

**Dark Mode Setting**:
1. Enable dark mode on chat page
2. Refresh browser
3. Verify: Dark mode still active
4. Navigate to profile page
5. Verify: Dark mode persists

## Full Test Checklist

### Voice Narration ✓

- [ ] Volume icon appears in DemoChat header
- [ ] Icon changes when toggled (Volume2 ↔ VolumeX)
- [ ] Green pulse indicator shows when enabled
- [ ] Toast notification on enable/disable
- [ ] Landing page welcome message plays
- [ ] Auth page welcome message plays
- [ ] Chat page welcome message plays
- [ ] Profile page welcome message plays
- [ ] Saved page welcome message plays
- [ ] Chat responses are spoken aloud
- [ ] Opportunity titles announced in chat
- [ ] Voice setting persists on refresh
- [ ] Voice setting persists across pages
- [ ] Speech stops when navigating away

### Dark Mode ✓

- [ ] Theme toggle appears on Landing page
- [ ] Theme toggle appears on Auth page
- [ ] Theme toggle appears on Chat page
- [ ] Theme toggle appears on Profile page
- [ ] Theme toggle appears on Saved page
- [ ] Icon changes on toggle (Sun ↔ Moon)
- [ ] Background color changes
- [ ] Text color adjusts properly
- [ ] Buttons adjust to theme
- [ ] Cards adjust to theme
- [ ] Theme persists on refresh
- [ ] Theme persists across pages

## Browser Testing

Test in multiple browsers to verify compatibility:

### Chrome/Edge
```bash
# Usually works best with Web Speech API
# Voice selection may vary by OS
```

### Firefox
```bash
# Works well, may have slight delays
```

### Safari
```bash
# macOS/iOS: Good support
# Voice options may be limited
```

## Troubleshooting

### Voice Not Working

**Check localStorage**:
```javascript
// Open browser console
localStorage.getItem('tts-enabled')
// Should return "true" when enabled
```

**Clear TTS State**:
```javascript
// If voice is stuck, clear state
localStorage.removeItem('tts-enabled')
// Refresh page and re-enable
```

**Check Speech Synthesis**:
```javascript
// Test if browser supports TTS
if ('speechSynthesis' in window) {
  console.log('TTS supported');
  window.speechSynthesis.getVoices();
} else {
  console.log('TTS not supported');
}
```

### Dark Mode Not Working

**Check Theme Setting**:
```javascript
// Open browser console
localStorage.getItem('vite-ui-theme')
// Should return "dark" or "light"
```

**Clear Theme State**:
```javascript
// Reset theme
localStorage.removeItem('vite-ui-theme')
// Refresh page
```

**Check CSS Variables**:
```javascript
// Inspect root element
document.documentElement.classList.contains('dark')
// Should return true in dark mode
```

## Test Results Template

```markdown
## Test Results - [Date]

### Environment
- Browser: Chrome 120 / Firefox 121 / Safari 17
- OS: Windows 11 / macOS 14 / Ubuntu 22.04
- Frontend: http://localhost:8080

### Voice Narration
- Toggle button: ✅ / ❌
- Welcome messages: ✅ / ❌
- Chat responses: ✅ / ❌
- Persistence: ✅ / ❌
- Notes: _____

### Dark Mode
- Toggle button: ✅ / ❌
- Theme switching: ✅ / ❌
- Persistence: ✅ / ❌
- Cross-page: ✅ / ❌
- Notes: _____

### Issues Found
- Issue 1: _____
- Issue 2: _____

### Overall Status
✅ All tests passed
⚠️ Minor issues
❌ Critical issues
```

## Performance Check

### Voice Narration Performance:
- No API calls (client-side only)
- Speech synthesis is non-blocking
- UI remains responsive during speech
- Page load time: No impact (<1ms overhead)

### Dark Mode Performance:
- CSS custom properties (instant switching)
- No re-render needed (CSS-only change)
- localStorage write: <1ms
- Page load time: No impact

## Accessibility Verification

### Voice Features:
- ✅ Clear enable/disable control
- ✅ Visual indicator (green pulse)
- ✅ Keyboard accessible (Tab to button, Enter to activate)
- ✅ Screen reader compatible (button has aria-label)

### Dark Mode:
- ✅ Sufficient contrast in both themes
- ✅ WCAG AA compliant colors
- ✅ No color-only indicators
- ✅ Icons visible in both themes

## Next Steps After Testing

If all tests pass:
1. ✅ Commit changes
2. ✅ Update main documentation
3. ✅ Deploy to staging (if applicable)
4. ✅ User acceptance testing

If issues found:
1. Document issues in GitHub Issues
2. Fix critical issues first
3. Re-test after fixes
4. Update this guide with known issues

---

**Quick Command to Run Frontend**:
```bash
cd youth-guide-na
npm run dev
```

**Test URLs**:
- Landing: http://localhost:8080/demo
- Auth: http://localhost:8080/demo/auth  
- Chat: http://localhost:8080/demo/chat
- Profile: http://localhost:8080/demo/profile
- Saved: http://localhost:8080/demo/saved

---

**Last Updated**: January 2025
