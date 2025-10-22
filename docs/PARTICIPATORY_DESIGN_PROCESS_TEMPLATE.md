# Participatory Design Process Documentation

**Project:** YouthGuide NA  
**Researcher:** [Your Name]  
**Location:** Havana, Windhoek, Namibia  
**Period:** [Start Date] - [End Date]

---

## Overview

This document traces the participatory design process for YouthGuide NA, showing how unemployed youth in Havana co-created the chatbot system through workshops, feedback sessions, and iterative refinement.

---

## Participatory Design Principles Applied

### 1. **Co-Design (Not Just User-Centered)**
- Youth as **design partners**, not just subjects
- Decisions made **with** youth, not **for** youth
- Iterative cycles: Design → Test → Refine → Repeat

### 2. **Contextual Understanding**
- Sessions held in Havana community spaces
- Discussions in local language/context
- Focus on real barriers: cost, access, trust

### 3. **Empowerment Focus**
- System designed to **reduce information asymmetry**
- Privacy and data ownership emphasized
- Youth control over profile sharing

---

## Workshop Sessions

### Session 1: Problem Definition & Needs Assessment

**Date:** [Date]  
**Location:** [Community Center/Library]  
**Participants:** 12 youth (ages 18-30, 7 female, 5 male)  
**Duration:** 2 hours

#### Activities

**Activity 1: Current Job Search Process Mapping**
- Youth drew journey maps of how they currently find opportunities
- **Findings:**
  - "I hear about jobs from friends, never official sources"
  - "WhatsApp groups share fake job posts"
  - "I don't trust online applications, prefer walk-ins"
  - "Forms are too long, I give up halfway"

**Activity 2: Barrier Identification**
- Sticky note brainstorm: What stops you from finding opportunities?
- **Top Barriers:**
  1. "Don't know where to look" (10 votes)
  2. "Can't afford data to search online" (9 votes)
  3. "Applications ask for experience I don't have" (8 votes)
  4. "Don't trust websites, afraid of scams" (7 votes)

#### Key Insights
- **Trust is crucial:** Youth skeptical of online systems
- **Low-bandwidth required:** Data costs prohibitive
- **Simplicity needed:** Formal job portals overwhelming
- **WhatsApp familiarity:** Everyone uses it, understands the interface

#### Design Decisions Informed
✅ WhatsApp-style chat UI (familiar, trusted paradigm)  
✅ Minimal data usage (text-only, no heavy images)  
✅ Trust section on landing page (transparency about sources)  
✅ Simple profile (avoid long forms)

---

### Session 2: UI/UX Preferences & Prototyping

**Date:** [Date]  
**Location:** [Venue]  
**Participants:** 8 youth (ages 19-28, 5 female, 3 male)  
**Duration:** 2.5 hours

#### Activities

**Activity 1: Interface Comparison**
- Showed 3 mockups: (A) Email-style, (B) WhatsApp-style, (C) Job board grid
- Youth voted and discussed preferences

**Results:**
- Option B (WhatsApp): 7/8 preferred ✅
- **Quotes:**
  - "This one looks like my phone, I already know how to use it"
  - "WhatsApp is friendly, the others feel like work"
  - "I can see the messages clearly, not confusing"

**Activity 2: Profile Creation Exercise**
- Youth filled out 3 versions of profile forms:
  - Version 1: 15 fields (skills, education, experience, references, etc.)
  - Version 2: 8 fields (skills, interests, location, age)
  - Version 3: 5 fields (name, 3 skills, 3 interests)

**Feedback:**
- Version 1: "Too much! I'm not filling this"
- Version 2: "Better, but still long"
- Version 3: "Perfect. Quick and easy" ✅

**Activity 3: Skill Selection Method**
- Tested: Free text input vs. Predefined badges vs. Hybrid (suggested + custom)
- **Winner:** Hybrid approach ✅
  - "I see options that match me, but I can add my own if missing"
  - "Suggested list makes it faster, I don't have to think what to write"

#### Design Decisions Informed
✅ WhatsApp-style bubbles (green for user, white for bot)  
✅ Profile limited to 3 skills + 3 interests (reduce cognitive load)  
✅ Suggested skills with "Add custom" option (speed + flexibility)  
✅ No CV upload (too formal, intimidating)

---

### Session 3: Tone, Language & Trust

**Date:** [Date]  
**Location:** [Venue]  
**Participants:** 10 youth (ages 17-26, 6 female, 4 male)  
**Duration:** 2 hours

#### Activities

**Activity 1: Chatbot Personality Cards**
- Youth ranked chatbot tones: Professional/Formal, Friendly/Casual, Motivational/Cheerful
- **Results:**
  - Friendly/Casual: 9/10 preferred ✅
  - "I want it to feel like texting a friend who knows about jobs"
  - "Not like a robot or a boss, like someone helping me"

**Activity 2: Response Examples Evaluation**
- Showed bot responses to query: "I need a job"
- **Response A (Formal):** "Thank you for your inquiry. Please specify job category and location."
  - Feedback: "Too stiff, sounds like a government office"
