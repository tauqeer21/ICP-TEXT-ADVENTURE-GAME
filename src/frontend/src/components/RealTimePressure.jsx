import React, { useEffect, useRef } from 'react';

function RealTimePressure({ gameState, onGameStateUpdate, isActive = true }) {
  const intervalRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());
  const eventCooldownRef = useRef(0);

  useEffect(() => {
    if (!isActive || gameState.gameCompleted) return;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeDelta = (now - lastUpdateRef.current) / 1000; // seconds
      lastUpdateRef.current = now;

      let newGameState = { ...gameState };
      let hasChanges = false;
      let emergencyEvents = [];

      // Oxygen depletion based on real-time and location
      const oxygenDepletionRate = getOxygenDepletionRate(gameState.location, gameState.powerLevel);
      const oxygenLoss = oxygenDepletionRate * timeDelta;
      
      if (oxygenLoss > 0) {
        newGameState.oxygenLevel = Math.max(0, gameState.oxygenLevel - oxygenLoss);
        hasChanges = true;

        // Critical oxygen events
        if (newGameState.oxygenLevel <= 20 && gameState.oxygenLevel > 20) {
          emergencyEvents.push({
            type: 'oxygen_critical',
            message: '🚨 CRITICAL: Oxygen levels dangerously low! Seek life support immediately!',
            priority: 'critical'
          });
        } else if (newGameState.oxygenLevel <= 50 && gameState.oxygenLevel > 50) {
          emergencyEvents.push({
            type: 'oxygen_warning',
            message: '⚠️ WARNING: Oxygen levels decreasing. Consider finding life support systems.',
            priority: 'warning'
          });
        }
      }

      // Power fluctuation and recovery
      const powerChange = getPowerChange(gameState.location, timeDelta);
      if (powerChange !== 0) {
        newGameState.powerLevel = Math.max(0, Math.min(100, gameState.powerLevel + powerChange));
        hasChanges = true;
      }

      // Random system failures and events
      eventCooldownRef.current -= timeDelta;
      if (eventCooldownRef.current <= 0 && Math.random() < 0.1) {
        const event = generateRandomEvent(gameState);
        if (event) {
          emergencyEvents.push(event);
          eventCooldownRef.current = 15; // 15 second cooldown between events
          
          // Apply event effects
          if (event.effects) {
            Object.assign(newGameState, event.effects);
            hasChanges = true;
          }
        }
      }

      // Auto-save and level progression
      if (hasChanges) {
        // Auto-level up based on survival time
        const survivalMinutes = Math.floor(gameState.commandCount / 12); // Rough time estimate
        const expectedLevel = Math.floor(survivalMinutes / 2) + 1;
        if (expectedLevel > gameState.level) {
          newGameState.level = expectedLevel;
          emergencyEvents.push({
            type: 'level_up',
            message: `⚡ EXPERIENCE GAINED: Survival expertise increased to Level ${expectedLevel}!`,
            priority: 'success'
          });
        }

        onGameStateUpdate(newGameState, emergencyEvents);
      }
    }, 1000); // Update every second

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState, isActive, onGameStateUpdate]);

  const getOxygenDepletionRate = (location, powerLevel) => {
    let baseRate = 0.1; // 0.1% per second base rate
    
    // Location-based modifiers
    switch (location) {
      case 'life_support':
        baseRate *= 0.5; // 50% slower depletion in life support
        break;
      case 'ai_core':
      case 'reactor_core':
        baseRate *= 1.5; // 50% faster in dangerous areas
        break;
      case 'engineering':
        baseRate *= 1.2; // 20% faster in engineering
        break;
      default:
        baseRate *= 1.0; // Normal rate
    }
    
    // Power level affects life support efficiency
    if (powerLevel < 30) {
      baseRate *= 1.8; // Much faster depletion with low power
    } else if (powerLevel < 60) {
      baseRate *= 1.3; // Moderately faster with medium power
    }
    
    return baseRate;
  };

  const getPowerChange = (location, timeDelta) => {
    let powerChange = 0;
    
    // Gradual power restoration in engineering areas
    if (location === 'engineering' || location === 'power_core') {
      powerChange = 0.5 * timeDelta; // Slow power recovery
    }
    
    // Power drain in high-consumption areas
    if (location === 'laboratory' || location === 'bridge') {
      powerChange = -0.2 * timeDelta; // Slow power drain
    }
    
    return powerChange;
  };

  const generateRandomEvent = (gameState) => {
    const events = [
      {
        type: 'system_malfunction',
        message: '⚠️ ALERT: Minor system malfunction detected. Efficiency reduced temporarily.',
        priority: 'warning',
        probability: 0.3,
        condition: () => gameState.powerLevel > 20,
        effects: { powerLevel: gameState.powerLevel - 5 }
      },
      {
        type: 'air_leak',
        message: '🚨 EMERGENCY: Micro hull breach detected! Oxygen depletion accelerated!',
        priority: 'critical',
        probability: 0.1,
        condition: () => gameState.oxygenLevel > 30,
        effects: { oxygenLevel: gameState.oxygenLevel - 10 }
      },
      {
        type: 'power_surge',
        message: '⚡ SYSTEM EVENT: Power surge detected. Systems temporarily boosted.',
        priority: 'success',
        probability: 0.2,
        condition: () => gameState.powerLevel < 80,
        effects: { powerLevel: Math.min(100, gameState.powerLevel + 15) }
      },
      {
        type: 'backup_oxygen',
        message: '🫁 SYSTEM RECOVERY: Emergency oxygen reserves activated.',
        priority: 'success',
        probability: 0.15,
        condition: () => gameState.oxygenLevel < 40,
        effects: { oxygenLevel: Math.min(100, gameState.oxygenLevel + 20) }
      },
      {
        type: 'contamination_warning',
        message: '☣️ ALERT: Environmental contamination detected in current sector.',
        priority: 'warning',
        probability: 0.1,
        condition: () => ['laboratory', 'reactor_core'].includes(gameState.location)
      }
    ];

    const availableEvents = events.filter(event => 
      Math.random() < event.probability && 
      (!event.condition || event.condition())
    );

    return availableEvents.length > 0 
      ? availableEvents[Math.floor(Math.random() * availableEvents.length)]
      : null;
  };

  return null; // This component manages background processes, no UI
}

export default RealTimePressure;
