/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, HelpCircle, GraduationCap, Map, ArrowRight, Lightbulb } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ResultCardsProps {
  photo: string;
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultCards({ photo, result, onReset }: ResultCardsProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 px-4 py-8" id="results-parent">
      
      {/* Top Banner & Photo Preview */}
      <div className="bg-brand-card rounded-[24px] p-4 border border-slate-200 shadow-sm space-y-4" id="photo-preview-box">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-teal block text-center" id="learning-card-tag">
          Learning Card Generated
        </h2>
        
        {/* Render the actual photo that was taken */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#1E293B] shadow-inner" id="result-photo-container">
          <img
            src={photo}
            alt="Captured object"
            className="w-full h-full object-cover"
            id="result-snapshot"
          />
          <div className="absolute top-3 right-3 bg-brand-teal text-white rounded-full p-2 shadow-sm" id="verified-badge">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Structured learning cards */}
      <div className="space-y-4" id="learning-cards-list">
        
        {/* Card 1: What is it? & Quick Explanation */}
        <div className="bg-brand-card p-5 rounded-[20px] border border-slate-200 shadow-xs space-y-2.5" id="identification-card">
          <div className="flex items-center gap-2" id="id-title-row">
            <HelpCircle className="w-4 h-4 text-brand-teal" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-teal">What is it?</h3>
          </div>
          
          <h4 className="text-xl font-extrabold font-display text-brand-navy" id="object-name-title">
            {result.whatIsIt}
          </h4>
          
          <p className="text-sm text-brand-muted leading-relaxed font-sans" id="object-explanation">
            {result.explanation}
          </p>
        </div>

        {/* Card 2: English Language Lesson */}
        <div className="bg-brand-card p-5 rounded-[20px] border border-slate-200 shadow-xs space-y-3" id="english-lesson-card">
          <div className="flex items-center gap-2" id="lesson-title-row">
            <GraduationCap className="w-4 h-4 text-brand-teal" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-teal">English Word</h3>
          </div>
          
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100" id="vocabulary-quote-box">
            <p className="text-base font-bold font-sans text-brand-navy" id="word-translation">
              <span className="italic text-brand-navy font-semibold text-lg underline decoration-brand-teal decoration-2">{result.englishWord}</span>
            </p>
          </div>
          
          <div className="space-y-1" id="example-sentence-box">
            <p className="text-[10px] font-mono font-semibold uppercase text-slate-400">Example sentence</p>
            <p className="text-sm italic text-brand-muted font-sans" id="word-sample-sentence">
              &ldquo;{result.englishExample}&rdquo;
            </p>
          </div>
        </div>

        {/* Card 3: Did You Know? */}
        <div className="bg-brand-card p-5 rounded-[20px] border border-slate-200 shadow-xs space-y-2.5" id="fact-card">
          <div className="flex items-center gap-2" id="fact-title-row">
            <Lightbulb className="w-4 h-4 text-brand-teal" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-teal">Did you know?</h3>
          </div>
          
          <p className="text-sm text-brand-muted leading-relaxed font-sans" id="object-key-fact">
            {result.didYouKnow}
          </p>
        </div>

        {/* Card 4: Try This */}
        <div className="bg-[#F0FDFA] p-5 rounded-[20px] border border-dashed border-brand-teal shadow-xs space-y-2.5" id="challenge-card">
          <div className="flex items-center gap-2" id="challenge-title-row">
            <Map className="w-4 h-4 text-brand-teal" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-teal">Try This</h3>
          </div>
          
          <p className="text-sm text-brand-navy leading-relaxed font-semibold font-sans" id="object-next-challenge">
            {result.tryThis}
          </p>
        </div>

      </div>

      {/* Action Scan Another Button */}
      <div className="pt-2 pb-6" id="scan-again-box">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 bg-brand-teal hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-full shadow-md cursor-pointer text-base active:scale-98 transition-transform"
          id="btn-scan-another"
          aria-label="Scan another item and reset camera"
        >
          Scan another item
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
