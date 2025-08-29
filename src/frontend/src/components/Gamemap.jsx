import React from 'react';

function GameMap({ currentLocation, visitedRooms, gameState }) {
  const rooms = {
    command_center: { name: 'Command Center', emoji: '🖥️', x: 2, y: 2 },
    main_corridor: { name: 'Main Corridor', emoji: '⚡', x: 3, y: 2 },
    bridge: { name: 'Bridge', emoji: '🚀', x: 2, y: 1 },
    armory: { name: 'Armory', emoji: '⚔️', x: 3, y: 1 },
    laboratory: { name: 'Laboratory', emoji: '🧪', x: 4, y: 2 },
    engineering_bay: { name: 'Engineering', emoji: '⚙️', x: 1, y: 2 }
  };

  const connections = [
    { from: 'command_center', to: 'main_corridor', path: 'M 140 140 L 200 140' },
    { from: 'command_center', to: 'bridge', path: 'M 140 140 L 140 80' },
    { from: 'command_center', to: 'engineering_bay', path: 'M 140 140 L 80 140' },
    { from: 'main_corridor', to: 'armory', path: 'M 200 140 L 200 80' },
    { from: 'main_corridor', to: 'laboratory', path: 'M 200 140 L 260 140' }
  ];

  const isVisited = (roomId) => {
    return visitedRooms && (visitedRooms.includes(roomId) || gameState.visitedRooms > 0);
  };

  const isCurrent = (roomId) => currentLocation === roomId;

  const getAvailableExits = (roomId) => {
    const exits = {
      command_center: ['east: main_corridor', 'north: bridge', 'west: engineering'],
      main_corridor: ['west: command_center', 'north: armory', 'east: laboratory'],
      bridge: ['south: command_center'],
      armory: ['south: main_corridor'],
      laboratory: ['west: main_corridor'],
      engineering_bay: ['east: command_center']
    };
    return exits[roomId] || [];
  };

  return (
    <div className="game-map">
      <h3 style={{ color: '#00ffff', textAlign: 'center', marginBottom: '10px', fontSize: '14px' }}>
        🗺️ Ship Layout
      </h3>
      
      <svg width="320" height="200" style={{ border: '1px solid #00ffff', borderRadius: '8px', backgroundColor: '#001122' }}>
        {/* Connection lines */}
        {connections.map((conn, index) => (
          <path
            key={index}
            d={conn.path}
            stroke="#004466"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        ))}
        
        {/* Room nodes */}
        {Object.entries(rooms).map(([roomId, room]) => (
          <g key={roomId}>
            <circle
              cx={room.x * 60 + 20}
              cy={room.y * 60 + 20}
              r="25"
              fill={isCurrent(roomId) ? '#00ffff' : isVisited(roomId) ? '#004466' : '#002233'}
              stroke={isCurrent(roomId) ? '#ffffff' : '#00ffff'}
              strokeWidth={isCurrent(roomId) ? '3' : '1'}
            />
            <text
              x={room.x * 60 + 20}
              y={room.y * 60 + 15}
              textAnchor="middle"
              fill="white"
              fontSize="16"
            >
              {room.emoji}
            </text>
            <text
              x={room.x * 60 + 20}
              y={room.y * 60 + 35}
              textAnchor="middle"
              fill={isCurrent(roomId) ? '#ffffff' : '#00ffff'}
              fontSize="8"
              fontWeight={isCurrent(roomId) ? 'bold' : 'normal'}
            >
              {room.name}
            </text>
          </g>
        ))}
      </svg>
      
      {/* Current location info */}
      <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#001122', border: '1px solid #004466', borderRadius: '4px' }}>
        <div style={{ color: '#00ffff', fontSize: '12px', fontWeight: 'bold' }}>
          📍 Current: {rooms[currentLocation]?.name || currentLocation}
        </div>
        <div style={{ color: '#ffffff', fontSize: '10px', marginTop: '4px' }}>
          Available exits:
        </div>
        {getAvailableExits(currentLocation).map((exit, index) => (
          <div key={index} style={{ color: '#00ff88', fontSize: '9px', marginLeft: '8px' }}>
            • {exit}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameMap;
