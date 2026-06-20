# SnapLearn - Point, Snap & Learn

An elegant, mobile-first, full-stack web application that allows users to capture images of everyday objects, instantly identifying them and rendering interactive, structured learning cards powered by Gemini 3.5 AI Vision.

---

## 📸 Key Features

- **Instant Visual Identification**: Capture an image using a live front/back auto-switching camera or fallback file upload.
- **Structured Learning Cards**: Returns customized educational metadata in an exact format:
  - **What is it?**: Quick verified identification.
  - **Quick explanation**: Easily digestible two-sentence description.
  - **English word & Example**: English vocabulary lessons with custom contextual sample sentences.
  - **Did you know?**: Intrepid and educational accurate fun facts.
  - **Dynamic Challenge**: Friendly prompts promoting lateral visual learning.
- **Hardware-Friendly Mechanics**: Auto-releases video tracks on photo capture, switching views, or closing to respect battery, performance, and user privacy.
- **Responsive Touch Design**: High-contrast, accessibility-forward Slate & Warm Off-white styling built with Tailwind CSS.

---

## 🛠️ Technology Stack

- **Frontend**: React (19+), Tailwind CSS (v4), Lucide React Icons
- **Backend**: Node.js, Express Server, `@google/genai` (Official modern SDK)
- **AI Model**: `gemini-3.5-flash` with strict structured output schema configuration
- **Build System**: Vite, TypeScript, `esbuild` for optimal Node bundle output

---

## 🚀 How to Run Locally

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed.

### 2. Configure Credentials
Add your secret API key inside a `.env` file at the root:
```env
GEMINI_API_KEY="AI_STUDIO_GEMINI_API_KEY_HERE"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Boot Dev Server
Runs the Express application coupled with the Vite dev middleware on port `3000`:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔒 Privacy Notice

**We take your security and privacy seriously:**
- **No Sign-Ins or Locations**: We do not collect or store user accounts, location telemetry, or credentials.
- **Ad-Hoc Processing**: SnapLearn utilizes photos solely for the inline, server-side creator call to generate your educational cards. Photos are analyzed dynamically and are not stored permanently.

---

## 📹 Note on Camera Permissions

- SnapLearn relies on standard browser media queries (**MediaDevices API**).
- Access to the device camera is strictly local and runs relative to HTTPS domains or localhost guidelines.
- If you deny camera permissions, the application handles it gracefully and offers safe, direct file-upload fallbacks.
