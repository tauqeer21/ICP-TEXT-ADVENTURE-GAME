import React, { useState, useEffect, useRef } from 'react';

function MiniGameSystem({ isOpen, gameType, onComplete, onClose, difficulty = 'normal' }) {
  const [gameState, setGameState] = useState('playing');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameData, setGameData] = useState({});
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      initializeGame();
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('failed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isOpen, gameType]);

  const initializeGame = () => {
    setTimeLeft(difficulty === 'easy' ? 45 : difficulty === 'hard' ? 20 : 30);
    setScore(0);
    setGameState('playing');
    
    switch (gameType) {
      case 'wire_puzzle':
        initializeWirePuzzle();
        break;
      case 'pressure_valve':
        initializePressureValve();
        break;
      case 'code_breaking':
        initializeCodeBreaking();
        break;
      case 'reactor_stabilization':
        initializeReactorStabilization();
        break;
      default:
        initializeWirePuzzle();
    }
  };

  // Wire Connection Mini-Game
  const initializeWirePuzzle = () => {
    const wires = [
      { id: 1, color: '#ff3333', start: 'A', end: 'Y', connected: false },
      { id: 2, color: '#33ff33', start: 'B', end: 'Z', connected: false },
      { id: 3, color: '#3333ff', start: 'C', end: 'X', connected: false },
      { id: 4, color: '#ffff33', start: 'D', end: 'W', connected: false },
      { id: 5, color: '#ff33ff', start: 'E', end: 'V', connected: false }
    ];
    setGameData({ wires, selectedWire: null, correctConnections: 0 });
  };

  // Pressure Valve Mini-Game
  const initializePressureValve = () => {
    setGameData({
      currentPressure: 75,
      targetPressure: 50,
      valvePosition: 50,
      pressureHistory: [75],
      stabilityCount: 0
    });
  };

  // Code Breaking Mini-Game
  const initializeCodeBreaking = () => {
    const targetCode = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
    setGameData({
      targetCode,
      currentCode: [0, 0, 0, 0],
      attempts: [],
      maxAttempts: 8
    });
  };

  // Reactor Stabilization Mini-Game
  const initializeReactorStabilization = () => {
    setGameData({
      reactorTemp: 2500,
      targetTemp: 2000,
      coolantFlow: 50,
      controlRods: 50,
      stabilityTime: 0,
      warnings: []
    });
  };

  const handleWireConnect = (wireId, endpoint) => {
    const updatedWires = gameData.wires.map(wire => {
      if (wire.id === wireId) {
        const isCorrect = (wire.start === 'A' && endpoint === 'Y') ||
                         (wire.start === 'B' && endpoint === 'Z') ||
                         (wire.start === 'C' && endpoint === 'X') ||
                         (wire.start === 'D' && endpoint === 'W') ||
                         (wire.start === 'E' && endpoint === 'V');
        
        if (isCorrect && !wire.connected) {
          setScore(prev => prev + 20);
          return { ...wire, connected: true };
        }
      }
      return wire;
    });
    
    const correctCount = updatedWires.filter(w => w.connected).length;
    setGameData({ ...gameData, wires: updatedWires, correctConnections: correctCount });
    
    if (correctCount === 5) {
      setGameState('success');
      setTimeout(() => onComplete(true, score + 100), 1000);
    }
  };

  const handlePressureValve = (direction) => {
    const change = direction === 'increase' ? 5 : -5;
    const newPressure = Math.max(0, Math.min(100, gameData.currentPressure + change));
    const newHistory = [...gameData.pressureHistory, newPressure].slice(-20);
    
    let stabilityCount = gameData.stabilityCount;
    if (Math.abs(newPressure - gameData.targetPressure) <= 2) {
      stabilityCount++;
      if (stabilityCount >= 5) {
        setGameState('success');
        setTimeout(() => onComplete(true, score + timeLeft * 5), 1000);
        return;
      }
    } else {
      stabilityCount = 0;
    }
    
    setGameData({
      ...gameData,
      currentPressure: newPressure,
      pressureHistory: newHistory,
      stabilityCount
    });
  };

  const renderWirePuzzle = () => (
    <div className="wire-puzzle" style={{ width: '400px', height: '300px', position: 'relative', backgroundColor: '#001122', border: '2px solid #00ffff', borderRadius: '8px', padding: '20px' }}>
      <div style={{ color: '#00ffff', fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' }}>
        🔌 WIRE CONNECTION REPAIR
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', height: '200px' }}>
        {/* Left terminals */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
          {gameData.wires?.map(wire => (
            <div
              key={`start-${wire.id}`}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: wire.color,
                border: '2px solid #ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#000000'
              }}
            >
              {wire.start}
            </div>
          ))}
        </div>
        
        {/* Connection lines */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="200" height="200">
            {gameData.wires?.map((wire, index) => (
              wire.connected && (
                <line
                  key={`line-${wire.id}`}
                  x1="10"
                  y1={20 + index * 40}
                  x2="190"
                  y2={20 + ['Y','Z','X','W','V'].indexOf(wire.end) * 40}
                  stroke={wire.color}
                  strokeWidth="3"
                />
              )
            ))}
          </svg>
        </div>
        
        {/* Right terminals */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
          {['Y', 'Z', 'X', 'W', 'V'].map((terminal, index) => (
            <div
              key={`end-${terminal}`}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#666666',
                border: '2px solid #ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#ffffff'
              }}
              onClick={() => gameData.selectedWire && handleWireConnect(gameData.selectedWire, terminal)}
            >
              {terminal}
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '12px' }}>
        <div style={{ color: '#00ff88' }}>Connected: {gameData.correctConnections}/5</div>
        <div style={{ color: '#ffaa33', marginTop: '5px' }}>Click wire colors, then click matching terminals</div>
      </div>
    </div>
  );

  const renderPressureValve = () => (
    <div className="pressure-valve" style={{ width: '400px', height: '350px', backgroundColor: '#001122', border: '2px solid #00ffff', borderRadius: '8px', padding: '20px' }}>
      <div style={{ color: '#00ffff', fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' }}>
        ⚡ PRESSURE REGULATION SYSTEM
      </div>
      
      {/* Pressure Gauge */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ 
          width: '200px', 
          height: '20px', 
          backgroundColor: '#333333', 
          border: '2px solid #ffffff', 
          borderRadius: '10px',
          margin: '0 auto',
          position: 'relative'
        }}>
          <div style={{
            width: `${gameData.currentPressure}%`,
            height: '100%',
            backgroundColor: Math.abs(gameData.currentPressure - gameData.targetPressure) <= 2 ? '#00ff88' : '#ff3333',
            borderRadius: '8px',
            transition: 'all 0.3s ease'
          }}></div>
          <div style={{
            position: 'absolute',
            left: `${gameData.targetPressure}%`,
            top: '-5px',
            width: '2px',
            height: '30px',
            backgroundColor: '#ffff33',
            transform: 'translateX(-1px)'
          }}></div>
        </div>
        <div style={{ color: '#ffffff', fontSize: '12px', marginTop: '8px' }}>
          Current: {gameData.currentPressure}% | Target: {gameData.targetPressure}%
        </div>
        <div style={{ color: '#00ff88', fontSize: '11px' }}>
          Stability: {gameData.stabilityCount}/5 seconds
        </div>
      </div>
      
      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        <button
          onClick={() => handlePressureValve('decrease')}
          style={{
            padding: '15px 20px',
            backgroundColor: '#003366',
            border: '2px solid #0066ff',
            borderRadius: '8px',
            color: '#0066ff',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ⬇️ RELEASE
        </button>
        <button
          onClick={() => handlePressureValve('increase')}
          style={{
            padding: '15px 20px',
            backgroundColor: '#660000',
            border: '2px solid #ff3333',
            borderRadius: '8px',
            color: '#ff3333',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ⬆️ INCREASE
        </button>
      </div>
      
      {/* Pressure History Graph */}
      <div style={{ height: '80px', backgroundColor: '#000000', border: '1px solid #333333', borderRadius: '4px', position: 'relative' }}>
        <svg width="100%" height="100%">
          <line x1="0" y1={`${100 - gameData.targetPressure}%`} x2="100%" y2={`${100 - gameData.targetPressure}%`} stroke="#ffff33" strokeWidth="1" strokeDasharray="5,5"/>
          {gameData.pressureHistory?.map((pressure, index) => (
            index > 0 && (
              <line
                key={index}
                x1={`${((index - 1) / (gameData.pressureHistory.length - 1)) * 100}%`}
                y1={`${100 - gameData.pressureHistory[index - 1]}%`}
                x2={`${(index / (gameData.pressureHistory.length - 1)) * 100}%`}
                y2={`${100 - pressure}%`}
                stroke="#00ffff"
                strokeWidth="2"
              />
            )
          ))}
        </svg>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#0a0a0a',
        border: '3px solid #ff6600',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 0 30px #ff660066',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{ color: '#ff6600', fontSize: '18px', margin: 0 }}>
              🔧 EMERGENCY REPAIR PROTOCOL
            </h3>
            <p style={{ color: '#ffaa33', fontSize: '12px', margin: '4px 0 0 0' }}>
              Complete the repair before time runs out!
            </p>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#ff3333', fontSize: '16px', fontWeight: 'bold' }}>
              ⏰ {timeLeft}s
            </div>
            <div style={{ color: '#00ff88', fontSize: '14px' }}>
              Score: {score}
            </div>
          </div>
        </div>

        {/* Game Content */}
        <div style={{ marginBottom: '20px' }}>
          {gameType === 'wire_puzzle' && renderWirePuzzle()}
          {gameType === 'pressure_valve' && renderPressureValve()}
        </div>

        {/* Game State Messages */}
        {gameState === 'success' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#002200',
            border: '3px solid #00ff88',
            borderRadius: '12px',
            padding: '30px',
            textAlign: 'center',
            color: '#00ff88',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            ✅ REPAIR SUCCESSFUL!<br/>
            <span style={{ fontSize: '14px' }}>System restored and operational</span>
          </div>
        )}

        {gameState === 'failed' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#220000',
            border: '3px solid #ff3333',
            borderRadius: '12px',
            padding: '30px',
            textAlign: 'center',
            color: '#ff3333',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            ❌ REPAIR FAILED!<br/>
            <span style={{ fontSize: '14px' }}>System remains offline</span>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
          <button
            onClick={() => initializeGame()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#003366',
              border: '2px solid #0066ff',
              borderRadius: '6px',
              color: '#0066ff',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔄 RESTART
          </button>
          
          <button
            onClick={() => onClose(gameState === 'success')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#330000',
              border: '2px solid #ff3333',
              borderRadius: '6px',
              color: '#ff3333',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ❌ ABORT
          </button>
        </div>
      </div>
    </div>
  );
}

export default MiniGameSystem;
