import { useState, useEffect, useCallback } from 'react';
import { createActor } from '../utils/agent';

export const useGameState = (isAuthenticated) => {
  const [gameState, setGameState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [nftNotification, setNftNotification] = useState(null);
  const [actor, setActor] = useState(null);

  // Initialize actor when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const initActor = async () => {
        try {
          const gameActor = await createActor();
          setActor(gameActor);
          
          // Load initial game state
          const initialState = await gameActor.getGameState(gameActor.caller);
          setGameState(initialState);
        } catch (error) {
          console.error('Failed to initialize game actor:', error);
        }
      };

      initActor();
    } else {
      setActor(null);
      setGameState(null);
    }
  }, [isAuthenticated]);

  // Send command to backend
  const sendCommand = useCallback(async (command) => {
    if (!actor || isLoading) return;

    setIsLoading(true);
    
    try {
      console.log('Sending command:', command);
      const response = await actor.processCommand(command);
      
      console.log('Game response:', response);
      setLastResponse(response);
      setGameState(response.gameState);
      
      // Handle new achievements
      if (response.newAchievements && response.newAchievements.length > 0) {
        setAchievements(response.newAchievements);
      }
      
      // Handle NFT notifications
      if (response.nftMinted && response.nftMinted.Success) {
        setNftNotification({
          name: `Achievement NFT #${response.nftMinted.Success.tokenId}`,
          description: 'Congratulations! Your achievement has been minted as an NFT.',
          tokenId: response.nftMinted.Success.tokenId,
          rarity: 'rare' // This would come from the response in a real implementation
        });
      }
      
    } catch (error) {
      console.error('Command failed:', error);
      setLastResponse({
        message: `❌ Error: ${error.message || 'Command failed. Please try again.'}`,
        gameState: gameState
      });
    } finally {
      setIsLoading(false);
    }
  }, [actor, isLoading, gameState]);

  // Get leaderboard
  const getLeaderboard = useCallback(async () => {
    if (!actor) return [];
    
    try {
      return await actor.getLeaderboard();
    } catch (error) {
      console.error('Failed to get leaderboard:', error);
      return [];
    }
  }, [actor]);

  // Get room info
  const getRoomInfo = useCallback(async (roomId) => {
    if (!actor) return null;
    
    try {
      return await actor.getRoomInfo(roomId);
    } catch (error) {
      console.error('Failed to get room info:', error);
      return null;
    }
  }, [actor]);

  // Get item info
  const getItemInfo = useCallback(async (itemId) => {
    if (!actor) return null;
    
    try {
      return await actor.getItemInfo(itemId);
    } catch (error) {
      console.error('Failed to get item info:', error);
      return null;
    }
  }, [actor]);

  // Clear achievements (after showing popup)
  const clearAchievements = useCallback(() => {
    setAchievements([]);
  }, []);

  // Clear NFT notification
  const clearNftNotification = useCallback(() => {
    setNftNotification(null);
  }, []);

  return {
    gameState,
    isLoading,
    lastResponse,
    achievements,
    nftNotification,
    sendCommand,
    getLeaderboard,
    getRoomInfo,
    getItemInfo,
    clearAchievements,
    clearNftNotification
  };
};
