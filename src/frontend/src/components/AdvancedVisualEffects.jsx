import React, { useEffect, useRef, useState } from 'react';

function AdvancedVisualEffects({ gameState, currentLocation, isActive = true }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [glitchIntensity, setGlitchIntensity] = useState(0);

  // Particle system
  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleSystem = {
      particles: [],
      
      createParticle: (type, x, y) => {
        const particle = {
          id: Math.random(),
          x: x || Math.random() * canvas.width,
          y: y || Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 100,
          maxLife: 100,
          size: Math.random() * 3 + 1,
          type: type,
          color: getParticleColor(type),
          opacity: 1
        };
        return particle;
      },
      
      update: () => {
        // Add new particles based on game state
        if (Math.random() < 0.1) {
          const particleType = getParticleType();
          particleSystem.particles.push(
            particleSystem.createParticle(particleType)
          );
        }
        
        // Update existing particles
        particleSystem.particles = particleSystem.particles
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 1,
            opacity: p.life / p.maxLife
          }))
          .filter(p => p.life > 0 && p.x >= -50 && p.x <= canvas.width + 50 && p.y >= -50 && p.y <= canvas.height + 50);
        
        // Limit particle count for performance
        if (particleSystem.particles.length > 200) {
          particleSystem.particles = particleSystem.particles.slice(-200);
        }
      },
      
      draw: () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particleSystem.particles.forEach(p => {
          ctx.save();
          ctx.globalAlpha = p.opacity * 0.7;
          ctx.fillStyle = p.color;
          
          if (p.type === 'spark') {
            // Spark effect
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Trailing effect
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
            ctx.stroke();
          } else if (p.type === 'energy') {
            // Energy pulse
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'static') {
            // Digital static
            ctx.fillRect(p.x, p.y, 2, 2);
          }
          
          ctx.restore();
        });
        
        // Add screen effects based on game state
        drawScreenEffects(ctx);
      }
    };

    const getParticleType = () => {
      if (gameState.oxygenLevel < 30) return 'spark';
      if (gameState.powerLevel < 30) return 'static';
      if (currentLocation === 'engineering' || currentLocation === 'power_core') return 'energy';
      return 'energy';
    };

    const getParticleColor = (type) => {
      switch (type) {
        case 'spark': return '#ff3333';
        case 'energy': return '#00ffff';
        case 'static': return '#ffffff';
        default: return '#00ffff';
      }
    };

    const drawScreenEffects = (ctx) => {
      // Glitch effect when systems are critical
      if (gameState.oxygenLevel < 30 || gameState.powerLevel < 20) {
        if (Math.random() < 0.1) {
          const glitchHeight = Math.random() * 50 + 10;
          const glitchY = Math.random() * canvas.height;
          
          ctx.save();
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = '#ff0066';
          ctx.fillRect(0, glitchY, canvas.width, glitchHeight);
          
          // Horizontal line glitch
          ctx.fillStyle = '#00ff66';
          ctx.fillRect(0, glitchY + Math.random() * glitchHeight, canvas.width, 2);
          ctx.restore();
        }
      }
      
      // Scanner lines
      const scanLineY = (Date.now() / 50) % canvas.height;
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanLineY);
      ctx.lineTo(canvas.width, scanLineY);
      ctx.stroke();
      ctx.restore();
      
      // Corner vignette
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      
      ctx.save();
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    };

    const animate = () => {
      particleSystem.update();
      particleSystem.draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [gameState, currentLocation, isActive]);

  // Screen shake effect for critical moments
  const [screenShake, setScreenShake] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (gameState.oxygenLevel <= 20) {
      const shakeInterval = setInterval(() => {
        setScreenShake({
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4
        });
      }, 100);

      return () => clearInterval(shakeInterval);
    } else {
      setScreenShake({ x: 0, y: 0 });
    }
  }, [gameState.oxygenLevel]);

  if (!isActive) return null;

  return (
    <>
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5,
          transform: `translate(${screenShake.x}px, ${screenShake.y}px)`
        }}
      />
      
      {/* Screen Overlay Effects */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 6,
          background: gameState.oxygenLevel < 30 
            ? 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 0, 0.03) 2px, rgba(255, 0, 0, 0.03) 4px)' 
            : 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.02) 2px, rgba(0, 255, 255, 0.02) 4px)'
        }}
      />
      
      {/* Critical Alert Overlay */}
      {gameState.oxygenLevel <= 15 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            animation: 'criticalFlash 1s infinite',
            pointerEvents: 'none',
            zIndex: 7
          }}
        />
      )}
      
      {/* Power Failure Effect */}
      {gameState.powerLevel <= 10 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            pointerEvents: 'none',
            zIndex: 8,
            animation: 'powerFlicker 0.3s infinite'
          }}
        />
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes criticalFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes powerFlicker {
          0%, 90%, 100% { opacity: 0.7; }
          5%, 85% { opacity: 0.9; }
        }
        
        @keyframes screenGlitch {
          0% { transform: translate(0px, 0px) scale(1); }
          10% { transform: translate(-2px, -1px) scale(1.01); }
          20% { transform: translate(1px, 2px) scale(0.99); }
          30% { transform: translate(-1px, 1px) scale(1.01); }
          40% { transform: translate(2px, -1px) scale(0.99); }
          50% { transform: translate(-2px, 2px) scale(1.01); }
          60% { transform: translate(2px, 1px) scale(0.99); }
          70% { transform: translate(-1px, -1px) scale(1.01); }
          80% { transform: translate(1px, 2px) scale(0.99); }
          90% { transform: translate(-2px, -1px) scale(1.01); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </>
  );
}

export default AdvancedVisualEffects;
