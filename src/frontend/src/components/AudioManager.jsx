import React, { useEffect, useRef, useState } from 'react';

function AudioManager({ gameState, lastAction, audioEnabled = true }) {
  const audioRef = useRef({});
  const [currentAmbient, setCurrentAmbient] = useState(null);

  // Audio files (you can replace with actual audio files)
  const audioSources = {
    ambient: {
      normal: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N+QQAoUXrTp66hVFApGn+L2u2ouBSuJzvLZiTcHGGi887eePRAMUafi+bZjGgU4k9n1y3QmBSh+zPLaiTMGF2e//72pUxALTKHl9bJmGAc4k9j2xnkpBSaCzvLZdCgFKOa75EBAAAA',
      emergency: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N+QQAoUXrTp66hVFApGn+L2u2ouBSuJzvLZiTcHGGi887eePRAMUafi+bZjGgU4k9n1y3QmBSh+zPLaiTMGF2e//72pUxALTKHl9bJmGAc4k9j2xnkpBSaCzvLZdCgFKOa75EBAAAA',
      critical: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N+QQAoUXrTp66hVFApGn+L2u2ouBSuJzvLZiTcHGGi887eePRAMUafi+bZjGgU4k9n1y3QmBSh+zPLaiTMGF2e//72pUxALTKHl9bJmGAc4k9j2xnkpBSaCzvLZdCgFKOa75EBAAAA'
    },
    effects: {
      success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N+QQAoUXrTp66hVFApGn+L2u2ouBSuJzvLZiTcHGGi887eePRAMUafi+bZjGgU4k9n1y3QmBSh+zPLaiTMGF2e//72pUxALTKHl9bJmGAc4k9j2xnkpBSaCzvLZdCgFKOa75EBAAAA',
      failure: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N+QQAoUXrTp66hVFApGn+L2u2ouBSuJzvLZiTcHGGi887eePRAMUafi+bZjGgU4k9n1y3QmBSh+zPLaiTMGF2e//72pUxALTKHl9bJmGAc4k9j2xnkpBSaCzvLZdCgFKOa75EBAAAA',
      beep: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N+QQAoUXrTp66hVFApGn+L2u2ouBSuJzvLZiTcHGGi887eePRAMUafi+bZjGgU4k9n1y3QmBSh+zPLaiTMGF2e//72pUxALTKHl9bJmGAc4k9j2xnkpBSaCzvLZdCgFKOa75EBAAAA',
      alert: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N+QQAoUXrTp66hVFApGn+L2u2ouBSuJzvLZiTcHGGi887eePRAMUafi+bZjGgU4k9n1y3QmBSh+zPLaiTMGF2e//72pUxALTKHl9bJmGAc4k9j2xnkpBSaCzvLZdCgFKOa75EBAAAA'
    }
  };

  // Initialize audio elements
  useEffect(() => {
    if (!audioEnabled) return;
    
    Object.entries(audioSources.ambient).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = 0.3;
      audioRef.current[`ambient_${key}`] = audio;
    });

    Object.entries(audioSources.effects).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.volume = 0.5;
      audioRef.current[`effect_${key}`] = audio;
    });
  }, [audioEnabled]);

  // Manage ambient audio based on game state
  useEffect(() => {
    if (!audioEnabled) return;

    let newAmbient = 'normal';
    if (gameState.oxygenLevel <= 30) newAmbient = 'critical';
    else if (gameState.oxygenLevel <= 60) newAmbient = 'emergency';

    if (newAmbient !== currentAmbient) {
      // Stop current ambient
      if (currentAmbient && audioRef.current[`ambient_${currentAmbient}`]) {
        audioRef.current[`ambient_${currentAmbient}`].pause();
      }
      
      // Start new ambient
      if (audioRef.current[`ambient_${newAmbient}`]) {
        audioRef.current[`ambient_${newAmbient}`].play().catch(() => {});
      }
      
      setCurrentAmbient(newAmbient);
    }
  }, [gameState.oxygenLevel, currentAmbient, audioEnabled]);

  // Play sound effects for actions
  useEffect(() => {
    if (!audioEnabled || !lastAction) return;

    let soundEffect = null;
    if (lastAction.type === 'take' && lastAction.success) soundEffect = 'success';
    else if (lastAction.type === 'use' && lastAction.success) soundEffect = 'beep';
    else if (lastAction.type === 'move') soundEffect = 'beep';
    else if (lastAction.success === false) soundEffect = 'failure';

    if (soundEffect && audioRef.current[`effect_${soundEffect}`]) {
      audioRef.current[`effect_${soundEffect}`].currentTime = 0;
      audioRef.current[`effect_${soundEffect}`].play().catch(() => {});
    }
  }, [lastAction, audioEnabled]);

  return null; // This component just manages audio, no UI
}

export default AudioManager;
