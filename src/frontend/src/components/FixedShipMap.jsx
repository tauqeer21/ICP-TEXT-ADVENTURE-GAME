import React, { useState, useEffect } from 'react';

function FixedShipMap({ currentLocation, visitedRooms, gameState, lastAction, rooms, onCommand }) {
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [playerAnimation, setPlayerAnimation] = useState(false);

  // Complete 16-room ship layout with proper positioning
  const shipLayout = {
    // TOP LEVEL - Bridge Deck
    communications: { x: 1, y: 0, name: 'Comms', emoji: '📡' },
    bridge: { x: 2, y: 0, name: 'Bridge', emoji: '🚀' },
    navigation: { x: 3, y: 0, name: 'Navigation', emoji: '🧭' },
    
    // SECOND LEVEL - Command Deck
    command_center: { x: 2, y: 1, name: 'Command', emoji: '🖥️' },
    
    // THIRD LEVEL - Main Deck
    engineering: { x: 0, y: 2, name: 'Engineering', emoji: '⚙️' },
    main_corridor: { x: 1, y: 2, name: 'Corridor', emoji: '⚡' },
    security: { x: 2, y: 2, name: 'Security', emoji: '🔒' },
    life_support: { x: 3, y: 2, name: 'Life Support', emoji: '🌬️' },
    
    // FOURTH LEVEL - Lower Deck
    power_core: { x: 0, y: 3, name: 'Power Core', emoji: '⚛️' },
    medical_bay: { x: 1, y: 3, name: 'Medical', emoji: '🏥' },
    armory: { x: 2, y: 3, name: 'Armory', emoji: '⚔️' },
    laboratory: { x: 3, y: 3, name: 'Laboratory', emoji: '🧪' },
    
    // FIFTH LEVEL - Storage/Utilities
    cargo_bay: { x: 1, y: 4, name: 'Cargo Bay', emoji: '📦' },
    fabrication: { x: 2, y: 4, name: 'Fabrication', emoji: '🔧' },
    
    // BOTTOM LEVEL - Critical Systems
    detention: { x: 1, y: 5, name: 'Detention', emoji: '🚔' },
    ai_core: { x: 2, y: 5, name: 'AI Core', emoji: '🤖' }
  };

  // Connection lines between rooms
  const connections = [
    // Bridge level connections
    { from: 'communications', to: 'bridge' },
    { from: 'bridge', to: 'navigation' },
    
    // Vertical connections
    { from: 'bridge', to: 'command_center' },
    { from: 'command_center', to: 'main_corridor' },
    
    // Main deck horizontal connections
    { from: 'engineering', to: 'main_corridor' },
    { from: 'main_corridor', to: 'security' },
    { from: 'security', to: 'life_support' },
    
    // Lower deck connections
    { from: 'engineering', to: 'power_core' },
    { from: 'main_corridor', to: 'medical_bay' },
    { from: 'security', to: 'armory' },
    { from: 'life_support', to: 'laboratory' },
    
    // Storage level
    { from: 'medical_bay', to: 'cargo_bay' },
    { from: 'armory', to: 'fabrication' },
    { from: 'laboratory', to: 'fabrication' },
    
    // Bottom level
    { from: 'cargo_bay', to: 'detention' },
    { from: 'fabrication', to: 'ai_core' },
    { from: 'detention', to: 'ai_core' }
  ];

  // Animate player movement
  useEffect(() => {
    if (lastAction?.type === 'move') {
      setPlayerAnimation(true);
      const timer = setTimeout(() => setPlayerAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [lastAction]);

  const isVisited = (roomId) => visitedRooms.includes(roomId);
  const isCurrent = (roomId) => currentLocation === roomId;
  const isLocked = (roomId) => {
    const room = rooms[roomId];
    if (!room?.locked) return false;
    const requirements = room.unlockRequires || [];
    return !requirements.every(req => gameState.inventory?.includes(req));
  };

  const getRoomColor = (roomId) => {
    if (isCurrent(roomId)) return '#00ffff';
    if (isLocked(roomId)) return '#ff3333';
    if (isVisited(roomId)) return '#ffaa33';
    return '#666666';
  };

  const handleRoomClick = (roomId) => {
    if (roomId === currentLocation) {
      onCommand('look');
      return;
    }
    
    if (isLocked(roomId)) {
      return; // Can't move to locked rooms
    }

    // Simple pathfinding - find direction
    const currentRoom = shipLayout[currentLocation];
    const targetRoom = shipLayout[roomId];
    
    if (!currentRoom || !targetRoom) return;
    
    const dx = targetRoom.x - currentRoom.x;
    const dy = targetRoom.y - currentRoom.y;
    
    let direction;
    if (Math.abs(dx) > Math.abs(dy)) {
      direction = dx > 0 ? 'east' : 'west';
    } else {
      direction = dy > 0 ? 'south' : 'north';
    }
    
    // Check if this direction is valid from current room
    const roomData = rooms[currentLocation];
    if (roomData?.exits?.[direction]) {
      onCommand(`go ${direction}`);
    }
  };

  return (
    <div className="fixed-ship-map" style={{
      width: '600px',
      height: '500px',
      backgroundColor: '#0a0a0a',
      border: '3px solid #ff6666',
      borderRadius: '12px',
      padding: '20px',
      position: 'relative',
      userSelect: 'none'
    }}>
      {/* Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '15px',
        color: '#ff6666',
        fontSize: '16px',
        fontWeight: 'bold',
        textShadow: '0 0 10px #ff6666'
      }}>
        🚨 USS PHOENIX - ALL DECKS 🚨
      </div>

      {/* SVG Ship Layout */}
      <svg width="560" height="420" style={{ 
        border: '2px solid #ff6666', 
        borderRadius: '8px', 
        backgroundColor: '#001111'
      }}>
        {/* Grid Background */}
        <defs>
          <pattern id="shipGrid" width="140" height="70" patternUnits="userSpaceOnUse">
            <path d="M 140 0 L 0 0 0 70" fill="none" stroke="#333333" strokeWidth="1" opacity="0.2"/>
          </pattern>
        </defs>
        <rect width="560" height="420" fill="url(#shipGrid)"/>
        
        {/* Connection Lines */}
        {connections.map((conn, index) => {
          const fromRoom = shipLayout[conn.from];
          const toRoom = shipLayout[conn.to];
          if (!fromRoom || !toRoom) return null;
          
          return (
            <line
              key={index}
              x1={fromRoom.x * 140 + 70}
              y1={fromRoom.y * 70 + 35}
              x2={toRoom.x * 140 + 70}
              y2={toRoom.y * 70 + 35}
              stroke="#444444"
              strokeWidth="3"
              strokeDasharray="8,4"
            />
          );
        })}
        
        {/* Room Nodes */}
        {Object.entries(shipLayout).map(([roomId, room]) => {
          const roomExists = rooms[roomId];
          if (!roomExists) return null;
          
          return (
            <g key={roomId}>
              {/* Room Background */}
              <rect
                x={room.x * 140 + 20}
                y={room.y * 70 + 10}
                width="100"
                height="50"
                rx="8"
                fill={isCurrent(roomId) ? '#003366' : isVisited(roomId) ? '#002211' : '#001122'}
                stroke={getRoomColor(roomId)}
                strokeWidth={isCurrent(roomId) ? '3' : '2'}
                style={{ cursor: 'pointer' }}
                onClick={() => handleRoomClick(roomId)}
                onMouseEnter={() => setHoveredRoom(roomId)}
                onMouseLeave={() => setHoveredRoom(null)}
              />
              
              {/* Room Emoji */}
              <text
                x={room.x * 140 + 70}
                y={room.y * 70 + 30}
                textAnchor="middle"
                fontSize="20"
                style={{ cursor: 'pointer' }}
                onClick={() => handleRoomClick(roomId)}
              >
                {room.emoji}
              </text>
              
              {/* Room Name */}
              <text
                x={room.x * 140 + 70}
                y={room.y * 70 + 48}
                textAnchor="middle"
                fill={getRoomColor(roomId)}
                fontSize="10"
                fontWeight={isCurrent(roomId) ? 'bold' : 'normal'}
                style={{ cursor: 'pointer' }}
                onClick={() => handleRoomClick(roomId)}
              >
                {room.name}
              </text>
              
              {/* Lock Indicator */}
              {isLocked(roomId) && (
                <text
                  x={room.x * 140 + 100}
                  y={room.y * 70 + 20}
                  fontSize="12"
                  fill="#ff3333"
                >
                  🔒
                </text>
              )}
              
              {/* Current Player Indicator */}
              {isCurrent(roomId) && (
                <g>
                  <circle
                    cx={room.x * 140 + 40}
                    cy={room.y * 70 + 25}
                    r="8"
                    fill="#00ffff"
                    opacity="0.6"
                  >
                    {playerAnimation && (
                      <animate attributeName="r" values="8;15;8" dur="1s" />
                    )}
                  </circle>
                  <text
                    x={room.x * 140 + 40}
                    y={room.y * 70 + 30}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#ffffff"
                  >
                    👤
                  </text>
                </g>
              )}
              
              {/* Hover Effect */}
              {hoveredRoom === roomId && (
                <rect
                  x={room.x * 140 + 20}
                  y={room.y * 70 + 10}
                  width="100"
                  height="50"
                  rx="8"
                  fill="none"
                  stroke="#00ffff"
                  strokeWidth="2"
                  opacity="0.7"
                />
              )}
            </g>
          );
        })}
        
        {/* Ship Hull Outline */}
        <rect 
          x="10" 
          y="10" 
          width="540" 
          height="400" 
          fill="none" 
          stroke="#ff6666" 
          strokeWidth="3" 
          rx="20" 
          strokeDasharray="15,10"
        />
        
        {/* Deck Labels */}
        <g>
          <text x="10" y="25" fill="#ffaa33" fontSize="10" fontWeight="bold">BRIDGE DECK</text>
          <text x="10" y="95" fill="#ffaa33" fontSize="10" fontWeight="bold">COMMAND DECK</text>
          <text x="10" y="165" fill="#ffaa33" fontSize="10" fontWeight="bold">MAIN DECK</text>
          <text x="10" y="235" fill="#ffaa33" fontSize="10" fontWeight="bold">LOWER DECK</text>
          <text x="10" y="305" fill="#ffaa33" fontSize="10" fontWeight="bold">STORAGE DECK</text>
          <text x="10" y="375" fill="#ffaa33" fontSize="10" fontWeight="bold">CRITICAL SYSTEMS</text>
        </g>
      </svg>

      {/* Room Info Panel */}
      {hoveredRoom && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '20px',
          right: '20px',
          backgroundColor: '#001122',
          border: '2px solid #00ffff',
          borderRadius: '6px',
          padding: '8px',
          fontSize: '12px'
        }}>
          <div style={{ color: '#00ffff', fontWeight: 'bold' }}>
            {rooms[hoveredRoom]?.name || hoveredRoom}
          </div>
          <div style={{ color: '#cccccc', fontSize: '11px' }}>
            {isLocked(hoveredRoom) ? '🔒 LOCKED' : 
             isCurrent(hoveredRoom) ? '📍 CURRENT LOCATION' :
             isVisited(hoveredRoom) ? '✅ VISITED' : '❔ UNEXPLORED'}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: 'absolute',
        top: '50px',
        right: '20px',
        backgroundColor: '#000811',
        border: '1px solid #333333',
        borderRadius: '4px',
        padding: '8px',
        fontSize: '10px'
      }}>
        <div style={{ color: '#00ffff' }}>👤 Current Location</div>
        <div style={{ color: '#ffaa33' }}>✅ Visited</div>
        <div style={{ color: '#ff3333' }}>🔒 Locked</div>
        <div style={{ color: '#666666' }}>❔ Unexplored</div>
      </div>
    </div>
  );
}

export default FixedShipMap;
