import React, { useState, useMemo } from 'react';

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

  const contextCommands = useMemo(() => {
    const commands = [];
    if (currentRoom?.items) {
      currentRoom.items.forEach(item => {
        if (!gameState.inventory?.includes(item)) {
          commands.push({
            label: `📦 Take ${item}`,
            command: `take ${item}`,
            color: '#00ff88',
          });
        }
      });
    }
    if (gameState.inventory) {
      gameState.inventory.slice(0, 3).forEach(item => {
        commands.push({
          label: `⚡ Use ${item}`,
          command: `use ${item}`,
          color: '#ffaa33',
        });
      });
    }
    return commands;
  }, [currentRoom, gameState.inventory]);

  return (
    <div
      className="mobile-controls"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000000cc',
        backdropFilter: 'blur(10px)',
        padding: '10px 10px 14px',
        zIndex: 11000,
        borderTop: '2px solid #00ffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxHeight: '25vh',
        overflow: 'hidden',
      }}
    >
      {/* Quick Action Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 6,
          width: '100%',
          marginBottom: 8,
        }}
      >
        {quickCommands.map((cmd, index) => (
          <button
            key={index}
            onClick={() => onCommand(cmd.command)}
            style={{
              padding: 8,
              backgroundColor: `${cmd.color}33`,
              border: `1.5px solid ${cmd.color}`,
              borderRadius: 7,
              color: cmd.color,
              fontSize: 16,
              cursor: 'pointer',
              textAlign: 'center',
              userSelect: 'none',
            }}
            aria-label={cmd.command}
            title={cmd.command}
          >
            {cmd.label}
          </button>
        ))}
      </div>

      {/* Movement Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, auto)',
          gridTemplateRows: 'repeat(3, 40px)',
          gap: 4,
          maxWidth: 180,
          width: '100%',
          userSelect: 'none',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div />
        <button
          onClick={() => onCommand('go north')}
          style={movementButtonStyle}
          aria-label="Go north"
          title="Go north"
        >
          ⬆️
        </button>
        <div />
        <button
          onClick={() => onCommand('go west')}
          style={movementButtonStyle}
          aria-label="Go west"
          title="Go west"
        >
          ⬅️
        </button>
        <button
          onClick={() => setShowCommandPalette(!showCommandPalette)}
          style={{
            padding: 8,
            backgroundColor: showCommandPalette ? '#330066' : '#660033',
            border: `1.5px solid ${showCommandPalette ? '#6600ff' : '#ff0066'}`,
            borderRadius: 7,
            color: showCommandPalette ? '#6600ff' : '#ff0066',
            fontSize: 14,
            fontWeight: 'bold',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          aria-label="Toggle command palette"
          title="Toggle command palette"
        >
          CMD
        </button>
        <button
          onClick={() => onCommand('go east')}
          style={movementButtonStyle}
          aria-label="Go east"
          title="Go east"
        >
          ➡️
        </button>
        <div />
        <button
          onClick={() => onCommand('go south')}
          style={movementButtonStyle}
          aria-label="Go south"
          title="Go south"
        >
          ⬇️
        </button>
        <div />
      </div>

      {/* Expandable Command Palette */}
      {showCommandPalette && (
        <div
          style={{
            backgroundColor: '#001122',
            border: '1.5px solid #00ffff',
            borderRadius: 8,
            padding: 8,
            marginTop: 8,
            maxHeight: 140,
            overflowY: 'auto',
            width: '100%',
            maxWidth: 380,
          }}
        >
          <div
            style={{
              color: '#00ffff',
              fontWeight: 'bold',
              marginBottom: 6,
              textAlign: 'center',
              userSelect: 'none',
              fontSize: 14,
            }}
          >
            Context Commands
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 5,
            }}
          >
            {contextCommands.map((cmd, index) => (
              <button
                key={index}
                onClick={() => {
                  onCommand(cmd.command);
                  setShowCommandPalette(false);
                }}
                style={{
                  padding: 6,
                  backgroundColor: `${cmd.color}33`,
                  border: `1px solid ${cmd.color}`,
                  borderRadius: 5,
                  color: cmd.color,
                  fontSize: 12,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                aria-label={cmd.command}
                title={cmd.label}
              >
                {cmd.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 4,
          fontSize: 10,
          textAlign: 'center',
          userSelect: 'none',
          marginTop: 10,
        }}
      >
        <div style={{ color: '#00ff88' }}>LVL {gameState.level}</div>
        <div style={{ color: '#ffaa33' }}>{gameState.xp} XP</div>
        <div
          style={{
            color:
              gameState.oxygenLevel > 60
                ? '#00ff88'
                : gameState.oxygenLevel > 30
                ? '#ffaa33'
                : '#ff3333',
          }}
        >
          O₂ {gameState.oxygenLevel}
        </div>
        <div style={{ color: '#0066ff' }}>
          {gameState.inventory?.length || 0} Items
        </div>
      </div>
    </div>
  );
}

const movementButtonStyle = {
  padding: 8,
  backgroundColor: '#003366',
  border: '1.5px solid #0066ff',
  borderRadius: 7,
  color: '#0066ff',
  fontSize: 14,
  cursor: 'pointer',
  userSelect: 'none',
};

export default MobileControls;
