/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, BookOpen, History, Trash2, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { RecentScan } from '../types';

interface LandingViewProps {
  onOpenCamera: () => void;
  onFileSelect: (file: File) => void;
  recentScans: RecentScan[];
  onSelectRecent: (scan: RecentScan) => void;
  onClearHistory: () => void;
}

export default function LandingView({
  onOpenCamera,
  onFileSelect,
  recentScans,
  onSelectRecent,
  onClearHistory,
}: LandingViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const formatTime = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const scrollToHistory = () => {
    const el = document.getElementById('recent-scans-area');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[82vh] px-4 py-6" id="landing-container">
      {/* Top Brand Hero */}
      <div className="w-full max-w-md text-center my-auto space-y-5">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-teal-50 text-brand-teal mb-1 border border-teal-100" id="brand-logo-container">
          <Sparkles className="w-8 h-8" />
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight font-display text-brand-navy animate-fade-in" id="app-title">
          SnapLearn
        </h1>
        
        <p className="text-base text-brand-muted max-w-sm mx-auto font-sans" id="app-subtitle">
          Point your camera at something. Learn something new.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3.5 max-w-xs mx-auto">
          <button
            onClick={onOpenCamera}
            className="w-full flex items-center justify-center gap-3 bg-brand-teal hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-full shadow-md transition-all cursor-pointer text-base active:scale-98"
            id="btn-open-camera"
            aria-label="Open camera to identify objects"
          >
            <Camera className="w-5 h-5" />
            Open Camera
          </button>

          <button
            onClick={triggerFileSelect}
            className="w-full flex items-center justify-center gap-3 bg-brand-card hover:bg-slate-50 text-brand-navy font-bold py-3.5 px-6 rounded-full border border-slate-200 transition-colors cursor-pointer text-sm shadow-xs"
            id="btn-upload-file"
            aria-label="Upload a photo from your device"
          >
            <ImageIcon className="w-4 h-4 text-brand-teal" />
            Upload a Photo
          </button>

          {/* New visible Recent Scans button, always visible even with 0 scans */}
          <button
            onClick={scrollToHistory}
            className="w-full flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-full border border-transparent transition-all cursor-pointer text-xs active:scale-98 shadow-2xs"
            id="btn-toggle-recent-scans"
            aria-label={`View recent scans list, currently ${recentScans.length} saved`}
          >
            <History className="w-3.5 h-3.5 text-brand-teal" />
            Recent Scans ({recentScans.length})
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

      {/* Private Recent Scans Section */}
      <div className="w-full max-w-md mt-6" id="recent-scans-area">
        <div className="bg-brand-card rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4" id="recent-scans-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3" id="recent-scans-header">
            <div className="flex items-center gap-2 text-brand-navy font-bold text-sm font-display">
              <History className="w-4 h-4 text-brand-teal" />
              <span>Recent Scans</span>
              <span className="bg-teal-50 text-brand-teal text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-teal-100">
                {recentScans.length}/5
              </span>
            </div>

            {recentScans.length > 0 && (
              !confirmClear ? (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold font-mono uppercase tracking-tight"
                  id="btn-trigger-clear-history"
                  title="Clear scan history"
                  aria-label="Clear scan history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              ) : (
                <div className="flex items-center gap-1.5" id="clear-confirm-controls">
                  <button
                    onClick={() => {
                      onClearHistory();
                      setConfirmClear(false);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors shadow-xs"
                    id="btn-confirm-clear"
                    aria-label="Confirm clear all history"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                    id="btn-cancel-clear"
                    aria-label="Cancel clear action"
                  >
                    Cancel
                  </button>
                </div>
              )
            )}
          </div>

          {/* Scans List with real-time elements or informative Empty State */}
          {recentScans.length > 0 ? (
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1" id="scans-list-container">
              {recentScans.map((scan) => (
                <button
                  key={scan.id}
                  onClick={() => onSelectRecent(scan)}
                  className="w-full text-left flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-brand-teal/40 hover:bg-slate-50/50 transition-all cursor-pointer group active:scale-99"
                  id={`recent-item-${scan.id}`}
                  aria-label={`View learning card for ${scan.result.whatIsIt}`}
                >
                  <div className="space-y-1 pr-2 flex-1">
                    <p className="text-sm font-extrabold text-brand-navy group-hover:text-brand-teal transition-colors">
                      {scan.result.whatIsIt}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-brand-muted font-mono">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <span>{formatTime(scan.timestamp)}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="font-semibold text-brand-teal">{scan.result.englishWord}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-teal group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 px-4 border border-dashed border-slate-200 rounded-2xl space-y-2" id="scans-empty-state">
              <Clock className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-brand-navy">No scans yet</p>
              <p className="text-xs text-brand-muted max-w-[200px] mx-auto leading-relaxed">
                Your captured learning cards will appear here for easy access on this device.
              </p>
            </div>
          )}

          {/* Device privacy disclaimer */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-start gap-2" id="privacy-explanation-box">
            <AlertCircle className="w-3.5 h-3.5 text-brand-teal shrink-0 mt-0.5" />
            <p className="text-[10px] text-brand-muted font-sans font-medium leading-normal">
              These cards are saved locally in this browser. Under our strict policy, **no photos are ever saved** or transmitted to any server storage.
            </p>
          </div>
        </div>
      </div>

      {/* Modern Compact Informational Cards */}
      <div className="w-full max-w-md mt-6 space-y-4" id="info-and-privacy">
        <div className="bg-brand-card p-5 rounded-3xl border border-slate-200 shadow-sm" id="how-it-works-card">
          <h2 className="text-sm font-semibold text-brand-navy flex items-center gap-2 mb-2 font-display">
            <BookOpen className="w-4 h-4 text-brand-teal" />
            How it works
          </h2>
          <p className="text-xs text-brand-muted leading-relaxed font-sans font-medium">
            Your phone camera captures an image; Gemini AI identifies and explains what it sees instantly with educational details and English translation challenges.
          </p>
        </div>

        {/* Small Privacy Note */}
        <div className="text-center" id="privacy-footer">
          <p className="text-xs text-brand-muted font-sans font-medium">
            Photos are used only to create your learning card. No accounts, sign-ins, or profiling.
          </p>
        </div>
      </div>
    </div>
  );
}
