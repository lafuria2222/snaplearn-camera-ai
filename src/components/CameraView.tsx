/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, AlertCircle, RefreshCw, Sparkles, Upload, FileText } from 'lucide-react';

interface CameraViewProps {
  onPhotoCaptured: (base64Image: string) => void;
  onAnalyze: (base64Image: string) => void;
  onCancel: () => void;
  onFileSelect: (file: File) => void;
}

export default function CameraView({ onPhotoCaptured, onAnalyze, onCancel, onFileSelect }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cameraState, setCameraState] = useState<'opening' | 'active' | 'captured' | 'denied'>('opening');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Starts the camera stream
  const startCamera = async (currentMode: 'environment' | 'user') => {
    setCameraState('opening');
    setErrorMessage('');

    // Stop existing stream tracks if any
    stopCamera();

    let stream: MediaStream | null = null;
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: currentMode },
          width: { ideal: 1080 },
          height: { ideal: 1080 }
        },
        audio: false // No audio requested, fully compliant
      };

      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err: any) {
      console.warn("First camera constraint failed, trying basic fallback...", err);
      try {
        const fallbackConstraints: MediaStreamConstraints = {
          video: true,
          audio: false
        };
        stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
      } catch (fallbackErr: any) {
        console.error("All camera initialization attempts failed:", fallbackErr);
        setCameraState('denied');
        if (fallbackErr.name === 'NotAllowedError' || fallbackErr.name === 'PermissionDeniedError') {
          setErrorMessage("Camera permission was denied. Please allow camera access in your browser rules or choose a photo below.");
        } else if (fallbackErr.name === 'NotFoundError' || fallbackErr.name === 'DevicesNotFoundError') {
          setErrorMessage("No camera hardware found on this browser or device. Please upload a saved picture instead.");
        } else {
          setErrorMessage(`Unable to access camera: ${fallbackErr.message || 'Unknown error'}. Please choose a saved picture instead.`);
        }
        return;
      }
    }

    if (!stream) return;
    streamRef.current = stream;

    // Attach stream to video element
    const video = videoRef.current;
    if (video) {
      video.srcObject = stream;
      
      // Force settings on HTMLVideoElement to ensure iOS Safari compatibility
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('muted', 'true');
      video.setAttribute('autoplay', 'true');

      const tryPlayback = async () => {
        try {
          await video.play();
          setCameraState('active');
        } catch (playErr: any) {
          console.error("Explicit video.play() failed:", playErr);
          // Safe fallback - set state to active even if auto-playback triggers Safari warnings
          setCameraState('active');
        }
      };

      video.onloadedmetadata = () => {
        tryPlayback();
      };
      
      video.oncanplay = () => {
        tryPlayback();
      };

      // Fallback in case metadata events already fired
      tryPlayback();
    } else {
      // Resilient timeout fallback if React render ticks did not update ref instantly
      setTimeout(() => {
        const retryVideo = videoRef.current;
        if (retryVideo && stream) {
          retryVideo.srcObject = stream;
          retryVideo.autoplay = true;
          retryVideo.muted = true;
          retryVideo.playsInline = true;
          retryVideo.setAttribute('playsinline', 'true');
          retryVideo.setAttribute('muted', 'true');
          retryVideo.setAttribute('autoplay', 'true');
          retryVideo.play()
            .then(() => setCameraState('active'))
            .catch((e) => {
              console.error("Retried video playback failed:", e);
              setCameraState('active');
            });
        } else {
          setCameraState('active');
        }
      }, 50);
    }
  };

  // Stop camera tracks
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Initialize camera
  useEffect(() => {
    startCamera(facingMode);

    // Turn off camera on component unmount
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  // Capture the photo from the stream using a canvas
  const capturePhoto = () => {
    if (!videoRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      
      // Use the actual intrinsic video dimensions
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 640;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // If front-facing/selfie camera, mirror the canvas context drawing so the picture matches the mirrored viewport
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }

        // Draw the current video frame on the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Reset transform if changed
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Convert to high-quality compressed JPEG base64 URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        setCameraState('captured');
        onPhotoCaptured(dataUrl);
        
        // Immediately release the camera tracks when a photo is captured
        stopCamera();
      }
    } catch (err) {
      console.error("Failed to capture image:", err);
    }
  };

  // Flip facing direction
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  // Clear frozen photo and return to live stream
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  // Trigger base64 upload fallback
  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[82vh] px-4 py-4" id="camera-viewport-card">
      
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4" id="camera-header">
        <button
          onClick={() => {
            stopCamera();
            onCancel();
          }}
          className="flex items-center gap-1.5 text-brand-muted hover:text-brand-navy font-semibold py-2 px-4 rounded-full hover:bg-slate-100 transition-colors cursor-pointer text-sm"
          id="btn-close-camera"
          aria-label="Back to landing"
        >
          <X className="w-5 h-5" />
          Close
        </button>
        
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-teal bg-[#CCFBF1] px-3 py-1 rounded-full" id="camera-status-indicator">
          {cameraState === 'opening' && "Starting video..."}
          {cameraState === 'active' && "Live stream"}
          {cameraState === 'captured' && "Captured ready"}
          {cameraState === 'denied' && "Access blocked"}
        </div>
      </div>

      {/* Main Viewport Screen */}
      <div className="relative w-full aspect-square bg-[#1E293B] rounded-[32px] overflow-hidden shadow-lg flex items-center justify-center border-[8px] border-[#E2E8F0]" id="main-stream-area">
        
        {/* Render Video element when opening or active so videoRef is always populated and ready */}
        {(cameraState === 'opening' || cameraState === 'active') && (
          <div className="absolute inset-0 w-full h-full" id="live-camera-feed">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              id="raw-video-view"
            />
            
            {/* Soft Focus Frame Overlay */}
            <div className="absolute inset-6 border-2 border-white/20 rounded-2xl pointer-events-none flex items-center justify-center" id="focus-overlay">
              <div className="w-12 h-12 border-t-2 border-l-2 border-brand-teal absolute top-0 left-0 rounded-tl-lg"></div>
              <div className="w-12 h-12 border-t-2 border-r-2 border-brand-teal absolute top-0 right-0 rounded-tr-lg"></div>
              <div className="w-12 h-12 border-b-2 border-l-2 border-brand-teal absolute bottom-0 left-0 rounded-bl-lg"></div>
              <div className="w-12 h-12 border-b-2 border-r-2 border-brand-teal absolute bottom-0 right-0 rounded-br-lg"></div>
              
              {/* Subtle animated scanning laser line */}
              <div className="w-full h-[2px] bg-brand-teal/70 absolute top-0 scanner-line"></div>
            </div>
          </div>
        )}

        {/* State: Starting/Connecting stream loader overlay */}
        {cameraState === 'opening' && (
          <div className="absolute inset-0 bg-[#1E293B] flex flex-col items-center justify-center p-6 text-white space-y-3 z-10" id="loader-opening-state">
            <RefreshCw className="w-10 h-10 animate-spin text-teal-400 mx-auto" />
            <p className="font-display font-medium text-sm">Opening camera...</p>
            <p className="text-xs text-slate-400">Requesting media permission from browser</p>
          </div>
        )}

        {/* State: Freezeframe snapshot preview */}
        {cameraState === 'captured' && capturedImage && (
          <div className="w-full h-full" id="freeze-frame-feed">
            <img
              src={capturedImage}
              alt="Snapshot of target object"
              className="w-full h-full object-cover"
              id="snapshot-render"
            />
          </div>
        )}

        {/* State: Media error or permissions blocked */}
        {cameraState === 'denied' && (
          <div className="p-6 text-center text-brand-navy bg-white/95 w-full h-full flex flex-col items-center justify-center space-y-4" id="error-explain-card">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 border border-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <div className="space-y-1.5 max-w-xs">
              <h3 className="font-display font-semibold text-brand-navy" id="error-title-sub">Camera access blocked</h3>
              <p className="text-xs text-brand-muted leading-relaxed font-sans" id="error-desc-element">
                {errorMessage || "We need camera permissions to capture live footage."}
              </p>
            </div>

            <div className="pt-2 space-y-3 w-full max-w-[240px]">
              <button
                onClick={() => startCamera(facingMode)}
                className="w-full flex items-center justify-center gap-2 bg-brand-teal hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-full text-sm transition-colors cursor-pointer"
                id="btn-retry-camera"
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-brand-navy font-semibold py-2.5 px-4 rounded-full text-xs transition-colors cursor-pointer"
                id="btn-upload-direct"
              >
                <Upload className="w-3.5 h-3.5" />
                Choose photo file
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden fallback file uploader */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleLocalFileChange}
        className="hidden"
        id="camera-view-file-input"
        aria-hidden="true"
      />

      {/* Interactive Trigger and Action Control Panel */}
      <div className="bg-brand-card px-4 py-5 rounded-[24px] border border-slate-200 mt-4 flex flex-col items-center justify-center gap-4 shadow-sm" id="controls-footer">
        
        {cameraState === 'active' && (
          <div className="flex items-center justify-between w-full" id="live-row-controls">
            
            {/* Trigger facing toggler */}
            <button
              onClick={toggleFacingMode}
              className="flex flex-col items-center gap-1 text-brand-muted hover:text-brand-navy transition-colors justify-center w-12 h-12 rounded-xl active:bg-slate-100 cursor-pointer text-xs font-sans"
              id="btn-switch-lens"
              title="Flip camera direction"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="text-[10px] font-mono leading-none">Flip</span>
            </button>

            {/* Giant Snap Trigger */}
            <button
              onClick={capturePhoto}
              className="w-18 h-18 bg-brand-teal hover:bg-teal-700 p-1 rounded-full flex items-center justify-center cursor-pointer relative shadow-md hover:scale-105 active:scale-95 transition-all outline-none focus:ring-4 focus:ring-teal-100"
              id="btn-trigger-capture"
              aria-label="Capture snapshot"
            >
              <div className="w-full h-full rounded-full border-4 border-white"></div>
            </button>

            {/* Upload image backup inside camera */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-1 text-brand-muted hover:text-brand-navy transition-colors justify-center w-12 h-12 rounded-xl active:bg-slate-100 cursor-pointer text-xs font-sans"
              id="btn-camera-upload-trigger"
              title="Upload file"
            >
              <Upload className="w-5 h-5" />
              <span className="text-[10px] font-mono leading-none">Upload</span>
            </button>

          </div>
        )}

        {cameraState === 'captured' && capturedImage && (
          <div className="flex flex-col sm:flex-row gap-3 w-full" id="captured-row-controls">
            <button
              onClick={handleRetake}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-brand-navy font-bold py-3 px-5 rounded-full text-sm transition-colors cursor-pointer border border-slate-200"
              id="btn-retake"
            >
              <RefreshCw className="w-4 h-4" />
              Retake Photo
            </button>

            <button
              onClick={() => onAnalyze(capturedImage)}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-teal hover:bg-teal-700 text-white font-bold py-3 px-5 rounded-full text-sm transition-colors cursor-pointer shadow-sm active:scale-98"
              id="btn-analyze-captured"
            >
              <Sparkles className="w-4 h-4" />
              Analyze Object
            </button>
          </div>
        )}

        {cameraState === 'opening' && (
          <p className="text-xs text-brand-muted text-center font-sans font-medium">
            Please allow camera permissions if prompted by your browser window.
          </p>
        )}

        {cameraState === 'denied' && (
          <p className="text-xs text-brand-muted text-center font-sans font-medium">
            Or you can upload saved pictures from your photo library or disk.
          </p>
        )}
      </div>

    </div>
  );
}
