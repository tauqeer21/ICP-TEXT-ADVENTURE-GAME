import React, { useState, useEffect } from 'react';

function InteractiveShipMap({ currentLocation, visitedRooms, gameState, playerInventory, onCommand, onRoomHover }) {
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);
  const [particles, setParticles] = useState([]);

  const shipLayout = {
    // ... (keep your existing room layout)
    command_center: { x: 3, y: 2, name: 'Command Center', emoji: '🖥️', locked: false, status: 'emergency', canMoveTo: true },
    main_corridor: { x: 3, y: 3, name: 'Main Corridor', emoji: '⚡', locked: false, status: 'dim', canMoveTo: true },
    bridge: { x: 3, y: 0, name: 'Bridge', emoji: '🚀', locked: false, status: 'critical', canMoveTo: true },
    // ... add all other rooms with canMoveTo property
  };

  // Particle system for visual effects
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = [...prev];
        // Add new particle occasionally
        if (Math.random() < 0.3) {
          newParticles.push({
            id: Date.now(),
            x: Math.random() * 480,
            y: Math.random() * 350,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 100,
            color: gameState.oxygenLevel < 30 ? '#ff3333' : '#00ffff'
          });
        }
        // Update existing particles
        return newParticles
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 1
          }))
          .filter(p => p.life > 0 && p.x >= 0 && p.x <= 480 && p.y >= 0 && p.y <= 350);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameState.oxygenLevel]);

  const handleRoomClick = (roomId, room) => {
    if (roomId === currentLocation) {
      onCommand('look');
      return;
    }

    if (!room.canMoveTo || (room.locked && !canAccessRoom(roomId))) {
      const requirements = getRoomRequirements(roomId);
      setShowTooltip({
        roomId,
        message: `🔒 Access Denied - Required: ${requirements}`,
        type: 'error'
      });
      setTimeout(() => setShowTooltip(null), 3000);
      return;
    }

    // Find path and move
    const direction = getDirectionTo(roomId);
    if (direction) {
      onCommand(`go ${direction}`);
    }
  };

  const handleRoomHover = (roomId, room) => {
    setHoveredRoom(roomId);
    if (onRoomHover) {
      onRoomHover(roomId, room);
    }
  };

  const canAccessRoom = (roomId) => {
    const requirements = getRoomRequirements(roomId);
    return requirements.every(req => playerInventory.includes(req));
  };

  const getRoomRequirements = (roomId) => {
    const requirements = {
      navigation: ['bridge_key'],
      communications: ['nav_codes'],
      security: ['emergency_codes'],
      armory: ['security_badge'],
      engineering: ['power_cell'],
      power_core: ['fusion_key'],
      life_support: ['env_codes'],
      laboratory: ['research_pass'],
      ai_core: ['ai_activation_key', 'core_matrix']
    };
    return requirements[roomId] || [];
  };

  const getDirectionTo = (targetRoomId) => {
    // Simple pathfinding - you might want to implement A* for complex paths
    const currentRoom = shipLayout[currentLocation];
    const targetRoom = shipLayout[targetRoomId];
    
    if (!currentRoom || !targetRoom) return null;

    // Calculate direction based on grid positions
    const dx = targetRoom.x - currentRoom.x;
    const dy = targetRoom.y - currentRoom.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'east' : 'west';
    } else {
      return dy > 0 ? 'south' : 'north';
    }
  };

  return (
    <div className="interactive-ship-map" style={{
      backgroundColor: '#0a0a0a',
      border: '3px solid #ff6666',
      borderRadius: '12px',
      padding: '20px',
      position: 'relative',
      cursor: 'crosshair'
    }}>
      {/* Title with real-time status */}
      <div style={{
        textAlign: 'center',
        marginBottom: '15px',
        color: '#ff6666',
        fontSize: '18px',
        fontWeight: 'bold',
        textShadow: '0 0 10px #ff6666',
        animation: gameState.oxygenLevel < 30 ? 'pulse 1s infinite' : 'none'
      }}>
        🚨 USS PHOENIX - INTERACTIVE DECK PLAN 🚨
        <div style={{ fontSize: '12px', color: '#ffaa33', marginTop: '4px' }}>
          Click rooms to navigate | Hover for details | Right-click for options
        </div>
      </div>

      {/* SVG Map with Interactions */}
      <svg 
        width="480" 
        height="350" 
        style={{ 
          border: '2px solid #ff6666', 
          borderRadius: '8px', 
          backgroundColor: '#001111',
          filter: 'drop-shadow(0 0 15px #ff333366)'
        }}
      >
        {/* Animated particles */}
        {particles.map(particle => (
          <circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r="1"
            fill={particle.color}
            opacity={particle.life / 100}
          />
        ))}

        {/* Room nodes with click handlers */}
        {Object.entries(shipLayout).map(([roomId, room]) => (
          <g key={roomId}>
            {/* Clickable room area */}
            <rect
              x={room.x * 80 + 10}
              y={room.y * 70 + 10}
              width="60"
              height="50"
              rx="10"
              fill={currentLocation === roomId ? '#003366' : hoveredRoom === roomId ? '#002244' : '#001122'}
              stroke={hoveredRoom === roomId ? '#00ffff' : '#ff6666'}
              strokeWidth={currentLocation === roomId ? '4' : '2'}
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick(roomId, room)}
              onMouseEnter={() => handleRoomHover(roomId, room)}
              onMouseLeave={() => setHoveredRoom(null)}
            />
            
            {/* Room emoji */}
            <text
              x={room.x * 80 + 40}
              y={room.y * 70 + 35}
              textAnchor="middle"
              fontSize="20"
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => handleRoomClick(roomId, room)}
            >
              {room.emoji}
            </text>
            
            {/* Lock indicator */}
            {room.locked && !canAccessRoom(roomId) && (
              <text
                x={room.x * 80 + 55}
                y={room.y * 70 + 20}
                fontSize="12"
                fill="#ff6666"
              >
                🔒
              </text>
            )}
            
            {/* Hover glow effect */}
            {hoveredRoom === roomId && (
              <circle
                cx={room.x * 80 + 40}
                cy={room.y * 70 + 35}
                r="30"
                fill="none"
                stroke="#00ffff"
                strokeWidth="2"
                opacity="0.5"
              />
            )}
          </g>
        ))}

        {/* Player avatar with click indicator */}
        <g>
          <circle
            cx={shipLayout[currentLocation]?.x * 80 + 15 || 0}
            cy={shipLayout[currentLocation]?.y * 70 + 20 || 0}
            r="12"
            fill="#00ffff"
            opacity="0.3"
          >
            <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text
            x={shipLayout[currentLocation]?.x * 80 + 15 || 0}
            y={shipLayout[currentLocation]?.y * 70 + 25 || 0}
            textAnchor="middle"
            fontSize="14"
            fill="#00ffff"
          >
            👤
          </text>
        </g>
      </svg>

      {/* Tooltip */}
      {showTooltip && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: showTooltip.type === 'error' ? '#330000' : '#003300',
          border: `2px solid ${showTooltip.type === 'error' ? '#ff3333' : '#00ff88'}`,
          borderRadius: '8px',
          padding: '12px',
          color: 'white',
          fontSize: '14px',
          textAlign: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          {showTooltip.message}
        </div>
      )}

      {/* Navigation Controls */}
      <div style={{
        marginTop: '15px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px'
      }}>
        <button
          onClick={() => onCommand('go north')}
          style={{
            padding: '8px',
            backgroundColor: '#003366',
            border: '1px solid #0066ff',
            borderRadius: '4px',
            color: '#0066ff',
            cursor: 'pointer'
          }}
        >
          ⬆️ North
        </button>
        <button
          onClick={() => onCommand('look')}
          style={{
            padding: '8px',
            backgroundColor: '#330066',
            border: '1px solid #6600ff',
            borderRadius: '4px',
            color: '#6600ff',
            cursor: 'pointer'
          }}
        >
          👁️ Look
        </button>
        <button
          onClick={() => onCommand('go south')}
          style={{
            padding: '8px',
            backgroundColor: '#003366',
            border: '1px solid #0066ff',
            borderRadius: '4px',
            color: '#0066ff',
            cursor: 'pointer'
          }}
        >
          ⬇️ South
        </button>
        <button
          onClick={() => onCommand('go west')}
          style={{
            padding: '8px',
            backgroundColor: '#003366',
            border: '1px solid #0066ff',
            borderRadius: '4px',
            color: '#0066ff',
            cursor: 'pointer'
          }}
        >
          ⬅️ West
        </button>
        <button
          onClick={() => onCommand('inventory')}
          style={{
            padding: '8px',
            backgroundColor: '#006633',
            border: '1px solid #00ff66',
            borderRadius: '4px',
            color: '#00ff66',
            cursor: 'pointer'
          }}
        >
          🎒 Items
        </button>
        <button
          onClick={() => onCommand('go east')}
          style={{
            padding: '8px',
            backgroundColor: '#003366',
            border: '1px solid #0066ff',
            borderRadius: '4px',
            color: '#0066ff',
            cursor: 'pointer'
          }}
        >
          ➡️ East
        </button>
      </div>
    </div>
  );
}

export default InteractiveShipMap;
