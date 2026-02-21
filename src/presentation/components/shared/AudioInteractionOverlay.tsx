'use client';

import { useSoundStore } from '@/src/presentation/hooks/useQueueSoundAlert';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { useEffect, useState } from 'react';
import { AudioInteractionClassicTemplate } from './templates/AudioInteractionClassicTemplate';
import { AudioInteractionEditorialTemplate } from './templates/AudioInteractionEditorialTemplate';
import { AudioInteractionRetroTechMagazineTemplate } from './templates/AudioInteractionRetroTechMagazineTemplate';

export function AudioInteractionOverlay() {
  const { soundEnabled } = useSoundStore();
  const { template } = useTemplate();
  const [hasInteracted, setHasInteracted] = useState(true); // Default true to avoid flash on mount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // User Activation API to detect if user has interacted with page yet in this session
    const interacted = typeof navigator !== 'undefined' && 'userActivation' in navigator 
      ? (navigator as any).userActivation.hasBeenActive 
      : false;

    setHasInteracted(interacted);

    if (!interacted) {
      const handleInteract = () => {
        setHasInteracted(true);
        window.removeEventListener('click', handleInteract, true);
        window.removeEventListener('touchstart', handleInteract, true);
        window.removeEventListener('keydown', handleInteract, true);
      };

      // Listen during capture phase to trigger as early as possible on any click
      window.addEventListener('click', handleInteract, true);
      window.addEventListener('touchstart', handleInteract, true);
      window.addEventListener('keydown', handleInteract, true);

      return () => {
        window.removeEventListener('click', handleInteract, true);
        window.removeEventListener('touchstart', handleInteract, true);
        window.removeEventListener('keydown', handleInteract, true);
      };
    }
  }, []);

  if (!mounted || !soundEnabled || hasInteracted) return null;

  return (
    <>
      {template === 'retroTechMagazine' && <AudioInteractionRetroTechMagazineTemplate />}
      {template === 'editorial' && <AudioInteractionEditorialTemplate />}
      {template === 'classic' && <AudioInteractionClassicTemplate />}
    </>
  );
}
