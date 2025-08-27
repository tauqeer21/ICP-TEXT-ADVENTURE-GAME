import React, { useState } from 'react';

function CharacterCustomization({ isOpen, onComplete, onClose }) {
  const [character, setCharacter] = useState({
    name: 'Alex Chen',
    callsign: 'Phoenix-1',
    specialization: 'engineer',
    background: 'military',
    appearance: {
      skin: 'medium',
      hair: 'dark',
      uniform: 'standard'
    },
    traits: [],
    stats: {
      technical: 5,
      leadership: 3,
      survival: 4,
      medical: 2
    }
  });

  const specializations = {
    engineer: {
      name: 'Chief Engineer',
      description: 'Expert in ship systems and repairs',
      icon: '⚙️',
      bonuses: { technical: +3, powerEfficiency: +25 },
      skills: ['Advanced Repair', 'System Override', 'Power Management']
    },
    pilot: {
      name: 'Navigation Officer',
      description: 'Skilled in ship navigation and piloting',
      icon: '🚀',
      bonuses: { leadership: +2, movementSpeed: +20 },
      skills: ['Quick Navigation', 'Emergency Maneuvers', 'Sensor Analysis']
    },
    scientist: {
      name: 'Research Specialist',
      description: 'Expert in analysis and problem-solving',
      icon: '🧪',
      bonuses: { medical: +2, scannerRange: +30 },
      skills: ['Advanced Scanning', 'Chemical Analysis', 'Data Recovery']
    },
    security: {
      name: 'Security Chief',
      description: 'Trained in security and emergency response',
      icon: '🛡️',
      bonuses: { survival: +3, oxygenEfficiency: +20 },
      skills: ['Security Override', 'Emergency Protocols', 'Threat Assessment']
    }
  };

  const backgrounds = {
    military: {
      name: 'Starfleet Academy',
      description: 'Military training and discipline',
      bonuses: { leadership: +1, survival: +1 }
    },
    civilian: {
      name: 'Civilian Expert',
      description: 'Specialized civilian contractor',
      bonuses: { technical: +1, medical: +1 }
    },
    research: {
      name: 'Research Institute',
      description: 'Scientific research background',
      bonuses: { medical: +2 }
    },
    merchant: {
      name: 'Merchant Marine',
      description: 'Commercial space experience',
      bonuses: { technical: +1, survival: +1 }
    }
  };

  const traits = [
    { id: 'quick_learner', name: 'Quick Learner', description: '+50% XP gain', cost: 2 },
    { id: 'survivor', name: 'Survivor', description: '+25% oxygen efficiency', cost: 2 },
    { id: 'tech_savvy', name: 'Tech Savvy', description: 'Faster repair times', cost: 1 },
    { id: 'calm_under_pressure', name: 'Calm Under Pressure', description: 'Better performance when oxygen < 30%', cost: 2 },
    { id: 'resourceful', name: 'Resourceful', description: 'Find extra items', cost: 1 },
    { id: 'leadership', name: 'Natural Leader', description: '+1 to all stats when helping others', cost: 3 }
  ];

  const updateCharacter = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCharacter(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCharacter(prev => ({ ...prev, [field]: value }));
    }
  };

  const toggleTrait = (traitId) => {
    setCharacter(prev => ({
      ...prev,
      traits: prev.traits.includes(traitId)
        ? prev.traits.filter(t => t !== traitId)
        : [...prev.traits, traitId]
    }));
  };

  const getUsedTraitPoints = () => {
    return character.traits.reduce((total, traitId) => {
      const trait = traits.find(t => t.id === traitId);
      return total + (trait ? trait.cost : 0);
    }, 0);
  };

  const calculateFinalStats = () => {
    let finalStats = { ...character.stats };
    
    // Apply specialization bonuses
    const spec = specializations[character.specialization];
    Object.entries(spec.bonuses).forEach(([stat, bonus]) => {
      if (finalStats[stat] !== undefined) {
        finalStats[stat] += bonus;
      }
    });
    
    // Apply background bonuses
    const bg = backgrounds[character.background];
    Object.entries(bg.bonuses).forEach(([stat, bonus]) => {
      if (finalStats[stat] !== undefined) {
        finalStats[stat] += bonus;
      }
    });
    
    return finalStats;
  };

  if (!isOpen) return null;

  const maxTraitPoints = 5;
  const usedTraitPoints = getUsedTraitPoints();
  const finalStats = calculateFinalStats();

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
        border: '3px solid #00ffff',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 0 30px #00ffff66'
      }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '30px',
          borderBottom: '2px solid #00ffff',
          paddingBottom: '15px'
        }}>
          <h2 style={{ 
            color: '#00ffff', 
            fontSize: '24px',
            margin: 0,
            textShadow: '0 0 10px #00ffff'
          }}>
            👨‍🚀 COMMANDER PROFILE SETUP
          </h2>
          <p style={{ 
            color: '#cccccc', 
            fontSize: '14px',
            margin: '8px 0 0 0'
          }}>
            Customize your emergency response commander
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Left Column - Basic Info */}
          <div>
            {/* Name & Callsign */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#ffaa33', fontSize: '16px', marginBottom: '10px' }}>
                👤 Identity
              </h3>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ color: '#cccccc', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                  Commander Name:
                </label>
                <input
                  type="text"
                  value={character.name}
                  onChange={(e) => updateCharacter('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#001122',
                    border: '1px solid #00ffff',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ color: '#cccccc', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                  Callsign:
                </label>
                <input
                  type="text"
                  value={character.callsign}
                  onChange={(e) => updateCharacter('callsign', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#001122',
                    border: '1px solid #00ffff',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* Specialization */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#ffaa33', fontSize: '16px', marginBottom: '10px' }}>
                ⚡ Specialization
              </h3>
              {Object.entries(specializations).map(([key, spec]) => (
                <div
                  key={key}
                  onClick={() => updateCharacter('specialization', key)}
                  style={{
                    padding: '12px',
                    backgroundColor: character.specialization === key ? '#003366' : '#001122',
                    border: `2px solid ${character.specialization === key ? '#00ffff' : '#333333'}`,
                    borderRadius: '6px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '20px', marginRight: '8px' }}>{spec.icon}</span>
                    <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{spec.name}</span>
                  </div>
                  <div style={{ color: '#cccccc', fontSize: '12px', marginBottom: '6px' }}>
                    {spec.description}
                  </div>
                  <div style={{ color: '#00ff88', fontSize: '11px' }}>
                    Skills: {spec.skills.join(', ')}
                  </div>
                </div>
              ))}
            </div>

            {/* Background */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#ffaa33', fontSize: '16px', marginBottom: '10px' }}>
                📚 Background
              </h3>
              {Object.entries(backgrounds).map(([key, bg]) => (
                <div
                  key={key}
                  onClick={() => updateCharacter('background', key)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: character.background === key ? '#330033' : '#111111',
                    border: `1px solid ${character.background === key ? '#ff66ff' : '#333333'}`,
                    borderRadius: '4px',
                    marginBottom: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold' }}>
                    {bg.name}
                  </div>
                  <div style={{ color: '#cccccc', fontSize: '11px' }}>
                    {bg.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Stats & Traits */}
          <div>
            {/* Stats Display */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#ffaa33', fontSize: '16px', marginBottom: '10px' }}>
                📊 Final Stats
              </h3>
              {Object.entries(finalStats).map(([stat, value]) => (
                <div key={stat} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  padding: '6px 8px',
                  backgroundColor: '#001122',
                  borderRadius: '4px'
                }}>
                  <span style={{ color: '#cccccc', textTransform: 'capitalize' }}>
                    {stat.replace('_', ' ')}:
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '80px',
                      height: '8px',
                      backgroundColor: '#333333',
                      borderRadius: '4px',
                      marginRight: '8px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.min(100, (value / 10) * 100)}%`,
                        height: '100%',
                        backgroundColor: value >= 7 ? '#00ff88' : value >= 4 ? '#ffaa33' : '#ff6666',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                    <span style={{ 
                      color: value >= 7 ? '#00ff88' : value >= 4 ? '#ffaa33' : '#ff6666',
                      fontWeight: 'bold',
                      minWidth: '20px'
                    }}>
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Traits */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#ffaa33', fontSize: '16px', marginBottom: '6px' }}>
                🌟 Traits ({usedTraitPoints}/{maxTraitPoints} points)
              </h3>
              <div style={{ marginBottom: '15px' }}>
                {traits.map(trait => (
                  <div
                    key={trait.id}
                    onClick={() => {
                      if (!character.traits.includes(trait.id) && usedTraitPoints + trait.cost > maxTraitPoints) {
                        return; // Can't afford
                      }
                      toggleTrait(trait.id);
                    }}
                    style={{
                      padding: '8px',
                      backgroundColor: character.traits.includes(trait.id) ? '#003300' : '#111111',
                      border: `1px solid ${character.traits.includes(trait.id) ? '#00ff88' : '#333333'}`,
                      borderRadius: '4px',
                      marginBottom: '6px',
                      cursor: (!character.traits.includes(trait.id) && usedTraitPoints + trait.cost > maxTraitPoints) 
                        ? 'not-allowed' : 'pointer',
                      opacity: (!character.traits.includes(trait.id) && usedTraitPoints + trait.cost > maxTraitPoints) 
                        ? 0.5 : 1
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: 'bold' }}>
                          {trait.name}
                        </div>
                        <div style={{ color: '#cccccc', fontSize: '11px' }}>
                          {trait.description}
                        </div>
                      </div>
                      <div style={{ 
                        color: '#ffaa33', 
                        fontSize: '12px', 
                        fontWeight: 'bold',
                        minWidth: '40px',
                        textAlign: 'right'
                      }}>
                        {trait.cost} pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Character Preview */}
            <div style={{
              backgroundColor: '#001122',
              border: '2px solid #00ffff',
              borderRadius: '8px',
              padding: '15px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                {specializations[character.specialization].icon}
              </div>
              <div style={{ color: '#00ffff', fontSize: '16px', fontWeight: 'bold' }}>
                Commander {character.name}
              </div>
              <div style={{ color: '#ffaa33', fontSize: '12px' }}>
                Callsign: {character.callsign}
              </div>
              <div style={{ color: '#cccccc', fontSize: '12px', marginTop: '4px' }}>
                {specializations[character.specialization].name}
              </div>
              <div style={{ color: '#cccccc', fontSize: '11px' }}>
                {backgrounds[character.background].name}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '30px',
          borderTop: '1px solid #333333',
          paddingTop: '20px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              backgroundColor: '#330000',
              border: '2px solid #ff3333',
              borderRadius: '6px',
              color: '#ff3333',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ❌ Cancel
          </button>
          
          <button
            onClick={() => onComplete(character)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#003300',
              border: '2px solid #00ff88',
              borderRadius: '6px',
              color: '#00ff88',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ✅ Begin Mission
          </button>
        </div>
      </div>
    </div>
  );
}

export default CharacterCustomization;
