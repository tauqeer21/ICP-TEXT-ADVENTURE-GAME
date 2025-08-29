import React, { useState, useEffect, useRef } from 'react';

function VoiceInput({ onCommand, isEnabled = true }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setTranscript('');
        };

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            } else {
              interimTranscript += result[0].transcript;
            }
          }

          setTranscript(finalTranscript || interimTranscript);

          if (finalTranscript) {
            const command = processVoiceCommand(finalTranscript.trim());
            if (command) {
              onCommand(command);
            }
            setIsListening(false);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onCommand]);

  const processVoiceCommand = (transcript) => {
    const text = transcript.toLowerCase();
    
    // Command mappings
    const commandMappings = {
      // Movement
      'go north': 'go north',
      'move north': 'go north',
      'head north': 'go north',
      'go south': 'go south',
      'move south': 'go south',
      'head south': 'go south',
      'go east': 'go east',
      'move east': 'go east',
      'head east': 'go east',
      'go west': 'go west',
      'move west': 'go west',
      'head west': 'go west',
      
      // Observation
      'look around': 'look',
      'examine room': 'look',
      'scan area': 'look',
      'what do i see': 'look',
      
      // Items
      'check inventory': 'inventory',
      'show items': 'inventory',
      'what do i have': 'inventory',
      'take access card': 'take access_card',
      'take keycard': 'take keycard',
      'pick up keycard': 'take keycard',
      'grab keycard': 'take keycard',
      'use scanner': 'use scanner',
      'activate scanner': 'use scanner',
      'scan with scanner': 'use scanner',
      
      // Information
      'show status': 'status',
      'check status': 'status',
      'system status': 'status',
      'show help': 'help',
      'what can i do': 'help',
      'list commands': 'help',
      'open guide': 'guide',
      'show manual': 'guide',
      'help me': 'help'
    };

    // Direct mapping
    if (commandMappings[text]) {
      return commandMappings[text];
    }

    // Pattern matching for more flexible commands
    if (text.includes('go to') || text.includes('move to')) {
      if (text.includes('bridge')) return 'go north';
      if (text.includes('corridor')) return 'go south';
      if (text.includes('engineering')) return 'go west';
      if (text.includes('armory')) return 'go north';
      if (text.includes('laboratory')) return 'go east';
    }

    if (text.includes('take') || text.includes('pick up') || text.includes('grab')) {
      if (text.includes('card') || text.includes('keycard')) return 'take keycard';
      if (text.includes('rifle') || text.includes('weapon')) return 'take rifle';
      if (text.includes('data') || text.includes('research')) return 'take data';
      if (text.includes('scanner')) return 'take scanner';
      if (text.includes('tools') || text.includes('kit')) return 'take tools';
    }

    if (text.includes('use') || text.includes('activate')) {
      if (text.includes('scanner')) return 'use scanner';
      if (text.includes('keycard') || text.includes('card')) return 'use keycard';
      if (text.includes('escape') || text.includes('pod')) return 'use escape_pod';
    }

    // Return original text as fallback
    return transcript;
  };

  const startListening = () => {
    if (recognitionRef.current && isSupported && isEnabled) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported || !isEnabled) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      {/* Voice Input Button */}
      <button
        onClick={isListening ? stopListening : startListening}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: isListening ? '#ff3333' : '#003366',
          border: `3px solid ${isListening ? '#ff6666' : '#0066ff'}`,
          color: isListening ? '#ffffff' : '#0066ff',
          fontSize: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isListening ? '0 0 20px #ff333366' : '0 0 20px #0066ff66',
          animation: isListening ? 'pulse 1s infinite' : 'none',
          transition: 'all 0.3s ease'
        }}
        title={isListening ? 'Click to stop listening' : 'Click to start voice input'}
      >
        {isListening ? '🔴' : '🎤'}
      </button>

      {/* Voice Feedback */}
      {isListening && (
        <div style={{
          position: 'absolute',
          bottom: '70px',
          right: '0px',
          backgroundColor: '#001122',
          border: '2px solid #00ffff',
          borderRadius: '8px',
          padding: '10px',
          minWidth: '200px',
          maxWidth: '300px'
        }}>
          <div style={{ 
            color: '#00ffff', 
            fontSize: '12px', 
            fontWeight: 'bold',
            marginBottom: '4px'
          }}>
            🎤 Voice Input Active
          </div>
          <div style={{ 
            color: '#ffffff', 
            fontSize: '14px',
            minHeight: '20px'
          }}>
            {transcript || 'Listening...'}
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: '#333333',
            borderRadius: '2px',
            marginTop: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#00ffff',
              animation: 'voiceWave 1.5s ease-in-out infinite'
            }}></div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes voiceWave {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export default VoiceInput;