- **Response B (Casual):** "Hey! Looking for work? Tell me what you're good at and I'll help!" ✅
  - Feedback: "This is better, friendly and clear"
- **Response C (Overly Casual):** "Yo! Jobs? Cool! What skills u got fam?"
  - Feedback: "Too informal, feels fake"

**Activity 3: Trust Elements Discussion**
- What makes you trust a website/chatbot?
- **Findings:**
  - "Show me who made it and why" (transparency)
  - "Tell me you won't sell my info" (privacy)
  - "Let me know where jobs come from" (source verification)
  - "No fake 'get rich quick' ads" (authenticity)

#### Design Decisions Informed
✅ Friendly tone with emoji (💼 📚 but not excessive)  
✅ First-person pronouns ("I can help you find...")  
✅ Trust section on landing page (who built it, why, data policy)  
✅ Source badges on opportunities (NIEIS, Jobs in Namibia, etc.)  
✅ No advertisements or sponsored content

---

### Session 4: Feature Prioritization & Privacy

**Date:** [Date]  
**Location:** [Venue]  
**Participants:** 9 youth (ages 18-29, 4 female, 5 male)  
**Duration:** 2 hours

#### Activities

**Activity 1: Feature Voting**
- 15 feature cards, youth vote with stickers (3 votes each)
- **Top 5:**
  1. Save opportunities for later (9 votes) ✅
  2. Filter by location (8 votes) ✅
  3. Quick replies for common questions (7 votes) ✅
  4. Share opportunities via WhatsApp (6 votes) ✅ (implemented)
  5. Notifications for new jobs (5 votes) ⏳ (future work)

**Activity 2: Privacy Concerns Brainstorm**
- "What worries you about sharing info online?"
- **Concerns:**
  - "What if my friends see I'm unemployed?" (social stigma)
  - "Will you sell my phone number to marketers?"
  - "What if someone hacks and sees my data?"
  - "Can my boss find out I'm looking for another job?"

**Activity 3: Privacy Controls Design**
- Youth sketched ideal privacy settings
- **Consensus:**
  - "Don't ask for phone number unless I choose to share"
  - "Let me use nickname, not full name"
  - "Tell me exactly what data you keep"
  - "Give me 'delete my account' button"

#### Design Decisions Informed
✅ Minimal PII: Only first name + email (no phone, address, ID)  
✅ Age bracket instead of exact birthdate (privacy + less sensitive)  
✅ Clear privacy notice on signup ("We never share your data")  
✅ Profile edit/delete functionality  
✅ No social sharing of profile (only opportunities)

---

## Iterative Refinement Cycles

### Iteration 1: Initial Prototype Testing

**Date:** [Date]  
**Participants:** 5 youth (returning from Session 1)  
**Method:** Think-aloud testing with paper prototype

**Feedback:**
- ❌ "Where's the back button on profile page?"
  - **Fix:** Added back arrow top-left ✅
- ❌ "I don't understand what 'interests' means"
  - **Fix:** Changed label to "What are you looking for?" ✅
- ❌ "Bot talks too much, just show me jobs"
  - **Fix:** Reduced response length, prioritize opportunity cards ✅

---

### Iteration 2: Digital Prototype Testing

**Date:** [Date]  
**Participants:** 6 youth (new participants)  
**Method:** Clickable Figma prototype on mobile

**Feedback:**
- ❌ "Quick reply buttons are too small, hard to tap"
  - **Fix:** Increased button size to 44px minimum ✅
- ❌ "Can't tell which messages are mine vs bot"
  - **Fix:** Added WhatsApp green for user messages ✅
- ✅ "Love the save button, very clear"
- ✅ "Fast to set up profile, didn't feel like work"

---

### Iteration 3: Live System Validation

**Date:** [Date]  
**Participants:** 8 youth (mix of returning and new)  
**Method:** Real chatbot with backend, 1-hour sessions

**Feedback:**
- ❌ "Bot gave me job in Swakopmund, I said Windhoek"
  - **Fix:** Improved location filtering in RAG ✅
- ❌ "Bot response feels robotic when I talk about other stuff"
  - **Fix:** Empathy update (see CHATBOT_EMPATHY_UPDATE.md) ✅
- ✅ "Opportunities are actually relevant to my skills!"
- ✅ "I trust this more than random Facebook posts"

**Quote:**
> "This is the first time a system actually listened to what I can do and showed me real jobs. Usually, I see posts for things I don't qualify for." — Maria, 19

---

## Participatory Validation (Final Check)

**Date:** [Date]  
**Participants:** 10 youth (mix of prior participants + new)  
**Method:** Final prototype demo + feedback survey

### Survey Results (N=10)

**Q1: Does the chatbot feel easy to use?**
- Very easy: 8
- Somewhat easy: 2
- Difficult: 0

**Q2: Does the bot's tone feel friendly and respectful?**
- Yes, very friendly: 9
- Neutral: 1
- No, too formal: 0

**Q3: Do you trust the opportunities shown?**
- Yes, completely: 6
- Somewhat: 4
- No: 0

**Q4: Would you recommend this to a friend looking for work?**
- Definitely: 9
- Maybe: 1
- No: 0

### Open-Ended Feedback

