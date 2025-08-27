import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Import ALL your existing components
import Terminal from './components/Terminal.jsx';
import StatusPanel from './components/StatusPanel.jsx';
import GuideBook from './components/GuideBook.jsx';
import MatrixRain from './components/MatrixRain.jsx';
import FixedShipMap from './components/FixedShipMap.jsx';
import AudioManager from './components/AudioManager.jsx';
import SmartCommandInput from './components/SmartCommandInput.jsx';
import InteractiveShipMap from './components/InteractiveShipMap.jsx';
import AchievementSystem from './components/AchievementSystem.jsx';
import MobileControls from './components/MobileControls.jsx';
import AdvancedVisualEffects from './components/AdvancedVisualEffects.jsx';
import RealTimePressure from './components/RealTimePressure.jsx';
import CharacterCustomization from './components/CharacterCustomization.jsx';
import VoiceInput from './components/VoiceInput.jsx';
import MiniGameSystem from './components/MiniGameSystem.jsx';

// STABLE TERMINAL COMPONENT - NO COMMAND INPUT (handled by SmartCommandInput)
function StableTerminal({ onCommand, isLoading, lastResponse }) {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lastResponse, isLoading]);

  const startupMessage = `╔══════════════════════════════════════════════════════════════╗
║           USS PHOENIX EMERGENCY COMMAND INTERFACE            ║
║                    🚨 RED ALERT STATUS 🚨                    ║
╚══════════════════════════════════════════════════════════════╝

👨‍🚀 COMMANDER - You are our only hope.
🎯 PRIMARY MISSION: Navigate to AI Core and restore ship systems
⚡ All 16 ship compartments accessible via interactive map

💡 QUICK START: 
   • Type commands or click rooms on the map
   • 'help' for commands, 'guide' for full manual
   • 'look' to examine, 'go [direction]' to move`;

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#000811',
      border: '2px solid #00ffff',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* TERMINAL CONTENT - FULL HEIGHT */}
      <div 
        ref={terminalRef}
        style={{ 
          flex: 1,
          overflowY: 'auto', 
          padding: '12px',
          fontFamily: 'monospace',
          fontSize: '11px',
          lineHeight: '1.3',
          boxSizing: 'border-box'
        }}
      >
        {/* Startup Message */}
        <div style={{ 
          color: '#00ffff', 
          marginBottom: '12px', 
          whiteSpace: 'pre-line',
          borderBottom: '1px solid #003366',
          paddingBottom: '8px',
          fontSize: '10px'
        }}>
          {startupMessage}
        </div>

        {/* Game Response */}
        {lastResponse && (
          <div style={{ marginBottom: '12px' }}>
            <div 
              style={{ 
                color: '#ffaa33', 
                whiteSpace: 'pre-line',
                marginBottom: '8px',
                padding: '8px',
                backgroundColor: '#001122',
                borderRadius: '4px',
                border: '1px solid #ffaa33',
                fontSize: '11px'
              }}
            >
              {lastResponse.message}
            </div>
            
            {/* FIXED HEIGHT STATUS BAR */}
            <div style={{
              height: '40px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '4px',
              padding: '4px',
              backgroundColor: '#000033',
              borderRadius: '4px',
              fontSize: '9px',
              alignItems: 'center'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#00ff88', fontWeight: 'bold' }}>LVL</div>
                <div style={{ color: '#ffffff' }}>{lastResponse.gameState.level}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#ffaa33', fontWeight: 'bold' }}>XP</div>
                <div style={{ color: '#ffffff' }}>{lastResponse.gameState.xp}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#ffff33', fontWeight: 'bold' }}>CREDITS</div>
                <div style={{ color: '#ffffff' }}>{lastResponse.gameState.credits}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  color: lastResponse.gameState.oxygenLevel > 60 ? '#00ff88' : 
                        lastResponse.gameState.oxygenLevel > 30 ? '#ffaa33' : '#ff3333',
                  fontWeight: 'bold'
                }}>
                  O₂
                </div>
                <div style={{ color: '#ffffff' }}>{lastResponse.gameState.oxygenLevel}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator - FIXED HEIGHT */}
        {isLoading && (
          <div style={{
            height: '30px',
            padding: '8px',
            backgroundColor: '#000033',
            borderRadius: '4px',
            color: '#0066ff',
            fontSize: '10px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            ⚡ Processing command...
          </div>
        )}
      </div>

      {/* No command input here - handled by SmartCommandInput below */}
    </div>
  );
}

// COMPLETE SHIP MAP COMPONENT - FIXED SIZE
function CompleteShipMap({ currentLocation, visitedRooms, gameState, lastAction, rooms, unlockedRooms, onCommand }) {
  const [hoveredRoom, setHoveredRoom] = useState(null);

  const shipLayout = {
    communications: { x: 1, y: 0, name: 'Comms', emoji: '📡' },
    bridge: { x: 2, y: 0, name: 'Bridge', emoji: '🚀' },
    navigation: { x: 3, y: 0, name: 'Navigation', emoji: '🧭' },
    command_center: { x: 2, y: 1, name: 'Command', emoji: '🖥️' },
    engineering: { x: 0, y: 2, name: 'Engineering', emoji: '⚙️' },
    main_corridor: { x: 1, y: 2, name: 'Corridor', emoji: '⚡' },
    security: { x: 2, y: 2, name: 'Security', emoji: '🔒' },
    life_support: { x: 3, y: 2, name: 'Life Support', emoji: '🌬️' },
    power_core: { x: 0, y: 3, name: 'Power Core', emoji: '⚛️' },
    medical_bay: { x: 1, y: 3, name: 'Medical', emoji: '🏥' },
    armory: { x: 2, y: 3, name: 'Armory', emoji: '⚔️' },
    laboratory: { x: 3, y: 3, name: 'Laboratory', emoji: '🧪' },
    cargo_bay: { x: 1, y: 4, name: 'Cargo Bay', emoji: '📦' },
    fabrication: { x: 2, y: 4, name: 'Fabrication', emoji: '🔧' },
    detention: { x: 1, y: 5, name: 'Detention', emoji: '🚔' },
    ai_core: { x: 2, y: 5, name: 'AI Core', emoji: '🤖' }
  };

  const connections = [
    { from: 'communications', to: 'bridge' },
    { from: 'bridge', to: 'navigation' },
    { from: 'bridge', to: 'command_center' },
    { from: 'command_center', to: 'main_corridor' },
    { from: 'engineering', to: 'main_corridor' },
    { from: 'main_corridor', to: 'security' },
    { from: 'security', to: 'life_support' },
    { from: 'engineering', to: 'power_core' },
    { from: 'main_corridor', to: 'medical_bay' },
    { from: 'security', to: 'armory' },
    { from: 'life_support', to: 'laboratory' },
    { from: 'medical_bay', to: 'cargo_bay' },
    { from: 'armory', to: 'fabrication' },
    { from: 'laboratory', to: 'fabrication' },
    { from: 'cargo_bay', to: 'detention' },
    { from: 'fabrication', to: 'ai_core' },
    { from: 'detention', to: 'ai_core' }
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

  // FIXED: Proper direction mapping based on room exits
  const handleRoomClick = (roomId) => {
    if (roomId === currentLocation) {
      onCommand('look');
      return;
    }
    
    if (isLocked(roomId)) {
      return;
    }

    // Get the current room's exits and find direct connection
    const currentRoom = rooms[currentLocation];
    if (currentRoom && currentRoom.exits) {
      // Check if there's a direct connection
      for (const [direction, targetRoomId] of Object.entries(currentRoom.exits)) {
        if (targetRoomId === roomId) {
          onCommand(`go ${direction}`);
          return;
        }
      }
    }
    
    // If no direct connection found, just show error
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
        🚨 USS PHOENIX - ALL 16 COMPARTMENTS 🚨
      </div>

      {/* SVG Ship Layout - FIXED SIZE */}
      <svg width="568" height="330" style={{ 
        border: '2px solid #ff6666', 
        borderRadius: '8px', 
        backgroundColor: '#001111'
      }}>
        <defs>
          <pattern id="shipGrid" width="142" height="55" patternUnits="userSpaceOnUse">
            <path d="M 142 0 L 0 0 0 55" fill="none" stroke="#333333" strokeWidth="1" opacity="0.2"/>
          </pattern>
        </defs>
        <rect width="568" height="330" fill="url(#shipGrid)"/>
        
        {/* Connection Lines */}
        {connections.map((conn, index) => {
          const fromRoom = shipLayout[conn.from];
          const toRoom = shipLayout[conn.to];
          if (!fromRoom || !toRoom) return null;
          
          return (
            <line
              key={index}
              x1={fromRoom.x * 142 + 71}
              y1={fromRoom.y * 55 + 27.5}
              x2={toRoom.x * 142 + 71}
              y2={toRoom.y * 55 + 27.5}
              stroke="#444444"
              strokeWidth="2"
              strokeDasharray="6,3"
            />
          );
        })}
        
        {/* Room Nodes - ALL 16 ROOMS FIXED SIZE */}
        {Object.entries(shipLayout).map(([roomId, room]) => {
          const roomExists = rooms[roomId];
          if (!roomExists) return null;
          
          return (
            <g key={roomId}>
              {/* Room Background - FIXED SIZE */}
              <rect
                x={room.x * 142 + 15}
                y={room.y * 55 + 5}
                width="112"
                height="45"
                rx="6"
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
                y={room.y * 55 + 25}
                textAnchor="middle"
                fontSize="16"
                style={{ cursor: 'pointer' }}
                onClick={() => handleRoomClick(roomId)}
              >
                {room.emoji}
              </text>
              
              {/* Room Name */}
              <text
                x={room.x * 142 + 71}
                y={room.y * 55 + 40}
                textAnchor="middle"
                fill={getRoomColor(roomId)}
                fontSize="9"
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
                  y={room.y * 55 + 15}
                  fontSize="10"
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
                    cy={room.y * 55 + 20}
                    r="6"
                    fill="#00ffff"
                    opacity="0.6"
                  />
                  <text
                    x={room.x * 142 + 35}
                    y={room.y * 55 + 24}
                    textAnchor="middle"
                    fontSize="10"
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
                  y={room.y * 55 + 5}
                  width="112"
                  height="45"
                  rx="6"
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
          x="8" 
          y="8" 
          width="552" 
          height="314" 
          fill="none" 
          stroke="#ff6666" 
          strokeWidth="2" 
          rx="16" 
          strokeDasharray="12,8"
        />
      </svg>

      {/* Fixed Room Info Panel */}
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

function App() {
  // FIXED Game State - Added missing properties
  const [gameState, setGameState] = useState({
    location: 'command_center',
    inventory: ['flashlight', 'emergency_scanner'],
    level: 1,
    xp: 0,
    credits: 100,
    commandCount: 0,
    visitedRooms: 1,
    achievements: [],
    gameCompleted: false,
    oxygenLevel: 100,
    powerLevel: 25,
    playerName: 'Alex Chen',
    specialization: 'engineer',
    traits: [],
    // ADDED MISSING PROPERTIES FOR COMPONENTS
    maxHealth: 100,
    health: 100,
    oxygen: 100,
    energy: 100,
    pressure: 100,
    shieldsLevel: 100,
    weaponsLevel: 100,
    engineLevel: 100
  });

  const [lastResponse, setLastResponse] = useState({
    message: "🚨 === EMERGENCY PROTOCOL ACTIVATED ===\n\nYou are Commander Alex Chen aboard the USS Phoenix research vessel.\n\nALL SHIP SYSTEMS HAVE FAILED. The central AI has suffered a catastrophic malfunction, leaving you stranded with failing life support.\n\nYou're in the Command Center 🖥️\nEmergency lighting casts an eerie red glow. Multiple system failure alerts flash on darkened screens.\n\nItems here: Emergency Codes 📋\nExits: north south\n\n🚨 CRITICAL: Life support failing - find and reboot the AI Core!\n💡 Type 'guide' to open the operations manual",
    gameState: {
      location: 'command_center',
      inventory: ['flashlight', 'emergency_scanner'],
      level: 1,
      xp: 0,
      credits: 100,
      commandCount: 0,
      visitedRooms: 1,
      achievements: [],
      gameCompleted: false,
      oxygenLevel: 100,
      powerLevel: 25
    }
  });

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [visitedRoomsList, setVisitedRoomsList] = useState(['command_center']);
  const [showGuideBook, setShowGuideBook] = useState(false);
  const [showCharacterCustomization, setShowCharacterCustomization] = useState(false);
  const [unlockedRooms, setUnlockedRooms] = useState(['command_center', 'main_corridor', 'bridge']);
  const [lastAction, setLastAction] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Advanced Features
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(false);
  const [visualEffectsEnabled, setVisualEffectsEnabled] = useState(true);
  const [realTimePressureEnabled, setRealTimePressureEnabled] = useState(false);
  const [currentMiniGame, setCurrentMiniGame] = useState(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Complete room definitions - ALL 16 ROOMS
  const rooms = {
    command_center: {
      name: 'Command Center 🖥️',
      description: 'Emergency lighting casts an eerie red glow. Multiple system failure alerts flash on darkened screens.',
      exits: { north: 'bridge', south: 'main_corridor' },
      items: ['emergency_codes'],
      locked: false
    },
    bridge: {
      name: 'Bridge 🚀',
      description: 'The captain\'s bridge is in chaos. Navigation systems are offline, viewscreen shows static.',
      exits: { south: 'command_center', east: 'navigation', west: 'communications' },
      items: ['bridge_key', 'captain_logs'],
      locked: false
    },
    navigation: {
      name: 'Navigation 🧭',
      description: 'Star charts flicker weakly. Quantum compass spinning wildly without AI guidance.',
      exits: { west: 'bridge' },
      items: ['nav_codes', 'stellar_maps'],
      locked: true,
      unlockRequires: ['bridge_key']
    },
    communications: {
      name: 'Communications 📡',
      description: 'All external communications down. Distress beacon offline.',
      exits: { east: 'bridge' },
      items: ['comm_relay', 'distress_codes'],
      locked: true,
      unlockRequires: ['nav_codes']
    },
    main_corridor: {
      name: 'Main Corridor ⚡',
      description: 'The main artery of the ship. Flickering emergency lights barely illuminate the way.',
      exits: { north: 'command_center', west: 'engineering', east: 'security', south: 'life_support' },
      items: ['repair_kit'],
      locked: false
    },
    engineering: {
      name: 'Engineering Bay ⚙️',
      description: 'Massive machinery stands silent. Fusion reactor controls locked behind safety protocols.',
      exits: { east: 'main_corridor', south: 'power_core' },
      items: ['power_cell', 'engineering_tools'],
      locked: true,
      unlockRequires: ['emergency_codes']
    },
    power_core: {
      name: 'Power Core ⚛️',
      description: 'The ship\'s central power reactor. Radiation warnings flash, core in shutdown mode.',
      exits: { north: 'engineering' },
      items: ['fusion_key', 'radiation_suit'],
      locked: true,
      unlockRequires: ['power_cell']
    },
    security: {
      name: 'Security Office 🔒',
      description: 'High-security monitoring station. Multiple screens show various ship areas.',
      exits: { west: 'main_corridor', south: 'armory' },
      items: ['security_codes', 'surveillance_data'],
      locked: true,
      unlockRequires: ['emergency_codes']
    },
    armory: {
      name: 'Armory ⚔️',
      description: 'Weapon storage with plasma rifle mounts. Most weapons locked behind barriers.',
      exits: { north: 'security' },
      items: ['plasma_rifle', 'armor_vest', 'ammo_clip'],
      locked: true,
      unlockRequires: ['security_codes']
    },
    life_support: {
      name: 'Life Support 🌬️',
      description: 'Atmospheric processors struggle to maintain breathable air. Oxygen dropping steadily.',
      exits: { north: 'main_corridor', west: 'medical_bay', east: 'laboratory' },
      items: ['env_codes', 'air_filter'],
      locked: true,
      unlockRequires: ['engineering_tools']
    },
    medical_bay: {
      name: 'Medical Bay 🏥',
      description: 'Advanced medical facility with bio-regeneration pods and surgical arrays.',
      exits: { east: 'life_support' },
      items: ['medkit', 'bio_scanner', 'stim_pack'],
      locked: true,
      unlockRequires: ['env_codes']
    },
    laboratory: {
      name: 'Laboratory 🧪',
      description: 'Research equipment hums with backup power. Where you can synthesize the AI repair matrix.',
      exits: { west: 'life_support', south: 'fabrication' },
      items: ['research_pass', 'ai_matrix_components'],
      locked: true,
      unlockRequires: ['fusion_key']
    },
    fabrication: {
      name: 'Fabrication Lab 🔧',
      description: 'Automated manufacturing facility with 3D molecular printers and raw material processors.',
      exits: { north: 'laboratory', west: 'cargo_bay' },
      items: ['fabricator', 'raw_materials', 'blueprint_scanner'],
      locked: true,
      unlockRequires: ['research_pass']
    },
    cargo_bay: {
      name: 'Cargo Bay 📦',
      description: 'Massive storage area with floating containers. Emergency supplies scattered after evacuation.',
      exits: { east: 'fabrication', south: 'detention' },
      items: ['supply_crate', 'gravity_boots', 'emergency_beacon'],
      locked: false
    },
    detention: {
      name: 'Detention Block 🚔',
      description: 'Ship\'s security detention area. Emergency lockdown protocols have sealed most cells.',
      exits: { north: 'cargo_bay', east: 'ai_core' },
      items: ['security_key', 'prisoner_log'],
      locked: true,
      unlockRequires: ['security_codes']
    },
    ai_core: {
      name: 'AI Core 🤖',
      description: 'Central AI housing. Massive quantum processors stand silent. Restore the ship\'s intelligence here.',
      exits: { west: 'detention' },
      items: ['ai_activation_key'],
      locked: true,
      unlockRequires: ['env_codes', 'research_pass'],
      finalObjective: true
    }
  };

  // Items data
  const items = {
    flashlight: { name: 'Emergency Flashlight 🔦', description: 'Provides light in dark areas', value: 25 },
    emergency_scanner: { name: 'Emergency Scanner 📱', description: 'Detects system failures and hazards', value: 50 },
    emergency_codes: { name: 'Emergency Codes 📋', description: 'Access codes for critical systems', value: 100 },
    bridge_key: { name: 'Bridge Access Key 🗝️', description: 'Unlocks navigation and other bridge systems', value: 200 },
    captain_logs: { name: 'Captain\'s Logs 📖', description: 'Personal logs from the captain', value: 150 },
    nav_codes: { name: 'Navigation Codes 💿', description: 'Quantum navigation access codes', value: 300 },
    stellar_maps: { name: 'Stellar Maps 🗺️', description: 'Current sector navigation data', value: 250 },
    comm_relay: { name: 'Comm Relay 📡', description: 'Backup communication device', value: 400 },
    repair_kit: { name: 'Engineering Repair Kit 🔧', description: 'Tools for fixing ship systems', value: 350 },
    power_cell: { name: 'Power Cell ⚡', description: 'Portable energy storage unit', value: 500 },
    engineering_tools: { name: 'Engineering Tools 🛠️', description: 'Specialized repair equipment', value: 450 },
    fusion_key: { name: 'Fusion Access Key ⚛️', description: 'Activates fusion reactor controls', value: 800 },
    radiation_suit: { name: 'Radiation Suit 🧑‍🚀', description: 'Protection from reactor radiation', value: 600 },
    security_codes: { name: 'Security Codes 🔐', description: 'Security access codes for ship systems', value: 500 },
    surveillance_data: { name: 'Surveillance Data 📹', description: 'Security camera footage and monitoring data', value: 200 },
    plasma_rifle: { name: 'Plasma Rifle ⚡', description: 'High-energy plasma weapon', value: 500 },
    armor_vest: { name: 'Combat Armor 🛡️', description: 'Military-grade body armor', value: 300 },
    ammo_clip: { name: 'Ammo Clip 🔋', description: 'High-capacity ammunition', value: 100 },
    env_codes: { name: 'Environmental Codes 🌬️', description: 'Life support system access', value: 700 },
    air_filter: { name: 'Air Filter 🫁', description: 'Emergency atmospheric processor', value: 300 },
    medkit: { name: 'Advanced Medkit 🏥', description: 'Sophisticated medical kit', value: 200 },
    bio_scanner: { name: 'Bio-Scanner 🩺', description: 'Advanced medical scanning device', value: 350 },
    stim_pack: { name: 'Stim Pack 💉', description: 'Emergency medical stimulant', value: 100 },
    research_pass: { name: 'Research Clearance 🧪', description: 'Access to laboratory systems', value: 750 },
    ai_matrix_components: { name: 'AI Matrix Components 💾', description: 'Essential for AI reconstruction', value: 1000 },
    fabricator: { name: 'Molecular Fabricator 🏭', description: 'Advanced 3D molecular printing device', value: 800 },
    raw_materials: { name: 'Raw Materials 🔩', description: 'Assorted crafting materials', value: 75 },
    blueprint_scanner: { name: 'Blueprint Scanner 📐', description: 'Scans and stores item blueprints', value: 400 },
    supply_crate: { name: 'Supply Crate 📦', description: 'Military supply crate with various items', value: 200 },
    gravity_boots: { name: 'Anti-Grav Boots 👢', description: 'Magnetic boots for wall walking', value: 250 },
    emergency_beacon: { name: 'Emergency Beacon 🚨', description: 'Distress beacon for emergency communications', value: 150 },
    security_key: { name: 'Security Key 🗝️', description: 'Master security override key', value: 300 },
    prisoner_log: { name: 'Prisoner Log 📋', description: 'Log files from detention facilities', value: 100 },
    ai_activation_key: { name: 'AI Activation Key 🤖', description: 'Final component for AI reboot', value: 2000 }
  };

  const getCurrentRoom = () => rooms[gameState.location] || rooms['command_center'];

  const sendCommand = async (command) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const words = command.toLowerCase().trim().split(' ');
    const cmd = words[0];
    let response = '';
    let newGameState = { ...gameState, commandCount: gameState.commandCount + 1 };

    if (newGameState.commandCount % 5 === 0) {
      newGameState.oxygenLevel = Math.max(0, newGameState.oxygenLevel - 2);
    }

    switch(cmd) {
      case 'guide':
        setShowGuideBook(true);
        response = "📚 Opening Emergency Operations Manual...";
        break;

      case 'look':
      case 'l':
        const room = getCurrentRoom();
        response = `📍 **${room.name}**\n\n${room.description}\n\n`;
        
        const availableItems = room.items?.filter(itemId => !gameState.inventory.includes(itemId)) || [];
        if (availableItems.length > 0) {
          response += '**Items here:** ';
          availableItems.forEach(itemId => {
            if (items[itemId]) {
              response += items[itemId].name + ' ';
            }
          });
          response += '\n';
        }
        
        response += '\n**Exits:** ';
        Object.keys(room.exits).forEach(direction => {
          const targetRoom = room.exits[direction];
          const isLocked = rooms[targetRoom]?.locked && !unlockedRooms.includes(targetRoom);
          response += `${direction}${isLocked ? ' 🔒' : ''} `;
        });
        
        newGameState.xp += 2;
        break;

      case 'go':
      case 'move':
        if (words.length < 2) {
          response = '🚶 Go where? (Example: go north, go south)';
          break;
        }
        
        const direction = words[1];
        const currentRoomForMove = getCurrentRoom();
        const newLocation = currentRoomForMove.exits[direction];
        
        if (!newLocation) {
          response = `🚫 You can't go ${direction} from here.`;
          break;
        }
        
        const targetRoom = rooms[newLocation];
        
        if (targetRoom.locked && !unlockedRooms.includes(newLocation)) {
          const requiredItems = targetRoom.unlockRequires || [];
          const hasRequiredItems = requiredItems.every(item => gameState.inventory.includes(item));
          
          if (hasRequiredItems) {
            setUnlockedRooms(prev => [...prev, newLocation]);
            response = `🔓 Using ${requiredItems.join(' and ')}, you unlock the door and enter...\n\n`;
          } else {
            response = `🔒 The door is locked. Required: ${requiredItems.join(' and ').replace(/_/g, ' ')}.`;
            break;
          }
        }
        
        newGameState.location = newLocation;
        newGameState.xp += 5;
        
        if (!visitedRoomsList.includes(newLocation)) {
          setVisitedRoomsList(prev => [...prev, newLocation]);
        }
        
        newGameState.visitedRooms = visitedRoomsList.length + 1;
        
        response += `🚶 You move ${direction} to **${targetRoom.name}**\n\n${targetRoom.description}`;
        setLastAction({ type: 'move', direction, success: true });
        break;

      case 'take':
      case 'get':
        if (words.length < 2) {
          response = '📦 Take what? (Example: take codes, take key)';
          break;
        }
        
        const itemName = words.slice(1).join(' ');
        const currentRoomForTake = getCurrentRoom();
        const itemToTake = currentRoomForTake.items?.find(itemId => 
          itemId.includes(itemName.replace(/\s+/g, '_')) || 
          (items[itemId] && items[itemId].name.toLowerCase().includes(itemName))
        );
        
        if (itemToTake && !gameState.inventory.includes(itemToTake)) {
          newGameState.inventory = [...gameState.inventory, itemToTake];
          newGameState.xp += 10;
          newGameState.credits += Math.floor(items[itemToTake].value / 10);
          response = `✅ You take the ${items[itemToTake].name}. +10 XP, +${Math.floor(items[itemToTake].value / 10)} credits!\n\n${items[itemToTake].description}`;
          
          setLastAction({ type: 'take', item: itemName, success: true });
        } else if (gameState.inventory.includes(itemToTake)) {
          response = `❌ You already have the ${items[itemToTake]?.name || itemName}.`;
        } else {
          response = `❌ There's no '${itemName}' here to take.`;
        }
        break;

      case 'use':
        if (words.length < 2) {
          response = '🔧 Use what? (Example: use scanner, use activation key)';
          break;
        }
        
        const useItemName = words.slice(1).join(' ');
        const useItem = gameState.inventory.find(itemId => 
          itemId.includes(useItemName.replace(/\s+/g, '_')) || 
          (items[itemId] && items[itemId].name.toLowerCase().includes(useItemName))
        );
        
        if (!useItem) {
          response = `❌ You don't have '${useItemName}' in your inventory.`;
          break;
        }
        
        if (useItem === 'ai_activation_key' && gameState.location === 'ai_core') {
          if (gameState.inventory.includes('ai_matrix_components')) {
            newGameState.gameCompleted = true;
            newGameState.xp += 500;
            response = "🎉 **MISSION COMPLETE!**\n\nYou insert the AI Activation Key and upload the matrix components. The AI Core hums to life!\n\n🤖 'Systems coming online... Thank you, Commander. Ship operations restored.'\n\n✅ Life support: RESTORED\n✅ Power systems: ONLINE\n✅ Navigation: FUNCTIONAL\n✅ Communications: ACTIVE\n\nYou've saved the USS Phoenix and her crew!";
          } else {
            response = "⚠️ The activation key needs the AI Matrix Components to function. Find them in the Laboratory first!";
          }
        } else if (useItem === 'emergency_scanner') {
          const roomInfo = getCurrentRoom();
          response = `🔍 **SCANNER ANALYSIS:**\n\nLocation: ${roomInfo.name}\nSystem Status: Operational\n`;
          response += `Oxygen Level: ${newGameState.oxygenLevel}%\nPower Level: ${newGameState.powerLevel}%`;
          newGameState.xp += 3;
        } else {
          newGameState.xp += 5;
          response = `✅ You use the ${items[useItem].name}. The device activates with a soft hum. +5 XP`;
        }
        
        setLastAction({ type: 'use', item: useItemName, success: response.includes('✅') });
        break;

      case 'inventory':
      case 'i':
      case 'inv':
        response = '🎒 **Commander\'s Equipment:**\n\n';
        if (gameState.inventory.length === 0) {
          response += 'Your equipment bay is empty.';
        } else {
          gameState.inventory.forEach(itemId => {
            if (items[itemId]) {
              response += `• ${items[itemId].name}\n  └ ${items[itemId].description}\n`;
            }
          });
        }
        break;

      case 'status':
      case 'stats':
        response = `🚨 **EMERGENCY STATUS REPORT:**\n\n**Commander:** ${gameState.playerName}\n**Location:** ${getCurrentRoom().name}\n**Mission Level:** ${gameState.level}\n**Experience:** ${gameState.xp} XP\n**Credits:** ${gameState.credits} 💰\n**Commands Issued:** ${gameState.commandCount}\n\n**SHIP STATUS:**\n**Oxygen Level:** ${gameState.oxygenLevel}% ${gameState.oxygenLevel < 30 ? '🚨' : gameState.oxygenLevel < 60 ? '⚠️' : '✅'}\n**Power Level:** ${gameState.powerLevel}% ${gameState.powerLevel < 30 ? '🚨' : '⚠️'}\n**Compartments Accessed:** ${gameState.visitedRooms}/16\n**Equipment Items:** ${gameState.inventory.length}\n**Mission Status:** ${gameState.gameCompleted ? 'COMPLETED ✅' : 'IN PROGRESS 🚨'}`;
        break;

      case 'help':
      case 'commands':
        response = `🎮 **EMERGENCY COMMAND INTERFACE:**\n\n**NAVIGATION:**\n• go [direction] - Move through ship (north, south, east, west)\n• look, l - Examine current compartment\n\n**EQUIPMENT:**\n• take [item] - Collect equipment and components\n• use [item] - Activate devices and tools\n• inventory, i - Check carried equipment\n\n**INFORMATION:**\n• status - View mission and ship status\n• guide - Open operations manual\n• help - This command list\n\n**MISSION OBJECTIVE:**\nReach the AI Core and restore ship systems!\n\n**CRITICAL:** Type 'guide' for detailed survival instructions!`;
        break;

      default:
        response = `🤔 Unknown command: '${cmd}'. Type 'help' for available commands, or 'guide' for the full manual.`;
    }

    if (newGameState.xp >= newGameState.level * 150) {
      newGameState.level += 1;
      newGameState.powerLevel = Math.min(100, newGameState.powerLevel + 10);
      response += `\n\n⚡ **SYSTEM UPGRADE COMPLETE!** Commander Level ${newGameState.level}! Ship power increased!`;
    }

    if (newGameState.oxygenLevel <= 20 && newGameState.oxygenLevel > 0) {
      response += '\n\n🚨 **CRITICAL WARNING:** Oxygen levels dangerously low! Find life support systems immediately!';
    }

    newGameState.xp += 1;

    setGameState(newGameState);
    setLastResponse({ message: response, gameState: newGameState });
    setIsLoading(false);
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden', 
        backgroundColor: '#000000',
        position: 'fixed',
        top: 0,
        left: 0
      }}>
        <MatrixRain />
        
        <GuideBook 
          isOpen={showGuideBook}
          onClose={() => setShowGuideBook(false)}
        />
        
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'absolute',
          top: 0,
          left: 0
        }}>
          {/* Fixed Header */}
          <div style={{
            height: '60px',
            flexShrink: 0,
            padding: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid #ff6666',
            borderRadius: '8px',
            margin: '8px',
            zIndex: 100
          }}>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ 
                fontSize: '14px', 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #ff6666, #ffaa33)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                USS PHOENIX
              </h1>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '10px', marginTop: '2px' }}>
                <span style={{ color: gameState.oxygenLevel > 60 ? '#00ff88' : gameState.oxygenLevel > 30 ? '#ffaa33' : '#ff3333' }}>
                  O₂: {gameState.oxygenLevel}%
                </span>
                <span style={{ color: '#aa88ff' }}>PWR: {gameState.powerLevel}%</span>
                <span style={{ color: '#0088ff' }}>LVL: {gameState.level}</span>
                <button
                  onClick={() => setShowGuideBook(true)}
                  style={{
                    padding: '2px 4px',
                    backgroundColor: '#0066cc',
                    border: 'none',
                    borderRadius: '2px',
                    color: 'white',
                    fontSize: '8px',
                    cursor: 'pointer'
                  }}
                >
                  📚
                </button>
              </div>
            </div>
          </div>
          
          {/* Fixed Terminal Area */}
          <div style={{ 
            flex: 1,
            margin: '0 8px',
            marginBottom: '80px',
            border: '1px solid #ff6666', 
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <StableTerminal 
              onCommand={sendCommand}
              isLoading={isLoading}
              lastResponse={lastResponse}
            />
          </div>
        </div>
        
        {/* Fixed Mobile Controls */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80px',
          zIndex: 1000
        }}>
          <MobileControls 
            onCommand={sendCommand}
            gameState={gameState}
            currentRoom={getCurrentRoom()}
          />
        </div>
      </div>
    );
  }

  // DESKTOP LAYOUT - ONLY ONE COMMAND INPUT (SmartCommandInput)
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden', 
      backgroundColor: '#000000',
      fontFamily: 'monospace',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <MatrixRain />
      
      <GuideBook 
        isOpen={showGuideBook}
        onClose={() => setShowGuideBook(false)}
      />
      
      {/* Background Systems - FIXED JSX ATTRIBUTES */}
      <AdvancedVisualEffects
        gameState={gameState}
        currentLocation={gameState.location}
        isActive={visualEffectsEnabled}
      />
      
      {/* Audio Manager with gameState */}
      <AudioManager gameState={gameState} />
      
      {/* Real Time Pressure with gameState */}
      <RealTimePressure gameState={gameState} setGameState={setGameState} />
      
      {/* Character Customization */}
      <CharacterCustomization gameState={gameState} setGameState={setGameState} />
      
      {/* Voice Input */}
      <VoiceInput onCommand={sendCommand} />
      
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'grid', 
        gridTemplateColumns: '300px 1fr 380px',
        gridTemplateRows: '1fr',
        gap: '12px',
        padding: '12px',
        boxSizing: 'border-box',
        position: 'absolute',
        top: 0,
        left: 0
      }}>
        
        {/* Left Sidebar - FIXED HEIGHT */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          border: '2px solid #ff6666',
          borderRadius: '12px',
          padding: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            height: '400px', 
            overflowY: 'auto',
            marginBottom: '16px'
          }}>
            <StatusPanel gameState={gameState} />
          </div>
          <div style={{ 
            flex: 1, 
            overflowY: 'auto'
          }}>
            <AchievementSystem 
              gameState={gameState}
              onAchievementUnlock={(achievement) => {
                console.log('Achievement unlocked:', achievement);
              }}
            />
          </div>
        </div>

        {/* Center Area - FIXED HEIGHT MAP */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          border: '2px solid #ff6666',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header - FIXED HEIGHT */}
          <div style={{
            height: '80px',
            flexShrink: 0,
            padding: '16px',
            borderBottom: '1px solid #ff6666',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #ff6666, #ffaa33)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 0 4px 0'
              }}>
                USS PHOENIX COMMAND CENTER
              </h1>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px' }}>
                <span style={{ color: gameState.oxygenLevel > 60 ? '#00ff88' : gameState.oxygenLevel > 30 ? '#ffaa33' : '#ff3333' }}>
                  O₂: {gameState.oxygenLevel}%
                </span>
                <span style={{ color: '#aa88ff' }}>PWR: {gameState.powerLevel}%</span>
                <span style={{ color: '#0088ff' }}>LVL: {gameState.level}</span>
              </div>
            </div>
            <button
              onClick={() => setShowGuideBook(true)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#ff6600',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              📚 MANUAL
            </button>
          </div>
          
          {/* Map Area - FIXED HEIGHT */}
          <div style={{ 
            height: 'calc(100% - 80px)',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <CompleteShipMap 
              currentLocation={gameState.location}
              visitedRooms={visitedRoomsList}
              gameState={gameState}
              lastAction={lastAction}
              rooms={rooms}
              unlockedRooms={unlockedRooms}
              onCommand={sendCommand}
            />
          </div>
        </div>

        {/* Right Sidebar - TERMINAL + COMMAND INPUT */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          border: '2px solid #ff6666',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Terminal Area - TAKES MOST SPACE */}
          <div style={{ 
            flex: 1,
            padding: '16px',
            overflow: 'hidden',
            minHeight: 0
          }}>
            <StableTerminal 
              onCommand={sendCommand}
              isLoading={isLoading}
              lastResponse={lastResponse}
            />
          </div>
          
          {/* SINGLE Command Input - FIXED HEIGHT */}
          <div style={{
            height: '120px',
            flexShrink: 0,
            padding: '16px',
            borderTop: '1px solid #ff6666',
            overflow: 'hidden'
          }}>
            <SmartCommandInput 
              onCommand={sendCommand}
              isLoading={isLoading}
              gameState={gameState}
              currentRoom={getCurrentRoom()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
