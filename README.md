# SnapLearn - Point, Snap & Learn

SnapLearn is a polished, mobile-first web application that turns your phone camera into an educational tool. By snapping a photo of an everyday object, the app uses Gemini AI vision to instantly analyze the image and generate high-quality, structured learning cards.

---

## 🔗 Live Demo

Experience the live application here:  
👉 **[https://snaplearn-854546159787.us-west2.run.app](https://snaplearn-854546159787.us-west2.run.app)**

---

## 📸 Key Features

- **Live Camera Preview**: Stream real-time camera footage in-app using the browser's native `MediaDevices` API, optimized to prefer rear-facing lens setups on mobile phones.
- **Instant Photo Capture**: Freeze frames directly from the live video stream using an optimized high-resolution HTML5 canvas capture.
- **Robust Upload Fallback**: Instantly fallback to direct device image library or disk photo uploading if camera permissions are unavailable.
- **Gemini Vision Analysis**: Leverage server-side `gemini-3.5-flash` multimodal models to analyze snapshots with reliable, structured JSON output formats.
- **Structured Learning Cards**: Access dynamic, human-friendly insights:
  - **What is it?**: A direct, verified identification of the target object.
  - **Quick explanation**: Two simple educational sentences suited for any age group.
  - **English Vocabulary**: The English word paired with a context-appropriate sample sentence.
  - **Did you know?**: Educational, accurate fun facts.
  - **Try This**: Engaging, related challenges that prompt continued learning.
- **Mobile-Responsive Design**: A sleek, minimal layout styled with custom tailwind classes, comfortable touch targets, elegant Slate & Warm Off-white styling, and a clean interface.
- **Battery & Privacy Conscious**: Video streams are fully stopped and camera hardware tracks are released as soon as a photo is captured or when navigating away from the active screen.

---

## 📱 Mobile Testing

This application has been verified to run seamlessly on mobile Safari (iOS iPhone) and Google Chrome (Android):
- **Camera Permission**: The camera prompt is requested securely and gracefully via the browser.
- **Live Preview & Video Track**: The custom HTML5 video elements bind instantly and display lag-free streaming feed without stalling or displaying empty black screens.
- **Capture and Confirmation**: Taking a photo successfully grabs the active frame-buffer, rendering preview freezeframes beautifully.
- **AI Analysis**: Sending snapshot base64 packets returns accurate and fast structured card metadata.

---

## 🔒 Privacy & Security

We maintain high standards for your data privacy and security:
- **No API Keys Exposed**: All calls to the Gemini model are proxied through secure server-side Node.js/Express controllers. Application secrets are managed securely via platform environment variables and are never committed to GitHub or exposed to client browsers.
- **Zero Storage Policy**: Pictures snapped in the application are processed transiently in-memory and are never stored on persistent storage, databases, or logs. Photos are used exclusively to compile the requested learning cards.
- **Telemetry-Free**: SnapLearn does not require login credentials, emails, location coordinates, or payment systems.

---

## 🛠️ Technology Stack

- **Frontend**: React (19+), Tailwind CSS (v4), Lucide Icons
- **Backend**: Node.js, Express Server, `@google/genai` (Official modern SDK)
- **AI Model**: `gemini-3.5-flash` with strict schema validation
- **Build System**: Vite, TypeScript, `esbuild`

---

## 🚀 How to Run Locally

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed.

### 2. Configure Credentials
Create a `.env` file at the root of the project and add your API key:
```env
GEMINI_API_KEY="AI_STUDIO_GEMINI_API_KEY_HERE"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Dev Server
Starts the full-stack development environment (Node Express Server + Vite middleware) on port `3000`:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.
