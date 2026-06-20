/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react';
import LandingView from './components/LandingView';
import CameraView from './components/CameraView';
import ResultCards from './components/ResultCards';
import { AnalysisResult, AppState } from './types';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errMessage, setErrMessage] = useState<string | null>(null);

  // Trigger base64 reading for fallback file upload
  const handleFileSelect = (file: File) => {
    setAppState('analyzing');
    setErrMessage(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setCurrentPhoto(base64String);
      triggerAnalysis(base64String, file.type);
    };
    reader.onerror = () => {
      setAppState('error');
      setErrMessage("Unable to read this file. Please submit another image.");
    };
    reader.readAsDataURL(file);
  };

  // Called when a photo is captured inline (we save it in state, but wait to analyze until user taps confirmation)
  const handlePhotoCaptured = (base64Image: string) => {
    setCurrentPhoto(base64Image);
  };

  // Triggers post analysis with backend Express routing API
  const triggerAnalysis = async (base64Image: string, mimeType?: string) => {
    setAppState('analyzing');
    setErrMessage(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          mimeType: mimeType || 'image/jpeg'
        })
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: "Network communication failed." };
        }
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      setAppState('result');
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setAppState('error');
      setErrMessage(err.message || "Something went wrong while identifying your object. Please try again.");
    }
  };

  const handleResetFlow = () => {
    setCurrentPhoto(null);
    setResult(null);
    setErrMessage(null);
    setAppState('landing');
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-between" id="app-root-shell">
      
      {/* Navigation Brand Header */}
      <header className="sticky top-0 bg-brand-card/80 backdrop-blur-md border-b border-slate-200 z-50 py-4 px-6 shadow-xs flex items-center justify-between" id="global-nav">
        <div className="flex items-center gap-1.5 cursor-pointer" id="brand-indicator" onClick={handleResetFlow}>
          <Sparkles className="w-5 h-5 text-brand-teal" />
          <span className="font-display font-extrabold text-base tracking-tight text-brand-navy">
            SnapLearn
          </span>
        </div>
        <div className="text-[10px] font-mono tracking-wider text-brand-teal font-bold" id="by-gemini-logo">
          POWERED BY GEMINI AI
        </div>
      </header>

      {/* Main Page Layout Core */}
      <main className="flex-1 w-full max-w-xl mx-auto flex flex-col justify-center" id="global-main">
        
        {appState === 'landing' && (
          <LandingView
            onOpenCamera={() => setAppState('camera')}
            onFileSelect={handleFileSelect}
          />
        )}

        {appState === 'camera' && (
          <CameraView
            onPhotoCaptured={handlePhotoCaptured}
            onAnalyze={(photoData) => triggerAnalysis(photoData)}
            onCancel={handleResetFlow}
            onFileSelect={handleFileSelect}
          />
        )}

        {appState === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center space-y-6" id="state-analyzing-card">
            
            {/* Spinning Radar Loading Elements */}
            <div className="relative w-20 h-20 flex items-center justify-center" id="radar-visualizer">
              <div className="absolute inset-0 rounded-full border-4 border-teal-100 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full border-4 border-teal-200 animate-ping opacity-45"></div>
              <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 animate-spin text-brand-teal" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold font-display text-brand-navy">Identifying and learning...</h3>
              <p className="text-sm text-brand-muted max-w-xs mx-auto font-sans font-medium">
                Gemini Vision AI is analyzing your image to compile accurate translations and interesting facts.
              </p>
            </div>

            {/* Simulated educational facts stream loader */}
            <div className="bg-brand-card px-4 py-2 rounded-full border border-slate-200 text-[11px] font-mono font-semibold text-brand-teal animate-pulse">
              Recognizing patterns &bull; Formulating challenges
            </div>
          </div>
        )}

        {appState === 'result' && currentPhoto && result && (
          <ResultCards
            photo={currentPhoto}
            result={result}
            onReset={handleResetFlow}
          />
        )}

        {appState === 'error' && (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-6 min-h-[60vh]" id="state-error-card">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold font-display text-brand-navy">Analysis failed</h3>
              <p className="text-sm text-brand-muted max-w-sm font-sans font-medium animate-pulse" id="error-message-detail">
                {errMessage || "We couldn't reach the learning servers. Please verify your internet connection or configure your API key."}
              </p>
            </div>

            <div className="pt-2 w-full max-w-[240px] flex flex-col gap-2">
              <button
                onClick={() => setAppState('camera')}
                className="w-full flex items-center justify-center gap-2 bg-brand-teal hover:bg-teal-700 text-white font-bold py-3 px-5 rounded-full text-sm cursor-pointer shadow-sm transition-colors"
                id="btn-error-retry"
              >
                <ArrowLeft className="w-4 h-4" />
                Try Camera Again
              </button>
              
              <button
                onClick={handleResetFlow}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-brand-navy font-semibold py-2.5 px-4 rounded-full text-xs transition-colors cursor-pointer border border-slate-200"
                id="btn-error-home"
              >
                Return to landing
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Accessible Footer credits line */}
      <footer className="py-6 border-t border-slate-200 bg-brand-card/60 text-center text-brand-muted font-sans font-medium text-xs flex flex-col gap-1 items-center justify-center" id="footer-details">
        <div>Photos are used only to create this learning card. No data is stored or shared.</div>
        <div className="text-brand-teal/80 font-semibold uppercase tracking-wider text-[10px]">&copy; 2026 SnapLearn &bull; Powered by Gemini Pro Vision AI</div>
      </footer>

    </div>
  );
}
