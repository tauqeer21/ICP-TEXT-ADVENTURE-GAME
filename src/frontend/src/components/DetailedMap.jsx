import React from 'react';

function DetailedMap({ currentLocation, visitedRooms, gameState, playerInventory }) {
  const shipLayout = {
    // Grid positions (x, y) for a 7x5 ship layout
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

  const connections = [
    // Horizontal connections
    { from: [3, 0], to: [4, 0] }, { from: [4, 0], to: [5, 0] }, // Bridge level
    { from: [2, 1], to: [3, 1] }, { from: [3, 1], to: [4, 1] }, // Security level
    { from: [1, 3], to: [2, 3] }, { from: [2, 3], to: [3, 3] }, { from: [3, 3], to: [4, 3] }, { from: [4, 3], to: [5, 3] }, // Main level
    
    // Vertical connections
    { from: [3, 0], to: [3, 1] }, { from: [3, 1], to: [3, 2] }, { from: [3, 2], to: [3, 3] }, { from: [3, 3], to: [3, 4] } // Central spine
  ];

  const isVisited = (roomId) => visitedRooms.includes(roomId);
  const isCurrent = (roomId) => currentLocation === roomId;
  const isLocked = (roomId) => {
    const room = shipLayout[roomId];
    if (!room.locked) return false;
    
    // Define unlock conditions
    const unlockConditions = {
      navigation: playerInventory?.includes('bridge_key'),
      communications: playerInventory?.includes('nav_codes'),
      security: playerInventory?.includes('emergency_codes'),
      armory: playerInventory?.includes('security_badge'),
      engineering: playerInventory?.includes('power_cell'),
      power_core: playerInventory?.includes('fusion_key'),
      life_support: playerInventory?.includes('env_codes'),
      laboratory: playerInventory?.includes('research_pass'),
      ai_core: playerInventory?.includes('ai_activation_key') && playerInventory?.includes('core_matrix')
    };
    
    return !unlockConditions[roomId];
  };

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

  return (
    <div className="detailed-map">
      <h3 style={{ color: '#ff6666', textAlign: 'center', marginBottom: '10px', fontSize: '14px' }}>
        🚨 USS PHOENIX - EMERGENCY STATUS
      </h3>
      
      <svg width="360" height="280" style={{ 
        border: '2px solid #ff6666', 
        borderRadius: '8px', 
        backgroundColor: '#0a0a0a',
        filter: 'drop-shadow(0 0 10px #ff333366)'
      }}>
        {/* Grid background */}
        <defs>
          <pattern id="grid" width="60" height="56" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 56" fill="none" stroke="#333333" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="360" height="280" fill="url(#grid)"/>
        
        {/* Connection lines */}
        {connections.map((conn, index) => {
          const [x1, y1] = conn.from;
          const [x2, y2] = conn.to;
          return (
            <line
              key={index}
              x1={x1 * 60 + 30}
              y1={y1 * 56 + 28}
              x2={x2 * 60 + 30}
              y2={y2 * 56 + 28}
              stroke="#444444"
              strokeWidth="3"
              strokeDasharray="6,4"
            />
          );
        })}
        
        {/* Room nodes */}
        {Object.entries(shipLayout).map(([roomId, room]) => (
          <g key={roomId}>
            {/* Room background */}
            <rect
              x={room.x * 60 + 5}
              y={room.y * 56 + 5}
              width="50"
              height="46"
              rx="8"
              fill={isCurrent(roomId) ? '#003366' : isVisited(roomId) ? '#001122' : '#000811'}
              stroke={isCurrent(roomId) ? '#00ffff' : getStatusColor(room.status)}
              strokeWidth={isCurrent(roomId) ? '3' : '2'}
              opacity={isLocked(roomId) ? '0.5' : '0.9'}
            />
            
            {/* Lock indicator */}
            {isLocked(roomId) && (
              <text x={room.x * 60 + 45} y={room.y * 56 + 15} fontSize="10" fill="#ff6666">🔒</text>
            )}
            
            {/* Room emoji */}
            <text
              x={room.x * 60 + 30}
              y={room.y * 56 + 25}
              textAnchor="middle"
              fontSize="16"
              opacity={isLocked(roomId) ? '0.4' : '1'}
            >
              {room.emoji}
            </text>
            
            {/* Room name */}
            <text
              x={room.x * 60 + 30}
              y={room.y * 56 + 40}
              textAnchor="middle"
              fill={isCurrent(roomId) ? '#ffffff' : '#cccccc'}
              fontSize="8"
              fontWeight={isCurrent(roomId) ? 'bold' : 'normal'}
            >
              {room.name}
            </text>
            
            {/* Player avatar */}
            {isCurrent(roomId) && (
              <text
                x={room.x * 60 + 15}
                y={room.y * 56 + 20}
                fontSize="12"
                fill="#00ffff"
              >
                👤
              </text>
            )}
          </g>
        ))}
        
        {/* Ship outline */}
        <rect x="2" y="2" width="356" height="276" fill="none" stroke="#ff6666" strokeWidth="2" rx="12" strokeDasharray="10,5"/>
      </svg>
      
      {/* Mission status */}
      <div style={{ 
        marginTop: '10px', 
        padding: '8px', 
        backgroundColor: '#0a0a0a', 
        border: '1px solid #ff6666', 
        borderRadius: '4px' 
      }}>
        <div style={{ color: '#ff6666', fontSize: '11px', fontWeight: 'bold' }}>
          🚨 CRITICAL: AI SYSTEM OFFLINE
        </div>
        <div style={{ color: '#ffaa33', fontSize: '10px', marginTop: '2px' }}>
          Life support: {gameState.level > 5 ? '✅ RESTORED' : '⚠️ FAILING'}
        </div>
        <div style={{ color: '#ff6666', fontSize: '9px', marginTop: '2px' }}>
          Mission: Reach AI Core and restore ship systems
        </div>
      </div>
    </div>
  );
}

export default DetailedMap;
