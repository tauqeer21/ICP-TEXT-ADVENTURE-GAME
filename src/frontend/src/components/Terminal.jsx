import React, { useState, useEffect, useRef } from 'react';

function Terminal({ onCommand, isLoading, lastResponse }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new content appears
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lastResponse, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const command = input.trim();
      setHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
      setInput('');
      await onCommand(command);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = Math.min(history.length - 1, historyIndex + 1);
        if (newIndex === history.length - 1) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  const startupMessage = `╔══════════════════════════════════════════════════════════════╗
║           USS PHOENIX EMERGENCY COMMAND INTERFACE            ║
║                    🚨 RED ALERT STATUS 🚨                    ║
╚══════════════════════════════════════════════════════════════╝

👨‍🚀 COMMANDER - You are our only hope.
🎯 PRIMARY MISSION: Navigate to AI Core and restore ship systems
⚡ All 16 ship compartments now accessible via interactive map

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
      borderRadius: '8px'
    }}>
      {/* Terminal Content - FIXED HEIGHT WITH SCROLL */}
      <div 
        ref={terminalRef}
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '15px',
          fontFamily: 'monospace',
          fontSize: '12px',
          lineHeight: '1.4',
          // IMPORTANT: These styles prevent layout shifts
          minHeight: 0, // Allow flexbox to shrink
          maxHeight: '100%' // Prevent overflow
        }}
      >
        {/* Startup Message */}
        <div style={{ 
          color: '#00ffff', 
          marginBottom: '15px', 
          whiteSpace: 'pre-line',
          borderBottom: '1px solid #003366',
          paddingBottom: '10px'
        }}>
          {startupMessage}
        </div>

        {/* Game Response */}
        {lastResponse && (
          <div style={{ marginBottom: '15px' }}>
            <div 
              style={{ 
                color: '#ffaa33', 
                whiteSpace: 'pre-line',
                marginBottom: '10px',
                padding: '10px',
                backgroundColor: '#001122',
                borderRadius: '4px',
                border: '1px solid #ffaa33'
              }}
            >
              {lastResponse.message}
            </div>
            
            {/* Compact Status Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              padding: '6px',
              backgroundColor: '#000033',
              borderRadius: '4px',
              fontSize: '11px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#00ff88' }}>LVL {lastResponse.gameState.level}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#ffaa33' }}>{lastResponse.gameState.xp} XP</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#ffff33' }}>{lastResponse.gameState.credits}₵</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  color: lastResponse.gameState.oxygenLevel > 60 ? '#00ff88' : 
                        lastResponse.gameState.oxygenLevel > 30 ? '#ffaa33' : '#ff3333'
                }}>
                  O₂ {lastResponse.gameState.oxygenLevel}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div style={{
            padding: '10px',
            backgroundColor: '#000033',
            borderRadius: '4px',
            color: '#0066ff',
            fontSize: '11px',
            textAlign: 'center'
          }}>
            ⚡ Processing command...
          </div>
        )}
      </div>

      {/* Command Input - FIXED AT BOTTOM */}
      <div style={{
        flexShrink: 0, // Never shrink
        padding: '10px',
        borderTop: '1px solid #003366',
        backgroundColor: '#000411'
      }}>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ 
            color: '#ff6666', 
            marginRight: '8px', 
            fontWeight: 'bold',
            fontSize: '12px'
          }}>
            PHOENIX:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#00ffff',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
            placeholder={isLoading ? "Processing..." : "Enter command..."}
            disabled={isLoading}
            autoFocus
            spellCheck="false"
            autoComplete="off"
          />
          {input && (
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginLeft: '8px',
                padding: '4px 8px',
                backgroundColor: '#ff6600',
                border: 'none',
                borderRadius: '3px',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              EXEC
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Terminal;
