import React from 'react';
import { motion } from 'framer-motion';

const NFTNotification = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="fixed top-4 right-4 z-50 max-w-sm"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-md border-2 border-purple-500/50 rounded-xl p-4 shadow-2xl shadow-purple-500/25"
      >
        {/* Header with diamond icon */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="text-2xl"
            >
              💎
            </motion.div>
            <h3 className="text-lg font-bold text-white">
              NFT Minted!
            </h3>
          </div>
          
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-6 h-6 rounded-full bg-gray-600/50 hover:bg-gray-500/50 text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ×
          </motion.button>
        </div>

        {/* NFT Preview */}
        <div className="bg-black/30 rounded-lg p-3 mb-3 border border-purple-400/30">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
              🏆
            </div>
            
            <div className="flex-1">
              <h4 className="text-purple-200 font-bold text-sm">
                {notification.name || 'Achievement Badge'}
              </h4>
              <p className="text-gray-300 text-xs mt-1 leading-relaxed">
                {notification.description || 'Congratulations on your achievement!'}
              </p>
            </div>
          </div>
        </div>

        {/* NFT Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Token ID:</span>
            <span className="text-purple-300 font-mono">
              #{notification.tokenId || 'XXXX'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Rarity:</span>
            <motion.span 
              animate={{
                textShadow: [
                  "0 0 0px #a855f7",
                  "0 0 10px #a855f7",
                  "0 0 0px #a855f7"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-purple-300 font-bold capitalize"
            >
              {notification.rarity || 'Rare'}
            </motion.span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Standard:</span>
            <span className="text-purple-300 font-mono text-xs">
              ICP-NFT-1.0
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-mono py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-1"
          >
            <span>👛</span>
            <span>VIEW IN WALLET</span>
          </motion.button>
        </div>

        {/* Blockchain confirmation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-3 flex items-center justify-center space-x-2 text-xs text-gray-400"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 bg-green-500 rounded-full"
          />
          <span>Confirmed on Internet Computer</span>
        </motion.div>

        {/* Auto-close progress bar */}
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 7, ease: "linear" }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-bl-xl"
        />

        {/* Sparkle effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-lg"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NFTNotification;
