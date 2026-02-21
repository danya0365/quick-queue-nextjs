'use client';

import { useCallback, useEffect, useRef } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SoundStore {
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const useSoundStore = create<SoundStore>()(
  persist(
    (set) => ({
      soundEnabled: false,
      setSoundEnabled: (val) =>
        set((state) => ({
          soundEnabled: typeof val === 'function' ? val(state.soundEnabled) : val,
        })),
    }),
    {
      name: 'queue-sound-storage', // บันทึกสถานะการเปิดเสียงลง localStorage
    }
  )
);

/**
 * Custom hook for playing a chime and text-to-speech announcement
 * when the current queue number changes.
 * Uses Zustand to persist the soundEnabled setting globally.
 */
export function useQueueSoundAlert(currentQueueNumber: number) {
  const { soundEnabled, setSoundEnabled } = useSoundStore();
  const prevQRef = useRef<number | null>(null);

  const playAlert = useCallback((qNum: number) => {
    try {
      // In browser environments only
      if (typeof window === 'undefined') return;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1108.73, ctx.currentTime + 0.3);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1);
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(`ขอเชิญคิวหมายเลข ${qNum} ค่ะ`);
        utterance.lang = 'th-TH';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }, 700);
    } catch (e) {
      console.error('Audio alert failed', e);
    }
  }, []);

  useEffect(() => {
    if (prevQRef.current === null) {
      prevQRef.current = currentQueueNumber; // Initialize
      return;
    }
    
    if (currentQueueNumber > 0 && currentQueueNumber !== prevQRef.current) {
      if (soundEnabled) {
        playAlert(currentQueueNumber);
      }
      prevQRef.current = currentQueueNumber;
    }
  }, [currentQueueNumber, soundEnabled, playAlert]);

  return { soundEnabled, setSoundEnabled };
}
