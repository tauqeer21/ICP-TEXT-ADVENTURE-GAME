import React, { useState } from 'react';

function CompleteShipMap({ currentLocation, visitedRooms, gameState, lastAction, rooms, unlockedRooms, onCommand }) {
  const [hoveredRoom, setHoveredRoom] = useState(null);

  // FIXED: Ship layout that matches EXACT room positions and connections
  const shipLayout = {
    // Row 0 (Top row)
    communications: { x: 0, y: 0, name: 'Comms', emoji: '📡' },
    bridge: { x: 1, y: 0, name: 'Bridge', emoji: '🚀' },
    navigation: { x: 2, y: 0, name: 'Navigation', emoji: '🧭' },
    
    // Row 1 
    engineering: { x: 0, y: 1, name: 'Engineering', emoji: '⚙️' },
    command_center: { x: 1, y: 1, name: 'Command', emoji: '🖥️' },
    laboratory: { x: 2, y: 1, name: 'Laboratory', emoji: '🧪' },
    
    // Row 2
    power_core: { x: 0, y: 2, name: 'Power Core', emoji: '⚛️' },
    main_corridor: { x: 1, y: 2, name: 'Main Corridor', emoji: '⚡' },
    fabrication: { x: 2, y: 2, name: 'Fabrication', emoji: '🔧' },
    
    // Row 3
    armory: { x: 0, y: 3, name: 'Armory', emoji: '⚔️' },
    life_support: { x: 1, y: 3, name: 'Life Support', emoji: '🌬️' },
    cargo_bay: { x: 2, y: 3, name: 'Cargo Bay', emoji: '📦' },
    
    // Row 4 (Bottom row)
    detention: { x: 0, y: 4, name: 'Detention', emoji: '🚔' },
    medical_bay: { x: 1, y: 4, name: 'Medical', emoji: '🏥' },
    ai_core: { x: 2, y: 4, name: 'AI Core', emoji: '🤖' },
    
    // Additional room for complete layout
    security: { x: 3, y: 2, name: 'Security', emoji: '🔒' }
  };

  // FIXED: Connections that match your actual room exits
  const connections = [
    // Top row horizontal connections
    { from: 'communications', to: 'bridge' },
    { from: 'bridge', to: 'navigation' },
    
    // Vertical connections down the middle
    { from: 'bridge', to: 'command_center' },
    { from: 'command_center', to: 'main_corridor' },
    { from: 'main_corridor', to: 'life_support' },
    { from: 'life_support', to: 'medical_bay' },
    
    // Left column vertical connections
    { from: 'engineering', to: 'power_core' },
    
    // Right column vertical connections
    { from: 'navigation', to: 'laboratory' },
    { from: 'laboratory', to: 'fabrication' },
    { from: 'fabrication', to: 'cargo_bay' },
    
    // Horizontal connections between columns
    { from: 'main_corridor', to: 'engineering' },
    { from: 'main_corridor', to: 'security' },
    { from: 'life_support', to: 'armory' },
    { from: 'cargo_bay', to: 'ai_core' },
    { from: 'detention', to: 'medical_bay' },
    { from: 'detention', to: 'ai_core' },
  ];

  const isVisited = (roomId) => visitedRooms.includes(roomId);
  const isCurrent = (roomId) => currentLocation === roomId;
  const isLocked = (roomId) => {
    const room = rooms[roomId];
    if (!room?.locked) return false;
    return !unlockedRooms.includes(roomId);
  };

  const getRoomColor = (roomId) => {
    if (isCurrent(roomId)) return '#00ffff';
    if (isLocked(roomId)) return '#ff3333';
    if (isVisited(roomId)) return '#ffaa33';
    return '#666666';
  };

  // FIXED: Proper click handling that uses actual room exits
  const handleRoomClick = (roomId) => {
    if (roomId === currentLocation) {
      onCommand('look');
      return;
    }
    
    if (isLocked(roomId)) {
      return;
    }

    // Find the correct direction based on actual room exits
    const currentRoom = rooms[currentLocation];
    if (currentRoom && currentRoom.exits) {
      for (const [direction, targetRoomId] of Object.entries(currentRoom.exits)) {
        if (targetRoomId === roomId) {
          onCommand(`go ${direction}`);
          return;
        }
      }
    }
    
    // If no direct connection found
    onCommand(`look`);
  };

  return (
    <div style={{
      width: '600px',
      height: '420px',
      backgroundColor: '#0a0a0a',
      border: '3px solid #ff6666',
      borderRadius: '12px',
      padding: '16px',
      position: 'relative'
    }}>
      {/* Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '12px',
        color: '#ff6666',
        fontSize: '14px',
        fontWeight: 'bold',
        textShadow: '0 0 10px #ff6666'
      }}>
        🚨 USS PHOENIX - SHIP LAYOUT 🚨
      </div>

      {/* SVG Ship Layout */}
      <svg width="568" height="360" style={{ 
        border: '2px solid #ff6666', 
        borderRadius: '8px', 
        backgroundColor: '#001111'
      }}>
        <defs>
          <pattern id="shipGrid" width="142" height="72" patternUnits="userSpaceOnUse">
            <path d="M 142 0 L 0 0 0 72" fill="none" stroke="#333333" strokeWidth="1" opacity="0.2"/>
          </pattern>
        </defs>
        <rect width="568" height="360" fill="url(#shipGrid)"/>
        
        {/* Connection Lines */}
        {connections.map((conn, index) => {
          const fromRoom = shipLayout[conn.from];
          const toRoom = shipLayout[conn.to];
          if (!fromRoom || !toRoom) return null;
          
          return (
            <line
              key={index}
              x1={fromRoom.x * 142 + 71}
              y1={fromRoom.y * 72 + 36}
              x2={toRoom.x * 142 + 71}
              y2={toRoom.y * 72 + 36}
              stroke="#0088ff"
              strokeWidth="2"
              strokeDasharray="6,3"
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
                x={room.x * 142 + 15}
                y={room.y * 72 + 6}
                width="112"
                height="60"
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
                x={room.x * 142 + 71}
                y={room.y * 72 + 30}
                textAnchor="middle"
                fontSize="20"
                style={{ cursor: 'pointer' }}
                onClick={() => handleRoomClick(roomId)}
              >
                {room.emoji}
              </text>
              
              {/* Room Name */}
              <text
                x={room.x * 142 + 71}
                y={room.y * 72 + 50}
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
                  x={room.x * 142 + 110}
                  y={room.y * 72 + 20}
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
                    cx={room.x * 142 + 35}
                    cy={room.y * 72 + 25}
                    r="8"
                    fill="#00ffff"
                    opacity="0.8"
                  />
                  <text
                    x={room.x * 142 + 35}
                    y={room.y * 72 + 30}
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
                  x={room.x * 142 + 15}
                  y={room.y * 72 + 6}
                  width="112"
                  height="60"
                  rx="8"
                  fill="none"
                  stroke="#00ffff"
                  strokeWidth="3"
                  opacity="0.7"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Room Info Panel */}
      {hoveredRoom && (
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '16px',
          right: '16px',
          height: '40px',
          backgroundColor: '#001122',
          border: '2px solid #00ffff',
          borderRadius: '6px',
          padding: '6px',
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ color: '#00ffff', fontWeight: 'bold', fontSize: '12px' }}>
              {rooms[hoveredRoom]?.name || hoveredRoom}
            </div>
            <div style={{ color: '#cccccc', fontSize: '10px' }}>
              {isLocked(hoveredRoom) ? '🔒 LOCKED' : 
               isCurrent(hoveredRoom) ? '📍 CURRENT LOCATION' :
               isVisited(hoveredRoom) ? '✅ VISITED' : '❔ UNEXPLORED'}
            </div>
          </div>
          
          <div style={{ fontSize: '9px', textAlign: 'right' }}>
            <div style={{ color: '#00ffff' }}>👤 Current</div>
            <div style={{ color: '#ffaa33' }}>✅ Visited</div>
            <div style={{ color: '#ff3333' }}>🔒 Locked</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompleteShipMap;
