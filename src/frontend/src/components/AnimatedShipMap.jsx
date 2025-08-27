import React, { useState, useEffect } from 'react';

function AnimatedShipMap({ currentLocation, visitedRooms, gameState, playerInventory, lastAction }) {
  const [playerPosition, setPlayerPosition] = useState({ x: 3, y: 2 });
  const [isMoving, setIsMoving] = useState(false);
  const [showItemPickup, setShowItemPickup] = useState(null);
  const [showActivity, setShowActivity] = useState(null);

  const shipLayout = {
    bridge: { x: 3, y: 0, name: 'Bridge', emoji: '🚀', locked: false, status: 'critical' },
    navigation: { x: 4, y: 0, name: 'Navigation', emoji: '🧭', locked: true, status: 'offline' },
    communications: { x: 5, y: 0, name: 'Comms', emoji: '📡', locked: true, status: 'offline' },
    
    corridor_1: { x: 3, y: 1, name: 'Corridor', emoji: '🚪', locked: false, status: 'dim' },
    security: { x: 2, y: 1, name: 'Security', emoji: '🔒', locked: true, status: 'offline' },
    armory: { x: 4, y: 1, name: 'Armory', emoji: '⚔️', locked: true, status: 'sealed' },
    
    command_center: { x: 3, y: 2, name: 'Command Center', emoji: '🖥️', locked: false, status: 'emergency' },
    main_corridor: { x: 3, y: 3, name: 'Main Corridor', emoji: '⚡', locked: false, status: 'dim' },
    
    engineering: { x: 1, y: 3, name: 'Engineering', emoji: '⚙️', locked: true, status: 'critical' },
    power_core: { x: 2, y: 3, name: 'Power Core', emoji: '⚛️', locked: true, status: 'offline' },
    life_support: { x: 4, y: 3, name: 'Life Support', emoji: '🌬️', locked: true, status: 'failing' },
    laboratory: { x: 5, y: 3, name: 'Laboratory', emoji: '🧪', locked: true, status: 'sealed' },
    
    ai_core: { x: 3, y: 4, name: 'AI Core', emoji: '🤖', locked: true, status: 'shutdown' }
  };

  // Update player position when location changes
  useEffect(() => {
    const room = shipLayout[currentLocation];
    if (room) {
      setIsMoving(true);
      setTimeout(() => {
        setPlayerPosition({ x: room.x, y: room.y });
        setIsMoving(false);
      }, 500);
    }
  }, [currentLocation]);

  // Show pickup animation
  useEffect(() => {
    if (lastAction?.type === 'take' && lastAction?.success) {
      setShowItemPickup(lastAction.item);
      setTimeout(() => setShowItemPickup(null), 2000);
    }
  }, [lastAction]);

  // Show activity animation
  useEffect(() => {
    if (lastAction?.type === 'use' || lastAction?.type === 'examine') {
      setShowActivity(lastAction.type);
      setTimeout(() => setShowActivity(null), 1500);
    }
  }, [lastAction]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'critical': return '#ff3333';
      case 'offline': return '#666666';
      case 'failing': return '#ff9933';
      case 'sealed': return '#9933ff';
      case 'shutdown': return '#ff0066';
      case 'emergency': return '#ffff33';
      case 'dim': return '#336666';
      default: return '#00ffff';
    }
  };

  const isVisited = (roomId) => visitedRooms.includes(roomId);
  const isCurrent = (roomId) => currentLocation === roomId;

  const connections = [
    { from: [3, 0], to: [4, 0] }, { from: [4, 0], to: [5, 0] },
    { from: [2, 1], to: [3, 1] }, { from: [3, 1], to: [4, 1] },
    { from: [1, 3], to: [2, 3] }, { from: [2, 3], to: [3, 3] }, { from: [3, 3], to: [4, 3] }, { from: [4, 3], to: [5, 3] },
    { from: [3, 0], to: [3, 1] }, { from: [3, 1], to: [3, 2] }, { from: [3, 2], to: [3, 3] }, { from: [3, 3], to: [3, 4] }
  ];

  return (
    <div className="animated-ship-map" style={{
      backgroundColor: '#0a0a0a',
      border: '3px solid #ff6666',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 0 30px #ff666666',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '15px',
        color: '#ff6666',
        fontSize: '18px',
        fontWeight: 'bold',
        textShadow: '0 0 10px #ff6666'
      }}>
        🚨 USS PHOENIX - DECK PLAN 🚨
      </div>

      {/* SVG Map */}
      <svg width="480" height="350" style={{ 
        border: '2px solid #ff6666', 
        borderRadius: '8px', 
        backgroundColor: '#001111',
        filter: 'drop-shadow(0 0 15px #ff333366)'
      }}>
        {/* Animated Background Grid */}
        <defs>
          <pattern id="animatedGrid" width="80" height="70" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 70" fill="none" stroke="#333333" strokeWidth="1" opacity="0.3">
              <animate attributeName="opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite"/>
            </path>
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect width="480" height="350" fill="url(#animatedGrid)"/>
        
        {/* Connection lines with power flow animation */}
        {connections.map((conn, index) => {
          const [x1, y1] = conn.from;
          const [x2, y2] = conn.to;
          return (
            <g key={index}>
              <line
                x1={x1 * 80 + 40}
                y1={y1 * 70 + 35}
                x2={x2 * 80 + 40}
                y2={y2 * 70 + 35}
                stroke="#444444"
                strokeWidth="4"
                strokeDasharray="8,4"
              />
              <line
                x1={x1 * 80 + 40}
                y1={y1 * 70 + 35}
                x2={x2 * 80 + 40}
                y2={y2 * 70 + 35}
                stroke="#00ffff"
                strokeWidth="2"
                strokeDasharray="4,8"
                opacity="0.6"
              >
                <animate attributeName="stroke-dashoffset" values="0;12;0" dur="2s" repeatCount="indefinite"/>
              </line>
            </g>
          );
        })}
        
        {/* Room nodes */}
        {Object.entries(shipLayout).map(([roomId, room]) => (
          <g key={roomId}>
            {/* Room background with status glow */}
            <rect
              x={room.x * 80 + 10}
              y={room.y * 70 + 10}
              width="60"
              height="50"
              rx="10"
              fill={isCurrent(roomId) ? '#003366' : isVisited(roomId) ? '#001122' : '#000811'}
              stroke={getStatusColor(room.status)}
              strokeWidth={isCurrent(roomId) ? '4' : '2'}
              opacity="0.9"
              filter={isCurrent(roomId) ? "url(#glow)" : "none"}
            >
              {isCurrent(roomId) && (
                <animate attributeName="stroke-width" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>
              )}
            </rect>
            
            {/* Room emoji */}
            <text
              x={room.x * 80 + 40}
              y={room.y * 70 + 35}
              textAnchor="middle"
              fontSize="20"
              filter="url(#glow)"
            >
              {room.emoji}
            </text>
            
            {/* Room name */}
            <text
              x={room.x * 80 + 40}
              y={room.y * 70 + 52}
              textAnchor="middle"
              fill={isCurrent(roomId) ? '#ffffff' : '#cccccc'}
              fontSize="10"
              fontWeight={isCurrent(roomId) ? 'bold' : 'normal'}
            >
              {room.name}
            </text>
          </g>
        ))}
        
        {/* Animated Player Avatar */}
        <g>
          <circle
            cx={playerPosition.x * 80 + 15}
            cy={playerPosition.y * 70 + 20}
            r="8"
            fill="#00ffff"
            opacity="0.3"
          >
            <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
          </circle>
          
          <text
            x={playerPosition.x * 80 + 15}
            y={playerPosition.y * 70 + 25}
            textAnchor="middle"
            fontSize="14"
            fill="#00ffff"
            filter="url(#glow)"
            className={isMoving ? 'moving-avatar' : ''}
          >
            👤
          </text>
          
          {isMoving && (
            <circle
              cx={playerPosition.x * 80 + 15}
              cy={playerPosition.y * 70 + 20}
              r="5"
              fill="none"
              stroke="#00ffff"
              strokeWidth="2"
            >
              <animate attributeName="r" values="5;20;5" dur="0.5s"/>
              <animate attributeName="opacity" values="1;0;1" dur="0.5s"/>
            </circle>
          )}
        </g>
        
        {/* Item Pickup Animation */}
        {showItemPickup && (
          <g>
            <text
              x={playerPosition.x * 80 + 40}
              y={playerPosition.y * 70 + 10}
              textAnchor="middle"
              fontSize="12"
              fill="#00ff88"
              fontWeight="bold"
            >
              +{showItemPickup}
              <animate attributeName="y" values={playerPosition.y * 70 + 10 + ";" + (playerPosition.y * 70 - 10)} dur="2s"/>
              <animate attributeName="opacity" values="1;1;0" dur="2s"/>
            </text>
          </g>
        )}
        
        {/* Activity Animation */}
        {showActivity && (
          <g>
            <circle
              cx={playerPosition.x * 80 + 40}
              cy={playerPosition.y * 70 + 35}
              r="25"
              fill="none"
              stroke="#ffff33"
              strokeWidth="3"
              opacity="0.7"
            >
              <animate attributeName="r" values="15;35;15" dur="1.5s"/>
              <animate attributeName="opacity" values="0.7;0;0.7" dur="1.5s"/>
            </circle>
            <text
              x={playerPosition.x * 80 + 40}
              y={playerPosition.y * 70 + 40}
              textAnchor="middle"
              fontSize="16"
              fill="#ffff33"
            >
              {showActivity === 'use' ? '⚡' : '🔍'}
            </text>
          </g>
        )}
        
        {/* Emergency Alert Overlay */}
        <rect x="0" y="0" width="480" height="350" fill="none" stroke="#ff3333" strokeWidth="3" rx="8" strokeDasharray="15,10">
          <animate attributeName="stroke-dashoffset" values="0;25;0" dur="3s" repeatCount="indefinite"/>
        </rect>
      </svg>

      {/* Mission Status */}
      <div style={{
        marginTop: '15px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px'
      }}>
        <div style={{
          padding: '10px',
          backgroundColor: '#110000',
          border: '1px solid #ff6666',
          borderRadius: '6px'
        }}>
          <div style={{ color: '#ff6666', fontSize: '12px', fontWeight: 'bold' }}>
            🚨 LIFE SUPPORT
          </div>
          <div style={{ color: '#ffffff', fontSize: '14px' }}>
            {gameState.oxygenLevel || 100}%
          </div>
        </div>
        
        <div style={{
          padding: '10px',
          backgroundColor: '#001100',
          border: '1px solid #00ff88',
          borderRadius: '6px'
        }}>
          <div style={{ color: '#00ff88', fontSize: '12px', fontWeight: 'bold' }}>
            📍 LOCATION
          </div>
          <div style={{ color: '#ffffff', fontSize: '11px' }}>
            {shipLayout[currentLocation]?.name || currentLocation}
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        .moving-avatar {
          animation: bounce 0.5s ease-in-out;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}

export default AnimatedShipMap;
