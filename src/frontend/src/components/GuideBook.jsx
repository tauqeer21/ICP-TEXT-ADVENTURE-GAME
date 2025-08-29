import React, { useState } from 'react';

function GuideBook({ isOpen, onClose }) {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: "🚨 EMERGENCY PROTOCOL",
      content: `
**CRITICAL SITUATION DETECTED**

You are Commander Alex Chen aboard the USS Phoenix research vessel. 

The ship's AI has suffered a catastrophic failure, causing all automated systems to shut down. Life support is failing, and you have limited time to restore the AI before the ship becomes uninhabitable.

**YOUR MISSION:**
• Navigate through the ship's compartments
• Solve system failures and unlock doors
• Collect essential components and access codes
• Reach the AI Core and restore ship operations

**TIME IS CRITICAL - ACT NOW!**
      `
    },
    {
      title: "🎮 BASIC COMMANDS",
      content: `
**MOVEMENT & NAVIGATION:**
• **look** - Examine your current location
• **go [direction]** - Move (north, south, east, west)
• **map** - View ship layout and your position

**INVENTORY & ITEMS:**
• **take [item]** - Pick up items
• **inventory** (or **i**) - View carried items
• **use [item]** - Use items to solve problems

**INFORMATION:**
• **status** - Check health, location, progress
• **help** - View command list
• **guide** - Reopen this guide book

**INTERACTION:**
• **examine [object]** - Inspect systems/objects
• **unlock [door]** - Try to unlock with keys
• **repair [system]** - Fix broken equipment
      `
    },
    {
      title: "🗺️ SHIP LAYOUT",
      content: `
**USS PHOENIX DECK PLAN:**

**BRIDGE LEVEL (TOP):**
🚀 Bridge → 🧭 Navigation → 📡 Communications

**SECURITY LEVEL:**
🔒 Security ← 🚪 Corridor → ⚔️ Armory

**COMMAND LEVEL:**
🖥️ Command Center (START HERE)

**MAIN CORRIDOR:**
⚙️ Engineering ← ⚛️ Power Core ← ⚡ Main Corridor → 🌬️ Life Support → 🧪 Laboratory

**AI CORE LEVEL (BOTTOM):**
🤖 AI Core (DESTINATION)

**LEGEND:**
• 🔒 = Locked (requires key/code)
• ⚠️ = System failure (needs repair)
• 👤 = Your current position
• ✅ = System restored
      `
    },
    {
      title: "🔧 SYSTEMS & PROBLEMS",
      content: `
**ROOM-SPECIFIC CHALLENGES:**

**🔒 Security Office:**
• Find emergency access codes
• Repair security scanner
• Unlock armory and other secured areas

**⚙️ Engineering Bay:**
• Restore power distribution
• Fix life support connections
• Required: Power tools and repair kit

**⚛️ Power Core:**
• Restart fusion reactor
• Calibrate power output
• Danger: Radiation exposure without suit

**🌬️ Life Support:**
• Repair atmospheric processors
• Restore oxygen generation
• Fix temperature controls

**🧪 Laboratory:**
• Synthesize AI repair matrix
• Analyze corrupted data cores
• Create backup personality matrix

**🤖 AI Core:**
• Install repair components
• Upload personality matrix
• Reboot central AI system
      `
    },
    {
      title: "💡 SURVIVAL TIPS",
      content: `
**ESSENTIAL STRATEGY:**

**1. EXPLORE SYSTEMATICALLY:**
• Visit every accessible room
• Examine all objects and systems
• Take notes of locked doors and requirements

**2. INVENTORY MANAGEMENT:**
• Collect all tools and key items
• Some items combine to create solutions
• Don't leave essential items behind

**3. SOLVE PUZZLES IN ORDER:**
• Some doors require items from other rooms
• Power must be restored before some systems work
• Security codes unlock multiple areas

**4. TIME PRESSURE:**
• Life support is failing gradually
• Some actions consume time/energy
• Efficiency is key to survival

**5. WINNING CONDITION:**
• Collect: AI Activation Key + Core Matrix
• Repair: Power Core + Life Support
• Reach: AI Core and successfully reboot
• Result: Ship systems restored, mission complete!

**GOOD LUCK, COMMANDER!**
      `
    }
  ];

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#0a0a0a',
        border: '2px solid #00ffff',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '80vh',
        padding: '20px',
        fontFamily: 'monospace',
        color: '#ffffff',
        overflow: 'hidden',
        boxShadow: '0 0 30px #00ffff66'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          borderBottom: '2px solid #00ffff',
          paddingBottom: '10px'
        }}>
          <h2 style={{ 
            color: '#00ffff', 
            margin: 0, 
            fontSize: '20px',
            textShadow: '0 0 10px #00ffff'
          }}>
            📚 EMERGENCY OPERATIONS MANUAL
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(45deg, #ff3333, #ff6666)',
              border: 'none',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Content */}
        <div style={{ 
          height: '400px', 
          overflowY: 'auto',
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#001111',
          border: '1px solid #003333',
          borderRadius: '6px'
        }}>
          <h3 style={{ 
            color: '#ffaa33', 
            borderBottom: '1px solid #ffaa33', 
            paddingBottom: '8px',
            fontSize: '18px'
          }}>
            {pages[currentPage].title}
          </h3>
          <div style={{ 
            whiteSpace: 'pre-line', 
            lineHeight: '1.6',
            fontSize: '14px',
            color: '#cccccc'
          }}>
            {pages[currentPage].content}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderTop: '1px solid #003333',
          paddingTop: '15px'
        }}>
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            style={{
              background: currentPage === 0 ? '#333333' : 'linear-gradient(45deg, #0066cc, #0099ff)',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            ← PREV
          </button>

          <div style={{ 
            display: 'flex', 
            gap: '8px',
            color: '#00ffff'
          }}>
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === currentPage ? '#00ffff' : '#333333',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
            disabled={currentPage === pages.length - 1}
            style={{
              background: currentPage === pages.length - 1 ? '#333333' : 'linear-gradient(45deg, #0066cc, #0099ff)',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: currentPage === pages.length - 1 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            NEXT →
          </button>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '15px', 
          fontSize: '12px', 
          color: '#666666' 
        }}>
          Page {currentPage + 1} of {pages.length} | Type "guide" in-game to reopen
        </div>
      </div>
    </div>
  );
}

export default GuideBook;
