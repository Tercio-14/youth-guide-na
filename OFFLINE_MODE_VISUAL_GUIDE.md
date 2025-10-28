# 🎨 Offline Mode Visual Guide

## What You'll See When Testing

---

### 1️⃣ **NORMAL STATE** (Online)

```
┌─────────────────────────────────────────────────────────────┐
│  ≡  YouthGuide NA                          🌙  💾  👤       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                                                               │
│   🤖  Hi! I'm YouthGuide NA. I can help you find job        │
│       opportunities and training programs in Namibia.        │
│       What are you looking for today?                        │
│                                                               │
│                                                               │
│                                                               │
│   👤  I'm looking for job opportunities                      │
│                                                               │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  💼  Jobs near me  📚  Free training  💰  Make money fast   │
├─────────────────────────────────────────────────────────────┤
│   😊  Ask me anything...                           [Send]   │ <- Green border on focus
└─────────────────────────────────────────────────────────────┘
```

**Status:** Everything normal, green colors

---

### 2️⃣ **GOING OFFLINE** (Toggle DevTools → Offline)

#### Step 1: Offline Banner Slides Down ⬇️
```
┌═════════════════════════════════════════════════════════════┐
║  ⚠️  You're currently offline. Limited functionality.       ║ <- YELLOW BANNER (animated slide-in)
║     You can browse cached opportunities and saved items.    ║
└═════════════════════════════════════════════════════════════┘
┌─────────────────────────────────────────────────────────────┐
│  ≡  YouthGuide NA                          🌙  💾  👤       │
├─────────────────────────────────────────────────────────────┤
```

#### Step 2: Toast Notification Appears 🍞
```
                  ╔═══════════════════════════════╗
                  ║  You're offline               ║ <- Toast (bottom-right or top)
                  ║  Limited functionality        ║
                  ╚═══════════════════════════════╝
```

#### Step 3: Input Changes to Yellow 🟨
```
├─────────────────────────────────────────────────────────────┤
│                  📴 Offline mode                             │ <- Small label
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║  Offline mode - Limited functionality...        [Send]║  │ <- YELLOW BORDER
│  ╚═══════════════════════════════════════════════════════╝  │
└─────────────────────────────────────────────────────────────┘
```

**Complete Offline View:**
```
┌═════════════════════════════════════════════════════════════┐
║  ⚠️  You're currently offline. Limited functionality.       ║ <- YELLOW BANNER
║     You can browse cached opportunities and saved items.    ║
└═════════════════════════════════════════════════════════════┘
┌─────────────────────────────────────────────────────────────┐
│  ≡  YouthGuide NA                          🌙  💾  👤       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│   🤖  Hi! I'm YouthGuide NA. I can help you find job        │
│       opportunities and training programs in Namibia.        │
│       What are you looking for today?                        │
│                                                               │
│   👤  I'm looking for job opportunities                      │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  💼  Jobs near me  📚  Free training  💰  Make money fast   │
├─────────────────────────────────────────────────────────────┤
│                  📴 Offline mode                             │
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║  Offline mode - Limited functionality...        [Send]║  │ <- YELLOW BORDER
│  ╚═══════════════════════════════════════════════════════╝  │
└─────────────────────────────────────────────────────────────┘
```

**Status:** Yellow warning colors, clear offline indication

---

### 3️⃣ **COMING BACK ONLINE** (Toggle DevTools → No throttling)

#### Step 1: Yellow Banner Slides Up ⬆️ (disappears)
```
                    ⬆️  Yellow banner slides away
┌─────────────────────────────────────────────────────────────┐
│  ≡  YouthGuide NA                          🌙  💾  👤       │
├─────────────────────────────────────────────────────────────┤
```

#### Step 2: Green Success Banner Appears ⬇️
```
┌═════════════════════════════════════════════════════════════┐
║  ✅  You're back online!                                    ║ <- GREEN BANNER (animated slide-in)
║     Your connection has been restored.                      ║
└═════════════════════════════════════════════════════════════┘
┌─────────────────────────────────────────────────────────────┐
│  ≡  YouthGuide NA                          🌙  💾  👤       │
├─────────────────────────────────────────────────────────────┤
```

#### Step 3: Success Toast Appears 🍞
```
                  ╔═══════════════════════════════╗
                  ║  ✅ Back online!              ║ <- Success toast
                  ║  Connection restored          ║
                  ╚═══════════════════════════════╝
```

#### Step 4: Input Returns to Normal
```
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Ask me anything...                            [Send] │  │ <- Normal border
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

#### Step 5: Green Banner Auto-Dismisses (after 5 seconds)
```
                    ⬆️  Green banner slides away