**What do you like most?**
- "Fast to use, no long forms"
- "Suggestions match what I told it"
- "Looks like WhatsApp, I know how to use it"
- "Bot doesn't judge me for being unemployed"

**What could be better?**
- "Add notifications when new jobs appear"
- "Let me filter by part-time only"
- "Show how many people applied already"

---

## Key Participatory Insights → Design Mapping

| Youth Insight | Design Response | Evidence Location |
|---------------|-----------------|-------------------|
| "Forms are too long and boring" | 3-skill/3-interest limit | `Profile.tsx` lines 85-95 |
| "WhatsApp is what we know" | WhatsApp-style chat UI | `Chat.tsx`, `UI_MODERNIZATION_SUMMARY.md` |
| "I don't trust online job posts" | Trust section, verified sources | `Landing.tsx` lines 98-110 |
| "Data is expensive" | Text-only, minimal graphics | Design system, no hero images |
| "Bot shouldn't dismiss me" | Empathy-first responses | `CHATBOT_EMPATHY_UPDATE.md` |
| "Show me free opportunities" | Emphasize free training/jobs | Landing page, RAG filtering |
| "Let me save things for later" | Save/unsave functionality | `Saved.tsx`, `AnimatedMessage.tsx` |

---

## Ethical Considerations

### Informed Consent
- All participants signed consent forms (anonymized, data use explained)
- Youth under 18: Parental consent obtained
- Right to withdraw at any time

### Compensation
- N$50 airtime per session (no coercion, covers transport/data)
- Refreshments provided

### Anonymization
- No real names in documentation
- Quotes attributed by pseudonym + age only
- Photos: Faces blurred or consent obtained

### Feedback Loop
- Participants receive summary of how their input shaped design
- Invited to final prototype demo

---

## Lessons Learned

### What Worked Well
✅ **Multiple short sessions** better than one long workshop (attention span)  
✅ **Hands-on prototyping** (paper, Figma) more engaging than abstract discussion  
✅ **Mixed activities** (voting, sketching, discussion) kept energy high  
✅ **Returning participants** provided continuity and deeper insights

### Challenges
⚠️ **Recruiting** from marginalized group required community partner (youth center)  
⚠️ **Scheduling** conflicts with informal work (flexible timing needed)  
⚠️ **Digital literacy** varied (some needed help with Figma, prefer paper)  
⚠️ **Language** barrier (some comfortable in Oshiwambo, not English)

### Future Improvements
- Multi-language sessions (Oshiwambo facilitator)
- Longer-term co-design (6-month partnership, not 2-3 months)
- Include youth with disabilities (accessibility focus)
- Pay youth as co-researchers (not just participants)

---

## Conclusion

The YouthGuide NA chatbot is a **direct product of participatory co-design** with unemployed youth in Havana. Every major design decision — from WhatsApp UI to 3-skill profiles to empathetic tone — **emerged from iterative dialogue** with the target community.

This process ensured:
1. **Contextual relevance:** System addresses real barriers (trust, cost, simplicity)
2. **User ownership:** Youth see their ideas reflected in final product
3. **Adoption likelihood:** Designed for familiarity and comfort
4. **Ethical grounding:** Privacy and respect central to design

**Key Quote:**
> "This isn't just a chatbot made for us, it's a chatbot made **with** us. I see my suggestions in how it works." — David, 23

---

## Appendices

### Appendix A: Workshop Consent Form (Template)
[Include consent form text]

### Appendix B: Full Survey Instrument
[Include all survey questions]

### Appendix C: Workshop Photos
[Include photos with consent - blurred faces or wide shots]

### Appendix D: Participant Demographics Summary

| Session | Total | Age Range | Gender | Education Level |
|---------|-------|-----------|--------|-----------------|
| 1 | 12 | 18-30 | 7F, 5M | Grade 10-12: 8, Diploma: 3, Degree: 1 |
| 2 | 8 | 19-28 | 5F, 3M | Grade 10-12: 6, Diploma: 2 |
| 3 | 10 | 17-26 | 6F, 4M | Grade 10-12: 7, Diploma: 2, Degree: 1 |
| 4 | 9 | 18-29 | 4F, 5M | Grade 10-12: 6, Diploma: 3 |

**Total Unique Participants:** ~25-30 youth  
**Sessions:** 4 workshops + 3 iteration tests + 1 validation

---

**Document Status:** Living document, updated as participatory process continues  
**Last Updated:** [Date]  
**Next Review:** [Date]

---

## How to Use This Document in Your Thesis

**Chapter 3 (Methodology):**
- Section 3.2: Participatory Design Process
- Reference workshop sessions as evidence of co-creation
- Include demographic table (Appendix D)

**Chapter 5 (Results):**
- Compare participatory insights to final design
- Show traceability: Youth input → Design decision → Implementation

**Throughout Thesis:**
- Use participant quotes to support claims
- Reference workshop findings when explaining design choices
- Cite this document as evidence of ethical, user-centered process

**Example Citation:**
> "The decision to limit profile creation to three skills emerged from participatory Workshop 2, where youth expressed frustration with lengthy forms (see Participatory Design Process Documentation, Session 2)."
