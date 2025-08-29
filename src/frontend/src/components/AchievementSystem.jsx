import React, { useState, useEffect } from 'react';

function AchievementSystem({ gameState, onAchievementUnlock }) {
  const [achievements, setAchievements] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showNotification, setShowNotification] = useState(null);

  const achievementDefinitions = [
    {
      id: 'first_steps',
      name: 'First Steps',
      description: 'Issue your first command',
      icon: '👶',
      rarity: 'common',
      condition: (state) => state.commandCount >= 1,
      points: 10
    },
    {
      id: 'explorer',
      name: 'Ship Explorer',
      description: 'Visit 5 different compartments',
      icon: '🗺️',
      rarity: 'uncommon',
      condition: (state) => state.visitedRooms >= 5,
      points: 25
    },
    {
      id: 'collector',
      name: 'Equipment Collector',
      description: 'Collect 10 different items',
      icon: '🎒',
      rarity: 'uncommon',
      condition: (state) => state.inventory?.length >= 10,
      points: 30
    },
    {
      id: 'speed_runner',
      name: 'Emergency Response',
      description: 'Complete mission in under 50 commands',
      icon: '⚡',
      rarity: 'rare',
      condition: (state) => state.gameCompleted && state.commandCount < 50,
      points: 75
    },
    {
      id: 'survivor',
      name: 'Survivor',
      description: 'Complete mission with oxygen above 50%',
      icon: '🫁',
      rarity: 'rare',
      condition: (state) => state.gameCompleted && state.oxygenLevel > 50,
      points: 60
    },
    {
      id: 'level_master',
      name: 'Level Master',
      description: 'Reach level 5',
      icon: '🏆',
      rarity: 'epic',
      condition: (state) => state.level >= 5,
      points: 100
    },
    {
      id: 'completionist',
      name: 'Mission Complete',
      description: 'Successfully restore ship AI',
      icon: '🤖',
      rarity: 'legendary',
      condition: (state) => state.gameCompleted,
      points: 200
    },
    {
      id: 'perfectionist',
      name: 'Perfect Run',
      description: 'Complete with 100% oxygen and all items',
      icon: '💎',
      rarity: 'legendary',
      condition: (state) => state.gameCompleted && state.oxygenLevel === 100 && state.inventory?.length >= 15,
      points: 500
    }
  ];

  // Check for new achievements
  useEffect(() => {
    const newlyUnlocked = [];
    
    achievementDefinitions.forEach(achievement => {
      if (!unlockedAchievements.includes(achievement.id) && achievement.condition(gameState)) {
        newlyUnlocked.push(achievement);
      }
    });

    if (newlyUnlocked.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newlyUnlocked.map(a => a.id)]);
      
      // Show notification for first achievement
      if (newlyUnlocked.length > 0) {
        setShowNotification(newlyUnlocked[0]);
        setTimeout(() => setShowNotification(null), 5000);
        
        if (onAchievementUnlock) {
          onAchievementUnlock(newlyUnlocked[0]);
        }
      }
    }
  }, [gameState, unlockedAchievements]);

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'common': return '#cccccc';
      case 'uncommon': return '#00ff88';
      case 'rare': return '#0088ff';
      case 'epic': return '#aa88ff';
      case 'legendary': return '#ffaa00';
      default: return '#ffffff';
    }
  };

  const getTotalPoints = () => {
    return achievementDefinitions
      .filter(a => unlockedAchievements.includes(a.id))
      .reduce((total, a) => total + a.points, 0);
  };

  return (
    <div className="achievement-system">
      {/* Achievement Notification */}
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#001122',
          border: '3px solid #ffaa00',
          borderRadius: '12px',
          padding: '20px',
          zIndex: 2000,
          maxWidth: '350px',
          boxShadow: '0 0 30px #ffaa0066',
          animation: 'achievementSlide 5s ease-in-out'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>
              {showNotification.icon}
            </div>
            <div style={{ 
              color: '#ffaa00', 
              fontSize: '18px', 
              fontWeight: 'bold',
              marginBottom: '4px',
              textShadow: '0 0 10px #ffaa00'
            }}>
              🏆 ACHIEVEMENT UNLOCKED!
            </div>
            <div style={{ 
              color: getRarityColor(showNotification.rarity),
              fontSize: '16px', 
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              {showNotification.name}
            </div>
            <div style={{ 
              color: '#cccccc', 
              fontSize: '14px',
              marginBottom: '8px'
            }}>
              {showNotification.description}
            </div>
            <div style={{ 
              color: '#ffaa00', 
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              +{showNotification.points} Achievement Points
            </div>
          </div>
        </div>
      )}

      {/* Achievement Panel */}
      <div style={{
        backgroundColor: '#001122',
        border: '2px solid #ffaa00',
        borderRadius: '8px',
        padding: '15px'
      }}>
        <div style={{ 
          color: '#ffaa00', 
          fontSize: '16px', 
          fontWeight: 'bold',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          🏆 ACHIEVEMENTS ({unlockedAchievements.length}/{achievementDefinitions.length})
        </div>
        
        <div style={{
          marginBottom: '15px',
          textAlign: 'center',
          color: '#ffffff'
        }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
            Total Points: {getTotalPoints()}
          </span>
        </div>

        <div style={{ 
          maxHeight: '200px', 
          overflowY: 'auto',
          scrollbarWidth: 'thin'
        }}>
          {achievementDefinitions.map(achievement => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            const progress = isUnlocked ? 100 : (achievement.condition(gameState) ? 100 : 0);
            
            return (
              <div
                key={achievement.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  marginBottom: '6px',
                  backgroundColor: isUnlocked ? '#002211' : '#111111',
                  border: `1px solid ${isUnlocked ? getRarityColor(achievement.rarity) : '#333333'}`,
                  borderRadius: '6px',
                  opacity: isUnlocked ? 1 : 0.6
                }}
              >
                <div style={{ 
                  fontSize: '20px', 
                  marginRight: '10px',
                  filter: isUnlocked ? 'none' : 'grayscale(100%)'
                }}>
                  {achievement.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    color: isUnlocked ? getRarityColor(achievement.rarity) : '#666666',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {achievement.name} {isUnlocked && '✓'}
                  </div>
                  <div style={{ 
                    color: '#cccccc', 
                    fontSize: '11px'
                  }}>
                    {achievement.description}
                  </div>
                  {isUnlocked && (
                    <div style={{ 
                      color: '#ffaa00', 
                      fontSize: '10px'
                    }}>
                      +{achievement.points} pts
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes achievementSlide {
          0% { transform: translateX(100%); opacity: 0; }
          10% { transform: translateX(0); opacity: 1; }
          90% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default AchievementSystem;
