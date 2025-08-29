import React from 'react';
import { motion } from 'framer-motion';

const AchievementPopup = ({ achievement, onClose }) => {
  if (!achievement) return null;

  // Get achievement styling based on rarity
  const getRarityStyle = (rarity) => {
    const styles = {
      'common': {
        border: 'border-gray-500',
        bg: 'bg-gray-500/20',
        glow: 'shadow-gray-500/50',
        text: 'text-gray-300'
      },
      'uncommon': {
        border: 'border-green-500',
        bg: 'bg-green-500/20',
        glow: 'shadow-green-500/50',
        text: 'text-green-300'
      },
      'rare': {
        border: 'border-blue-500',
        bg: 'bg-blue-500/20',
        glow: 'shadow-blue-500/50',
        text: 'text-blue-300'
      },
      'epic': {
        border: 'border-purple-500',
        bg: 'bg-purple-500/20',
        glow: 'shadow-purple-500/50',
        text: 'text-purple-300'
      },
      'legendary': {
        border: 'border-yellow-500',
        bg: 'bg-yellow-500/20',
        glow: 'shadow-yellow-500/50',
        text: 'text-yellow-300'
      }
    };
    return styles[rarity] || styles.common;
  };

  const style = getRarityStyle(achievement.rarity);

  // Get achievement icon based on type
  const getAchievementIcon = (achievementId) => {
    const icons = {
      'explorer': '🌍',
      'collector': '📦',
      'first_contact': '👋',
      'crafter': '🔧',
      'trader': '💰',
      'efficient': '⚡',
      'rich': '💎',
      'victory': '🚀'
    };
    return icons[achievementId] || '🏆';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, y: 100, opacity: 0 }}
        animate={{ 
          scale: 1, 
          y: 0, 
          opacity: 1,
          rotate: [0, -2, 2, -1, 1, 0]
        }}
        exit={{ 
          scale: 0.8, 
          y: -50, 
          opacity: 0 
        }}
        transition={{ 
          type: "spring", 
          damping: 15, 
          stiffness: 300,
          rotate: { duration: 0.6 }
        }}
        className={`
          max-w-md w-full mx-auto p-6 rounded-xl border-2 backdrop-blur-md
          ${style.border} ${style.bg} shadow-2xl ${style.glow}
          relative overflow-hidden
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated background effects */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`w-full h-full rounded-xl ${style.bg.replace('/20', '/30')}`}
          />
        </div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-current opacity-40"
            initial={{ 
              x: Math.random() * 300, 
              y: Math.random() * 200,
              opacity: 0
            }}
            animate={{ 
              y: [null, -20, -40],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Header */}
        <div className="text-center mb-6 relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", damping: 10 }}
            className="text-6xl mb-3"
          >
            {getAchievementIcon(achievement.id)}
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-white mb-2"
          >
            ACHIEVEMENT UNLOCKED!
          </motion.h2>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`h-1 w-24 mx-auto rounded-full ${style.bg.replace('/20', '')}`}
          />
        </div>

        {/* Achievement details */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-3 relative z-10"
        >
          <h3 className={`text-xl font-bold ${style.text}`}>
            {achievement.name}
          </h3>
          
          <p className="text-gray-300 text-sm leading-relaxed">
            {achievement.description}
          </p>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-600">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Rarity:</span>
              <motion.span 
                className={`text-sm font-bold uppercase tracking-wide ${style.text}`}
                animate={{ 
                  textShadow: [
                    "0 0 0px currentColor",
                    "0 0 10px currentColor",
                    "0 0 0px currentColor"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {achievement.rarity}
              </motion.span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">+50 XP</span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="text-green-400 font-bold"
              >
                💎
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* NFT Badge indicator */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 text-center relative z-10"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span className="text-2xl">🎨</span>
              <span className="text-purple-300 font-mono">
                NFT Badge Minted!
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Check your wallet for the collectible badge
            </div>
          </div>
        </motion.div>

        {/* Close button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-600/50 hover:bg-gray-500/50 text-white flex items-center justify-center text-xl font-bold transition-colors z-20"
        >
          ×
        </motion.button>

        {/* Auto-close progress bar */}
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-bl-xl"
        />

        {/* Confetti effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-current opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: [
                  '#00FFFF', '#FF00FF', '#FFFF00', '#00FF00', '#FF6B35'
                ][Math.floor(Math.random() * 5)]
              }}
              initial={{ 
                y: -10,
                rotate: 0,
                opacity: 1
              }}
              animate={{ 
                y: 400,
                rotate: 360,
                opacity: 0
              }}
              transition={{ 
                duration: 3,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AchievementPopup;
