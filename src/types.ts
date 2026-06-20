/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AnalysisResult {
  whatIsIt: string;    // a short, likely identification of the main object in the picture
  explanation: string; // 2 simple sentences, easy for a general audience
  englishWord: string; // the object name in English
  englishExample: string; // one example sentence using English word
  didYouKnow: string;  // one interesting, accurate fact
  tryThis: string;     // one short prompt that encourages the user to photograph another related object
}

export type AppState = 'landing' | 'camera' | 'captured' | 'analyzing' | 'result' | 'error';
