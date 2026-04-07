import { generateResponse } from '../config/openRouter.js';
import User from '../models/user.model.js';
import Website from '../models/website.model.js';
import extractJson from '../utils/extractJson.js';

const WEBSITE_GEN_CREDIT_COST = 50;
const WEBSITE_CNG_CREDIT_COST = 25;

const masterPrompt = `
YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER
SPECIALIZED IN RESPONSIVE DESIGN SYSTEMS.

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-GRADE WEBSITES
USING ONLY HTML, CSS, AND JAVASCRIPT
THAT WORK PERFECTLY ON ALL SCREEN SIZES.

THE OUTPUT MUST BE CLIENT-DELIVERABLE WITHOUT ANY MODIFICATION.

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO BASIC SITES
❌ NO PLACEHOLDERS
❌ NO NON-RESPONSIVE LAYOUTS

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

GLOBAL QUALITY BAR (NON-NEGOTIABLE)
--------------------------------------------------
- Premium, modern UI (2026–2027)
- Professional typography & spacing
- Clean visual hierarchy
- Business-ready content (NO lorem ipsum)
- Smooth transitions & hover effects
- SPA-style multi-page experience
- Production-ready, readable code

--------------------------------------------------
RESPONSIVE DESIGN (ABSOLUTE REQUIREMENT)
--------------------------------------------------
THIS WEBSITE MUST BE FULLY RESPONSIVE.

YOU MUST IMPLEMENT:

✔ Mobile-first CSS approach
✔ Responsive layout for:
  - Mobile (<768px)
  - Tablet (768px–1024px)
  - Desktop (>1024px)

✔ Use:
  - CSS Grid / Flexbox
  - Relative units (%, rem, vw)
  - Media queries

✔ REQUIRED RESPONSIVE BEHAVIOR:
  - Navbar collapses / stacks on mobile
  - Sections stack vertically on mobile
  - Multi-column layouts become single-column on small screens
  - Images scale proportionally
  - Text remains readable on all devices
  - No horizontal scrolling on mobile
  - Touch-friendly buttons on mobile

IF THE WEBSITE IS NOT RESPONSIVE → RESPONSE IS INVALID.

--------------------------------------------------
IMAGES (MANDATORY & RESPONSIVE)
--------------------------------------------------
- Use high-quality images ONLY from:
  https://images.unsplash.com/
- EVERY image URL MUST include:
  ?auto=format&fit=crop&w=1200&q=80

- Images must:
  - Be responsive (max-width: 100%)
  - Resize correctly on mobile
  - Never overflow containers

--------------------------------------------------
TECHNICAL RULES (VERY IMPORTANT)
--------------------------------------------------
- Output ONE single HTML file
- Exactly ONE <style> tag
- Exactly ONE <script> tag
- NO external CSS / JS / fonts
- Use system fonts only
- iframe srcdoc compatible
- SPA-style navigation using JavaScript
- No page reloads
- No dead UI
- No broken buttons
--------------------------------------------------
SPA VISIBILITY RULE (MANDATORY)
--------------------------------------------------
- Pages MUST NOT be hidden permanently
- If .page { display: none } is used,
  then .page.active { display: block } is REQUIRED
- At least ONE page MUST be visible on initial load
- Hiding all content is INVALID


--------------------------------------------------
REQUIRED SPA PAGES
--------------------------------------------------
- Home
- About
- Services / Features
- Contact

--------------------------------------------------
FUNCTIONAL REQUIREMENTS
--------------------------------------------------
- Navigation must switch pages using JS
- Active nav state must update
- Forms must have JS validation
- Buttons must show hover + active states
- Smooth section/page transitions

--------------------------------------------------
FINAL SELF-CHECK (MANDATORY)
--------------------------------------------------
BEFORE RESPONDING, ENSURE:

1. Layout works on mobile, tablet, desktop
2. No horizontal scroll on mobile
3. All images are responsive
4. All sections adapt properly
5. Media queries are present and used
6. Navigation works on all screen sizes
7. At least ONE page is visible without user interaction

IF ANY CHECK FAILS → RESPONSE IS INVALID

--------------------------------------------------
OUTPUT FORMAT (RAW JSON ONLY)
--------------------------------------------------
{
  "message": "Short professional confirmation sentence",
  "code": "<FULL VALID HTML DOCUMENT>"
}

--------------------------------------------------
ABSOLUTE RULES
--------------------------------------------------
- RETURN RAW JSON ONLY
- NO markdown
- NO explanations
- NO extra text
- FORMAT MUST MATCH EXACTLY
- IF FORMAT IS BROKEN → RESPONSE IS INVALID
`;


