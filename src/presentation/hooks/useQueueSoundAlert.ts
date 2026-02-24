'use client';

import { formatQueueNumber } from '@/src/config/queue-display.config';
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
      soundEnabled: true,
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
        const formattedQ = formatQueueNumber(qNum);
        
        // Map English characters and numbers to their Thai pronunciation for TTS
        const charToThaiPhonetic: Record<string, string> = {
          'A': 'เอ', 'B': 'บี', 'C': 'ซี', 'D': 'ดี', 'E': 'อี', 
          'F': 'เอฟ', 'G': 'จี', 'H': 'เอช', 'I': 'ไอ', 'J': 'เจ',
          'K': 'เค', 'L': 'แอล', 'M': 'เอ็ม', 'N': 'เอ็น', 'O': 'โอ',
          'P': 'พี', 'Q': 'คิว', 'R': 'อาร์', 'S': 'เอส', 'T': 'ที',
          'U': 'ยู', 'V': 'วี', 'W': 'ดับเบิลยู', 'X': 'เอ็กซ์', 'Y': 'วาย', 'Z': 'แซด',
          '0': 'ศูนย์', '1': 'หนึ่ง', '2': 'สอง', '3': 'สาม', '4': 'สี่',
          '5': 'ห้า', '6': 'หก', '7': 'เจ็ด', '8': 'แปด', '9': 'เก้า'
        };

        // Split into characters, map to phonetic Thai, and join with a space and a hyphen (to force a distinct pause)
        const spokenQ = formattedQ
          .split('')
          .map(char => charToThaiPhonetic[char.toUpperCase()] || char)
          .join(' ');
        
        // Add additional text to force spacing between the letter (first char) and numbers
        const parts = spokenQ.split(' ');
        const finalSpokenQ = parts.length > 1 ? `${parts[0]} ... ${parts.slice(1).join(' ... ')}` : spokenQ;

        console.log('finalSpokenQ', finalSpokenQ);
        
        const utterance = new SpeechSynthesisUtterance(`ขอเชิญคิวหมายเลข ${finalSpokenQ} ค่ะ`);
        utterance.lang = 'th-TH';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }, 700);
    } catch (e) {
      console.error('Audio alert failed', e);
    }
  }, []);

  useEffect(() => {
    if (currentQueueNumber > 0 && currentQueueNumber !== prevQRef.current) {
      if (soundEnabled) {
        playAlert(currentQueueNumber);
      }
      prevQRef.current = currentQueueNumber;
    }
  }, [currentQueueNumber, soundEnabled, playAlert]);

  return { soundEnabled, setSoundEnabled };
}