┌─────────────────────────────────────────────────────────────┐
│  ≡  YouthGuide NA                          🌙  💾  👤       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│   🤖  Hi! I'm YouthGuide NA...                               │
│                                                               │
```

**Status:** Back to normal, ready to use!

---

## 🎬 Animation Timeline

### Going Offline:
```
0.0s  →  User toggles offline in DevTools
0.1s  →  navigator.onLine changes to false
0.2s  →  Yellow banner starts sliding down
0.5s  →  Yellow banner fully visible
0.6s  →  Toast notification appears
0.8s  →  Input changes to yellow border
1.0s  →  Animation complete
```

### Coming Back Online:
```
0.0s  →  User toggles online in DevTools
0.1s  →  navigator.onLine changes to true
0.2s  →  Yellow banner starts sliding up
0.5s  →  Yellow banner gone, green banner slides down
0.8s  →  Green banner fully visible
0.9s  →  Success toast appears
1.0s  →  Input returns to normal
5.0s  →  Green banner slides up and disappears
```

**Total animation time:** ~1 second each transition

---

## 🎨 Color Reference

### Offline State (Yellow):
- **Banner Background:** `bg-yellow-50` (light) / `bg-yellow-900/20` (dark)
- **Banner Border:** `border-yellow-500/50` (light) / `border-yellow-800` (dark)
- **Banner Text:** `text-yellow-900` (light) / `text-yellow-200` (dark)
- **Input Border:** `border-yellow-400` (light) / `border-yellow-600` (dark)
- **Input Background:** `bg-yellow-50/50` (light) / `bg-yellow-900/10` (dark)
- **Label Text:** `text-yellow-600` (light) / `text-yellow-400` (dark)

### Online State (Green):
- **Banner Background:** `bg-green-50` (light) / `bg-green-900/20` (dark)
- **Banner Border:** `border-green-500/50` (light) / `border-green-800` (dark)
- **Banner Text:** `text-green-900` (light) / `text-green-200` (dark)

### Normal State (Brand Green):
- **Input Focus Border:** `border-[#25D366]` (WhatsApp green)
- **Input Focus Shadow:** `shadow-[#25D366]/10`
- **Send Button:** `bg-[#25D366]`

---

## 📱 Mobile View

### Offline on Mobile:
```
┌─────────────────────────────┐
│ ⚠️  You're offline          │ <- Slightly smaller font
│ Limited functionality       │
├─────────────────────────────┤
│  ≡  YouthGuide NA    🌙 👤 │
├─────────────────────────────┤
│                             │
│  🤖  Hi! I'm YouthGuide NA  │
│                             │
│  👤  Job opportunities       │
│                             │
├─────────────────────────────┤
│        📴 Offline mode      │
│  ┌─────────────────────┐   │
│  │ Offline mode... 📤 │   │ <- Stacked on mobile
│  └─────────────────────┘   │
└─────────────────────────────┘
```

**Responsive:** Banner text wraps, buttons stack vertically if needed

---

## 🌗 Dark Mode Examples

### Offline (Dark Mode):
```
┌═════════════════════════════════════════════════════════════┐
║  ⚠️  You're currently offline (dark bg, yellow text)        ║ <- Dark yellow theme
└═════════════════════════════════════════════════════════════┘
┌─────────────────────────────────────────────────────────────┐
│  Dark chat interface with yellow-bordered input              │
└─────────────────────────────────────────────────────────────┘
```

**Dark mode:** Uses `dark:` variants for all colors

---

## 🔔 Toast Notification Examples

### Offline Toast:
```
╔════════════════════════════╗
║  📴  You're offline        ║ <- Destructive (red) variant
║  Limited functionality     ║
╚════════════════════════════╝
```

### Online Toast:
```
╔════════════════════════════╗
║  ✅  Back online!          ║ <- Default variant
║  Connection restored       ║
╚════════════════════════════╝
```

**Duration:**
- Offline: 5 seconds
- Online: 3 seconds
- Auto-dismiss

---

## 🎯 Key Visual Elements

### Icons Used:
- 📴 `WifiOff` - Offline indicator (lucide-react)
- ✅ `Wifi` - Online indicator (lucide-react)
- ⚠️ Alert icon in banner
- ℹ️ `Info` - Additional info (lucide-react)

### Spacing:
- Banner padding: `p-4` (16px)
- Input padding: `p-2` (8px)
- Label spacing: `-top-8` (32px above input)
- Gap between elements: `gap-2` (8px)

### Border Radius:
- Banner: `rounded-none` (sharp edges, full width)
- Input: `rounded-3xl` (fully rounded)
- Buttons: `rounded-full` (circular)

---

## ✨ What Makes It Good UX

### ✅ Clear Communication:
- **Obvious:** Yellow banner impossible to miss
- **Informative:** Text explains what's happening
- **Helpful:** Tells user what they can still do

### ✅ Non-Intrusive:
- **Persistent but not blocking:** Banner doesn't cover content
- **Auto-dismiss when fixed:** Green banner goes away
- **No modal dialogs:** User can still interact with app

### ✅ Consistent:
- **Brand colors:** Yellow for warning, green for success
- **Same animation style:** Spring animations everywhere
- **Matches existing UI:** Uses same design system

### ✅ Accessible:
- **High contrast:** Text readable in all modes
- **Icon + Text:** Not relying on color alone
- **ARIA roles:** Banner has `role="alert"`

---

## 🎬 Testing Demo Script

**Say this while testing:**

1. **"Now I'm going offline..."** 
   *(Toggle offline in DevTools)*
   - Watch yellow banner slide down
   - See toast notification
   - Input changes to yellow

2. **"See the offline indicators..."**
   - Point to banner at top
   - Point to input at bottom
   - Show "Offline mode" label

3. **"Now I'm going back online..."**
   *(Toggle online in DevTools)*
   - Yellow banner slides up
   - Green banner slides down
   - Success toast appears
   - Input returns to normal

4. **"Banner auto-dismisses after 5 seconds..."**
   *(Wait and watch)*
   - Green banner slides up and disappears
   - Back to normal view

**Total demo time:** ~30 seconds

---

## 🎉 Congratulations!

You now have a **fully functional offline detection system** with:
- ✅ Beautiful animations
- ✅ Clear visual indicators
- ✅ User-friendly messages
- ✅ Responsive design
- ✅ Dark mode support

**Ready to test!** 🚀