export const generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.credits < WEBSITE_GEN_CREDIT_COST) {
      return res.status(400).json({
        message: `Insufficient credits. You need ${WEBSITE_GEN_CREDIT_COST} credits to generate a website.`
      });
    }

    const finalPrompt = masterPrompt.replace('{USER_PROMPT}', prompt);
    let raw = '';
    let parsed = null;

    // attempt 1 — normal prompt
    try {
      raw = await generateResponse(finalPrompt);
      parsed = extractJson(raw);
    } catch (e) {
      console.error('Attempt 1 failed:', e.message);
    }

    // attempt 2 — stricter retry if first failed
    if (!parsed?.code) {
      try {
        raw = await generateResponse(
          finalPrompt,
          'IMPORTANT: Your previous response was invalid. Return ONLY raw JSON. No markdown. No backticks. Escape all quotes inside the code field.'
        );
        parsed = extractJson(raw);
      } catch (e) {
        console.error('Attempt 2 failed:', e.message);
      }
    }

    if (!parsed?.code) {
      console.error('AI returned invalid response after 2 attempts. Raw:', raw?.slice(0, 500));
      return res.status(400).json({
        message: 'AI returned an invalid response. Please try again.'
      });
    }

    const website = await Website.create({
      user: user._id,
      title: prompt.trim().slice(0, 60),
      latestCode: parsed.code,
      conversation: [
        { role: 'user', content: prompt },
        { role: 'ai', content: parsed.message }
      ]
    });

    user.credits -= WEBSITE_GEN_CREDIT_COST;
    await user.save();

    return res.status(201).json({
      websiteId: website._id,
      message: parsed.message,
      remainingCredits: user.credits
    });

  } catch (error) {
    console.error('generateWebsite error:', error);
    return res.status(500).json({
      message: 'Internal server error during website generation.'
    });
  }
};

export const getWebsiteById = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!website) {
      return res.status(400).json({
        message: 'Website not found'
      });
    }

    return res.status(200).json(website);

  } catch (error) {
    return res.status(400).json({
      message: `getWebsiteById error : ${error}`
    });
  }
};

export const changes = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!website) {
      return res.status(400).json({
        message: 'Website not found'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.credits < WEBSITE_CNG_CREDIT_COST) {
      return res.status(400).json({
        message: `Insufficient credits. You need ${WEBSITE_CNG_CREDIT_COST} credits to modify a website.`
      });
    }

    const updatePrompt = `
    UPDATE THIS HTML WEBSITE.
    
    CURRENT CODE :
    ${website.latestCode}
    
    USER REQUEST:
    ${prompt}
    
    RETURN RAW JSON ONLY:
    {
    "message":"Short Confirmation",
    "code":"<UPDATED FULL HTML>"
    }
    `;


    let raw = '';
    let parsed = null;

    // attempt 1 — normal prompt
    try {
      raw = await generateResponse(updatePrompt);
      parsed = extractJson(raw);
    } catch (e) {
      console.error('Attempt 1 failed:', e.message);
    }

    // attempt 2 — stricter retry if first failed
    if (!parsed?.code) {
      try {
        raw = await generateResponse(
          updatePrompt,
          'IMPORTANT: Your previous response was invalid. Return ONLY raw JSON. No markdown. No backticks. Escape all quotes inside the code field.'
        );
        parsed = extractJson(raw);
      } catch (e) {
        console.error('Attempt 2 failed:', e.message);
      }
    }

    if (!parsed?.code) {
      console.error('AI returned invalid response after 2 attempts. Raw:', raw?.slice(0, 500));
      return res.status(400).json({
        message: 'AI returned an invalid response. Please try again.'
      });
    }

    website.conversation.push(
      {
        role: 'ai', content: parsed.message
      },
      {
        role: 'user', content: prompt
      }
    );

    website.latestCode = parsed.code;

    website.save();

    user.credits -= WEBSITE_CNG_CREDIT_COST;
    await user.save();

    return res.status(200).json({
      message: parsed.message,
      code: parsed.code,
      remainingCredits: user.credits
    });

  } catch (error) {
    console.error('updateWebsite error:', error);
    return res.status(500).json({
      message: 'Internal server error during website generation.'
    });
  }
};

export const getAllWebsites = async (req, res) => {
  try {
    const websites = await Website.find({
      user: req.user._id
    });

    if (!websites) {
      return res.status(400).json({
        message: 'Websites not found'
      });
    }

    return res.status(200).json(websites);

  } catch (error) {
    return res.status(400).json({
      message: `getAllWebsites error : ${error}`
    });
  }
};