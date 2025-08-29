import React from 'react';

function StatusPanel({ gameState }) {
  const getOxygenStatus = () => {
    if (gameState.oxygenLevel > 60) return { color: '#00ff88', status: 'NOMINAL', icon: '✅' };
    if (gameState.oxygenLevel > 30) return { color: '#ffaa33', status: 'WARNING', icon: '⚠️' };
    return { color: '#ff3333', status: 'CRITICAL', icon: '🚨' };
  };

  const getPowerStatus = () => {
    if (gameState.powerLevel > 50) return { color: '#00ff88', status: 'STABLE', icon: '⚡' };
    if (gameState.powerLevel > 25) return { color: '#ffaa33', status: 'LOW', icon: '🔋' };
    return { color: '#ff3333', status: 'CRITICAL', icon: '⚠️' };
  };

  const oxygenStatus = getOxygenStatus();
  const powerStatus = getPowerStatus();

  return (
    <div className="status-panel">
      <h3 style={{ 
        color: '#ff6666', 
        textAlign: 'center', 
        marginBottom: '15px', 
        fontSize: '16px',
        borderBottom: '2px solid #ff6666',
        paddingBottom: '8px'
      }}>
        🚨 COMMANDER STATUS
      </h3>
      
      {/* Commander Info */}
      <div style={{
        backgroundColor: '#0a0a0a',
        border: '1px solid #ff6666',
        borderRadius: '6px',
        padding: '10px',
        marginBottom: '15px'
      }}>
        <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
          👨‍🚀 Commander Alex Chen
        </div>
        <div style={{ color: '#cccccc', fontSize: '12px' }}>
          USS Phoenix - Emergency Command
        </div>
      </div>

      {/* Mission Progress */}
      <div style={{
        backgroundColor: '#001122',
        border: '1px solid #0066cc',
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '15px'
      }}>
        <div style={{ color: '#0099ff', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
          📊 Mission Progress
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ color: '#cccccc', fontSize: '12px' }}>Level:</span>
          <span style={{ color: '#00ff88', fontSize: '12px', fontWeight: 'bold' }}>
            {gameState.level}
          </span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ color: '#cccccc', fontSize: '12px' }}>Experience:</span>
          <span style={{ color: '#ffaa33', fontSize: '12px' }}>
            {gameState.xp} XP
          </span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ color: '#cccccc', fontSize: '12px' }}>Credits:</span>
          <span style={{ color: '#ffff33', fontSize: '12px' }}>
            {gameState.credits} 💰
          </span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#cccccc', fontSize: '12px' }}>Compartments:</span>
          <span style={{ color: '#00ccff', fontSize: '12px' }}>
            {gameState.visitedRooms}/9
          </span>
        </div>
      </div>

      {/* Critical Systems */}
      <div style={{
        backgroundColor: '#110000',
        border: '2px solid #ff3333',
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '15px'
      }}>
        <div style={{ color: '#ff6666', fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>
          🚨 Critical Systems
        </div>
        
        {/* Oxygen Status */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '8px',
          padding: '6px',
          backgroundColor: '#000000',
          borderRadius: '4px',
          border: `1px solid ${oxygenStatus.color}33`
        }}>
          <span style={{ color: '#cccccc', fontSize: '12px' }}>Life Support:</span>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: oxygenStatus.color, fontSize: '12px', fontWeight: 'bold' }}>
              {oxygenStatus.icon} {gameState.oxygenLevel || 100}%
            </span>
            <br />
            <span style={{ color: oxygenStatus.color, fontSize: '10px' }}>
              {oxygenStatus.status}
            </span>
          </div>
        </div>
        
        {/* Power Status */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '6px',
          backgroundColor: '#000000',
          borderRadius: '4px',
          border: `1px solid ${powerStatus.color}33`
        }}>
          <span style={{ color: '#cccccc', fontSize: '12px' }}>Power Grid:</span>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: powerStatus.color, fontSize: '12px', fontWeight: 'bold' }}>
              {powerStatus.icon} {gameState.powerLevel || 25}%
            </span>
            <br />
            <span style={{ color: powerStatus.color, fontSize: '10px' }}>
              {powerStatus.status}
            </span>
          </div>
        </div>
      </div>

      {/* Equipment */}
      <div style={{
        backgroundColor: '#001100',
        border: '1px solid #00aa44',
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '15px'
      }}>
        <div style={{ color: '#00ff88', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
          🎒 Equipment Bay
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ color: '#cccccc', fontSize: '12px' }}>Items Carried:</span>
          <span style={{ color: '#00ff88', fontSize: '12px', fontWeight: 'bold' }}>
            {gameState.inventory?.length || 0}
          </span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#cccccc', fontSize: '12px' }}>Mission Status:</span>
          <span style={{ 
            color: gameState.gameCompleted ? '#00ff88' : '#ffaa33', 
            fontSize: '12px', 
            fontWeight: 'bold' 
          }}>
            {gameState.gameCompleted ? '✅ COMPLETE' : '🚨 ACTIVE'}
          </span>
        </div>
      </div>

      {/* Mission Objective */}
      <div style={{
        backgroundColor: '#000011',
        border: '1px solid #6666ff',
        borderRadius: '6px',
        padding: '12px'
      }}>
        <div style={{ color: '#6666ff', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
          🎯 PRIMARY OBJECTIVE
        </div>
        <div style={{ color: '#cccccc', fontSize: '11px', lineHeight: '1.4' }}>
          {gameState.gameCompleted ? 
            '✅ AI systems restored! Ship saved!' :
            'Navigate to AI Core. Restore ship systems before life support fails completely.'
          }
        </div>
      </div>
    </div>
  );
}

export default StatusPanel;
