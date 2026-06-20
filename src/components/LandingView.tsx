/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Camera, Image as ImageIcon, Sparkles, BookOpen } from 'lucide-react';

interface LandingViewProps {
  onOpenCamera: () => void;
  onFileSelect: (file: File) => void;
}

export default function LandingView({ onOpenCamera, onFileSelect }: LandingViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[82vh] px-4 py-8" id="landing-container">
      {/* Top Brand Hero */}
      <div className="w-full max-w-md text-center my-auto space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-teal-50 text-brand-teal mb-2 border border-teal-100" id="brand-logo-container">
          <Sparkles className="w-8 h-8" />
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight font-display text-brand-navy" id="app-title">
          SnapLearn
        </h1>
        
        <p className="text-lg text-brand-muted max-w-sm mx-auto font-sans" id="app-subtitle">
          Point your camera at something. Learn something new.
        </p>

        {/* Action Buttons */}
        <div className="pt-6 space-y-4 max-w-xs mx-auto">
          <button
            onClick={onOpenCamera}
            className="w-full flex items-center justify-center gap-3 bg-brand-teal hover:bg-teal-700 text-white font-semibold py-4 px-6 rounded-full shadow-sm transition-colors cursor-pointer text-base active:scale-98"
            id="btn-open-camera"
            aria-label="Open your computer or phone camera"
          >
            <Camera className="w-5 h-5" />
            Open Camera
          </button>

          <button
            onClick={triggerFileSelect}
            className="w-full flex items-center justify-center gap-3 bg-brand-card hover:bg-slate-50 text-brand-navy font-semibold py-3.5 px-6 rounded-full border border-slate-200 transition-colors cursor-pointer text-sm"
            id="btn-upload-file"
            aria-label="Upload an image file instead"
          >
            <ImageIcon className="w-4 h-4 text-brand-muted" />
            Upload a Photo
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="camera-file-input"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Modern Compact Informational Cards */}
      <div className="w-full max-w-md mt-8 space-y-4" id="info-and-privacy">
        <div className="bg-brand-card p-5 rounded-3xl border border-slate-200 shadow-sm" id="how-it-works-card">
          <h2 className="text-sm font-semibold text-brand-navy flex items-center gap-2 mb-2 font-display">
            <BookOpen className="w-4 h-4 text-brand-teal" />
            How it works
          </h2>
          <p className="text-xs text-brand-muted leading-relaxed font-sans">
            Your phone camera captures an image; Gemini AI identifies and explains what it sees instantly with educational details.
          </p>
        </div>

        {/* Small Privacy Note */}
        <div className="text-center" id="privacy-footer">
          <p className="text-xs text-brand-muted font-sans font-medium">
            Photos are used only to create this learning card. No accounts or sign-ins required.
          </p>
        </div>
      </div>
    </div>
  );
}
