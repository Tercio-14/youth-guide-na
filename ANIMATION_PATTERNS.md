# YouthGuide NA - Animation Patterns Reference

## Quick Reference for Animation Patterns

### 🎬 Entrance Animations

#### Slide from Left (Bot Messages)
```typescript
initial={{ x: -50, opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
```

#### Slide from Right (User Messages)
```typescript
initial={{ x: 50, opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
```

#### Fade and Scale (Cards, Containers)
```typescript
initial={{ scale: 0.95, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
```

#### Pop In (Badges, Small Elements)
```typescript
initial={{ scale: 0, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ type: "spring", stiffness: 200 }}
```

---

### ⏱️ Timing Patterns

#### Staggered Children
```typescript
// Parent renders children with delays
{items.map((item, index) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 0.1 + index * 0.05 }}
  >
    {item}
  </motion.div>
))}
```

#### Sequential Sections
```typescript
// Section 1: delay: 0.3
// Section 2: delay: 0.4
// Section 3: delay: 0.6
// Section 4: delay: 0.7
// Button: delay: 0.8
```

---

### 🖱️ Interaction Animations

#### Hover Scale
```typescript
whileHover={{ scale: 1.05 }}
className="transition-all duration-200"
```

#### Tap Feedback
```typescript
whileTap={{ scale: 0.95 }}
```

#### Focus State
```typescript
className="focus:scale-[1.02] transition-all duration-200"
```

---

### 🎨 WhatsApp-Style Elements

#### User Message Bubble
```typescript
<motion.div
  initial={{ x: 50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  className="bg-[#25D366] text-white rounded-2xl rounded-tr-sm px-4 py-3"
>
  {message}
</motion.div>
```

#### Bot Message Bubble
```typescript
<motion.div
  initial={{ x: -50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  className="bg-white border rounded-2xl rounded-tl-sm px-4 py-3"
>
  {message}
</motion.div>
```

#### Typing Dots
```typescript
{[0, 1, 2].map((i) => (
  <motion.div
    key={i}
    className="h-2 w-2 bg-muted-foreground rounded-full"
    animate={{ y: [0, -8, 0] }}
    transition={{
      duration: 0.6,
      repeat: Infinity,
      delay: i * 0.15
    }}
  />
))}
```

---

### 🎯 Component-Specific Patterns

#### Profile Form Sections
```typescript
// Name input: delay 0.3
// Age brackets: delay 0.4, children +0.05 each
// Skills: delay 0.6, badges +0.03 each  
// Interests: delay 0.7, badges +0.03 each
// Submit: delay 0.8
```

#### Saved Opportunity Cards
```typescript
{opportunities.map((opp, index) => (
  <motion.div
    initial={{ x: -50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card />
  </motion.div>
))}
```

#### Chat Messages
```typescript
// Messages animate in as they're added
// Use isLast prop to determine if should animate
<AnimatedMessage
  role={role}
  text={text}
  timestamp={timestamp}
  isLast={isLastMessage}
/>
```

---

### 🎪 Spring Physics Settings

#### Bouncy (Badges, Icons)
```typescript
transition={{ 
  type: "spring", 
  stiffness: 200, 
  damping: 15 
}}
```

#### Smooth (Cards, Containers)
```typescript
transition={{ 
  type: "spring", 
  stiffness: 150, 
  damping: 20 
}}
```

#### Gentle (Large Elements)
```typescript
transition={{ 
  type: "spring", 
  stiffness: 100, 
  damping: 25 
}}
```

---

### 🎨 Color Variables

```typescript
// WhatsApp Green
const WHATSAPP_GREEN = "#25D366";

// Use in components
className="bg-[#25D366]" // User bubble background
className="text-[#25D366]" // Send button, accents
className="border-[#25D366]" // Active states

// Bot Avatar Gradient
className="bg-gradient-to-br from-blue-500 to-purple-600"
```

---

### 📐 Scale Values

```typescript
// Resting state
scale: 1

// Hover (buttons, cards)
scale: 1.05

// Tap/Click
scale: 0.95

// Focus (inputs)
scale: 1.02

// Entrance (starting hidden)
scale: 0 or 0.8 or 0.9
```

---

### ⚡ Performance Tips

1. **Use transform/opacity only** - GPU accelerated
2. **Avoid animating layout properties** - Causes reflow
3. **Use `will-change` sparingly** - Memory cost
4. **Respect prefers-reduced-motion** - Accessibility

```typescript
// Good ✅
animate={{ x: 100, opacity: 0.5 }}

// Bad ❌ (causes reflow)
animate={{ width: "100%", height: 200 }}
```

---

### 🔄 AnimatePresence Patterns

#### List Items (Add/Remove)
```typescript
<AnimatePresence mode="popLayout">
  {items.map(item => (
    <motion.div
      key={item.id}
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
    >
      {item}
    </motion.div>
  ))}
</AnimatePresence>
```

#### Conditional Rendering
```typescript
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

---

### 🎯 Common Use Cases

#### Header Animation
```typescript
<motion.header
  initial={{ y: -20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
>
  {/* header content */}
</motion.header>
```

#### Card Hover Effect
```typescript
<motion.div
  whileHover={{ y: -4, scale: 1.02 }}
  className="shadow-soft hover:shadow-medium"
>
  <Card />
</motion.div>
```

#### Button Loading State
```typescript
<Button disabled={loading}>
  {loading ? (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1 }}
    >
      ⏳
    </motion.div>
  ) : "Submit"}
</Button>
```

#### Empty State
```typescript
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: "spring", stiffness: 200 }}
>
  <EmptyIcon className="w-16 h-16" />
  <p>No items yet</p>
</motion.div>
```

---

### 📱 Mobile Considerations

```typescript
// Reduce motion on mobile for performance
const isMobile = window.innerWidth < 768;

<motion.div
  initial={{ x: isMobile ? 0 : -50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: isMobile ? 0.2 : 0.3 }}
>
  {content}
</motion.div>
```

---

### 🎨 Gradient Patterns

#### Bot Avatar
```typescript
className="bg-gradient-to-br from-blue-500 to-purple-600"
```

#### Button (Warm)
```typescript
className="bg-gradient-warm" // Uses gradient-warm from index.css
```

#### Background
```typescript
className="bg-gradient-hero" // Uses gradient-hero from index.css
```

---

## 🎓 Learning Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Principles](https://material.io/design/motion)
- [Easing Functions](https://easings.net/)
- [Spring Physics](https://www.framer.com/motion/transition/#spring)

---

*Quick reference for consistent animations across YouthGuide NA*
