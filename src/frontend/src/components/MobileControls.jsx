import React, { useState } from 'react';

function MobileControls({ onCommand, gameState, currentRoom }) {
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const quickCommands = [
    { label: '👁️', command: 'look', color: '#0066ff' },
    { label: '🎒', command: 'inventory', color: '#00ff66' },
    { label: '📊', command: 'status', color: '#ff6600' },
    { label: '❓', command: 'help', color: '#ff00ff' },
  ];

  const movementCommands = [
    { label: '⬆️', command: 'go north', direction: 'north' },
    { label: '⬇️', command: 'go south', direction: 'south' },
    { label: '⬅️', command: 'go west', direction: 'west' },
    { label: '➡️', command: 'go east', direction: 'east' },
  ];

  const contextCommands = React.useMemo(() => {
    const commands = [];
    
    // Add item commands based on current room
    if (currentRoom?.items) {
      currentRoom.items.forEach(item => {
        if (!gameState.inventory?.includes(item)) {
          commands.push({
            label: `📦 Take ${item}`,
            command: `take ${item}`,
            color: '#00ff88'
          });
        }
      });
    }

    // Add use commands based on inventory
    if (gameState.inventory) {
      gameState.inventory.slice(0, 3).forEach(item => {
        commands.push({
          label: `⚡ Use ${item}`,
          command: `use ${item}`,
          color: '#ffaa33'
        });
      });
    }

    return commands;
  }, [currentRoom, gameState]);

  return (
    <div className="mobile-controls" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#000000dd',
      backdropFilter: 'blur(10px)',
      padding: '15px',
      zIndex: 1000,
      borderTop: '2px solid #00ffff'
    }}>
      {/* Quick Action Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginBottom: '10px'
      }}>
        {quickCommands.map((cmd, index) => (
          <button
            key={index}
            onClick={() => onCommand(cmd.command)}
            style={{
              padding: '12px',
              backgroundColor: cmd.color + '22',
              border: `2px solid ${cmd.color}`,
              borderRadius: '8px',
              color: cmd.color,
              fontSize: '18px',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            {cmd.label}
          </button>
        ))}
      </div>

      {/* Movement Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr',
        gap: '4px',
        maxWidth: '200px',
        margin: '0 auto 10px auto'
      }}>
        <div></div>
        <button
          onClick={() => onCommand('go north')}
          style={{
            padding: '10px',
            backgroundColor: '#003366',
            border: '2px solid #0066ff',
            borderRadius: '6px',
            color: '#0066ff',
            fontSize: '16px'
          }}
        >
          ⬆️
        </button>
        <div></div>
        
        <button
          onClick={() => onCommand('go west')}
          style={{
            padding: '10px',
            backgroundColor: '#003366',
            border: '2px solid #0066ff',
            borderRadius: '6px',
            color: '#0066ff',
            fontSize: '16px'
          }}
        >
          ⬅️
        </button>
        <button
          onClick={() => setShowCommandPalette(!showCommandPalette)}
          style={{
            padding: '10px',
            backgroundColor: showCommandPalette ? '#330066' : '#660033',
            border: `2px solid ${showCommandPalette ? '#6600ff' : '#ff0066'}`,
            borderRadius: '6px',
            color: showCommandPalette ? '#6600ff' : '#ff0066',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          CMD
        </button>
        <button
          onClick={() => onCommand('go east')}
          style={{
            padding: '10px',
            backgroundColor: '#003366',
            border: '2px solid #0066ff',
            borderRadius: '6px',
            color: '#0066ff',
            fontSize: '16px'
          }}
        >
          ➡️
        </button>
        
        <div></div>
        <button
          onClick={() => onCommand('go south')}
          style={{
            padding: '10px',
            backgroundColor: '#003366',
            border: '2px solid #0066ff',
            borderRadius: '6px',
            color: '#0066ff',
            fontSize: '16px'
          }}
        >
          ⬇️
        </button>
        <div></div>
      </div>

      {/* Expandable Command Palette */}
      {showCommandPalette && (
        <div style={{
          backgroundColor: '#001122',
          border: '2px solid #00ffff',
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '10px',
          maxHeight: '150px',
          overflowY: 'auto'
        }}>
          <div style={{ 
            color: '#00ffff',
            fontSize: '12px',
            fontWeight: 'bold',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            Context Commands
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px'
          }}>
            {contextCommands.map((cmd, index) => (
              <button
                key={index}
                onClick={() => {
                  onCommand(cmd.command);
                  setShowCommandPalette(false);
                }}
                style={{
                  padding: '8px',
                  backgroundColor: cmd.color + '22',
                  border: `1px solid ${cmd.color}`,
                  borderRadius: '4px',
                  color: cmd.color,
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                {cmd.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '4px',
        fontSize: '10px',
        textAlign: 'center'
      }}>
        <div style={{ color: '#00ff88' }}>
          LVL {gameState.level}
        </div>
        <div style={{ color: '#ffaa33' }}>
          {gameState.xp} XP
        </div>
        <div style={{ color: gameState.oxygenLevel > 60 ? '#00ff88' : gameState.oxygenLevel > 30 ? '#ffaa33' : '#ff3333' }}>
          O₂ {gameState.oxygenLevel}%
        </div>
        <div style={{ color: '#0066ff' }}>
          {gameState.inventory?.length || 0} Items
        </div>
      </div>
    </div>
  );
}

export default MobileControls;
