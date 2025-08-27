import React, { useState, useRef, useEffect } from 'react';

function SmartCommandInput({ onCommand, isLoading, gameState, currentRoom }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Smart command suggestions
  const getContextualSuggestions = (partialCommand) => {
    const baseCommands = {
      'l': ['look', 'laboratory'],
      'g': ['go north', 'go south', 'go east', 'go west', 'go northeast', 'go southwest'],
      't': ['take', 'talk'],
      'u': ['use', 'unlock'],
      'i': ['inventory'],
      's': ['status', 'scan'],
      'h': ['help'],
      'guide': ['guide'],
      'e': ['examine', 'escape'],
      'r': ['repair', 'restart'],
      'a': ['activate', 'analyze']
    };

    // Context-aware suggestions based on current room
    const contextualSuggestions = {
      items: currentRoom?.items || [],
      exits: Object.keys(currentRoom?.exits || {}),
      inventory: gameState?.inventory || []
    };

    let suggestions = [];
    
    // Add base command suggestions
    Object.entries(baseCommands).forEach(([key, commands]) => {
      if (key.startsWith(partialCommand.toLowerCase())) {
        suggestions.push(...commands);
      }
    });

    // Add contextual suggestions
    if (partialCommand.toLowerCase().startsWith('take ')) {
      const itemPart = partialCommand.slice(5).toLowerCase();
      contextualSuggestions.items.forEach(item => {
        if (item.toLowerCase().includes(itemPart)) {
          suggestions.push(`take ${item}`);
        }
      });
    } else if (partialCommand.toLowerCase().startsWith('go ')) {
      const directionPart = partialCommand.slice(3).toLowerCase();
      contextualSuggestions.exits.forEach(exit => {
        if (exit.toLowerCase().includes(directionPart)) {
          suggestions.push(`go ${exit}`);
        }
      });
    } else if (partialCommand.toLowerCase().startsWith('use ')) {
      const itemPart = partialCommand.slice(4).toLowerCase();
      contextualSuggestions.inventory.forEach(item => {
        if (item.toLowerCase().includes(itemPart)) {
          suggestions.push(`use ${item}`);
        }
      });
    }

    // Remove duplicates and filter by input
    return [...new Set(suggestions)]
      .filter(cmd => cmd.toLowerCase().includes(partialCommand.toLowerCase()))
      .slice(0, 6);
  };

  useEffect(() => {
    if (input.length > 0) {
      const newSuggestions = getContextualSuggestions(input);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
      setSelectedSuggestion(-1);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [input, currentRoom, gameState]);

  const handleKeyDown = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion(prev => prev <= 0 ? suggestions.length - 1 : prev - 1);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          setInput(suggestions[selectedSuggestion]);
          setShowSuggestions(false);
        } else if (suggestions.length > 0) {
          setInput(suggestions[0]);
          setShowSuggestions(false);
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onCommand(input.trim());
      setInput('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeydown = (e) => {
      if (e.altKey) {
        switch(e.key) {
          case 'i':
            e.preventDefault();
            onCommand('inventory');
            break;
          case 'm':
            e.preventDefault();
            onCommand('map');
            break;
          case 'h':
            e.preventDefault();
            onCommand('help');
            break;
          case 's':
            e.preventDefault();
            onCommand('status');
            break;
          case 'l':
            e.preventDefault();
            onCommand('look');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeydown);
    return () => window.removeEventListener('keydown', handleGlobalKeydown);
  }, [onCommand]);

  return (
    <div className="smart-command-input" style={{ position: 'relative' }}>
      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#001122',
          border: '2px solid #0066ff',
          borderRadius: '8px',
          marginBottom: '8px',
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 1000
        }}>
          <div style={{ 
            padding: '8px', 
            color: '#0066ff', 
            fontSize: '12px', 
            borderBottom: '1px solid #003366',
            fontWeight: 'bold'
          }}>
            💡 Smart Suggestions (Tab to accept, ↑↓ to navigate):
          </div>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: index === selectedSuggestion ? '#003366' : 'transparent',
                color: index === selectedSuggestion ? '#ffffff' : '#cccccc',
                fontSize: '14px',
                fontFamily: 'monospace',
                borderBottom: index < suggestions.length - 1 ? '1px solid #002244' : 'none'
              }}
              onMouseEnter={() => setSelectedSuggestion(index)}
            >
              <span style={{ color: '#00ffff' }}>▶</span> {suggestion}
            </div>
          ))}
        </div>
      )}

      {/* Command Input Form */}
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        backgroundColor: '#001111',
        border: '2px solid #00ffff',
        borderRadius: '8px',
        position: 'relative'
      }}>
        <span style={{ 
          color: '#ff6666', 
          marginRight: '8px', 
          fontWeight: 'bold',
          textShadow: '0 0 8px #ff6666'
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
            fontSize: '14px',
            textShadow: '0 0 5px #00ffff66'
          }}
          placeholder={isLoading ? "Processing..." : "Type command... (Alt+H for shortcuts)"}
          disabled={isLoading}
          autoFocus
          spellCheck="false"
          autoComplete="off"
        />
        
        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
          <button
            type="button"
            onClick={() => onCommand('look')}
            disabled={isLoading}
            style={{
              padding: '4px 8px',
              backgroundColor: '#003366',
              border: '1px solid #0066ff',
              borderRadius: '4px',
              color: '#0066ff',
              fontSize: '10px',
              cursor: 'pointer'
            }}
            title="Quick Look (Alt+L)"
          >
            👁️
          </button>
          <button
            type="button"
            onClick={() => onCommand('inventory')}
            disabled={isLoading}
            style={{
              padding: '4px 8px',
              backgroundColor: '#003366',
              border: '1px solid #0066ff',
              borderRadius: '4px',
              color: '#0066ff',
              fontSize: '10px',
              cursor: 'pointer'
            }}
            title="Inventory (Alt+I)"
          >
            🎒
          </button>
          <button
            type="button"
            onClick={() => onCommand('status')}
            disabled={isLoading}
            style={{
              padding: '4px 8px',
              backgroundColor: '#003366',
              border: '1px solid #0066ff',
              borderRadius: '4px',
              color: '#0066ff',
              fontSize: '10px',
              cursor: 'pointer'
            }}
            title="Status (Alt+S)"
          >
            📊
          </button>
        </div>

        {input && (
          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginLeft: '8px',
              padding: '6px 12px',
              backgroundColor: '#ff6600',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              textShadow: '0 0 5px #000000'
            }}
          >
            EXEC
          </button>
        )}
      </form>

      {/* Keyboard Shortcuts Help */}
      <div style={{
        marginTop: '4px',
        fontSize: '10px',
        color: '#666666',
        textAlign: 'center'
      }}>
        ⌨️ Shortcuts: Alt+I (Inventory) | Alt+L (Look) | Alt+S (Status) | Alt+H (Help) | Tab (Accept Suggestion)
      </div>
    </div>
  );
}

export default SmartCommandInput;
