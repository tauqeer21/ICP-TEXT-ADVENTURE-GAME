import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';

// Canister IDs - using your deployed backend
const CANISTER_IDS = {
  backend: 'uxrrr-q7777-77774-qaaaq-cai', // Your actual backend canister ID
  internet_identity: 'rdmx6-jaaaa-aaaaa-aaadq-cai'
};

// Backend canister interface definition (IDL)
const backend_idl = ({ IDL }) => {
  // Define types
  const GameState = IDL.Record({
    'location': IDL.Text,
    'inventory': IDL.Vec(IDL.Text),
    'level': IDL.Nat,
    'xp': IDL.Nat,
    'credits': IDL.Nat,
    'commandCount': IDL.Nat,
    'visitedRooms': IDL.Nat,
    'achievements': IDL.Vec(IDL.Text),
    'gameCompleted': IDL.Bool,
  });

  const GameResponse = IDL.Record({
    'message': IDL.Text,
    'gameState': GameState,
    'newAchievements': IDL.Vec(IDL.Text),
    'nftMinted': IDL.Opt(IDL.Text),
  });

  // Service definition
  return IDL.Service({
    'processCommand': IDL.Func([IDL.Text], [GameResponse], []),
    'getGameState': IDL.Func([IDL.Principal], [GameState], ['query']),
    'getCanisterInfo': IDL.Func([], [IDL.Record({
      'version': IDL.Text,
      'totalPlayers': IDL.Nat,
      'totalCommands': IDL.Nat,
    })], ['query']),
  });
};

// Create HTTP agent
export const createAgent = async (identity = null) => {
  // Use localhost for local development
  const host = 'http://localhost:4943';

  const agent = new HttpAgent({
    host,
    identity
  });

  // Fetch root key for local development
  try {
    await agent.fetchRootKey();
  } catch (error) {
    console.warn('Unable to fetch root key:', error);
  }

  return agent;
};

// Create actor with authentication
export const createActor = async (canisterId = CANISTER_IDS.backend) => {
  try {
    // Get authenticated identity
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    
    if (!identity) {
      throw new Error('No authenticated identity found');
    }

    // Create agent with identity
    const agent = await createAgent(identity);
    
    // Create and return actor
    const actor = Actor.createActor(backend_idl, {
      agent,
      canisterId,
    });

    // Add the caller principal to the actor for convenience
    actor.caller = identity.getPrincipal();
    
    return actor;
  } catch (error) {
    console.error('Failed to create authenticated actor:', error);
    throw error;
  }
};

// Create actor without authentication (for public queries)
export const createPublicActor = async (canisterId = CANISTER_IDS.backend) => {
  try {
    const agent = await createAgent();
    
    return Actor.createActor(backend_idl, {
      agent,
      canisterId,
    });
  } catch (error) {
    console.error('Failed to create public actor:', error);
    throw error;
  }
};

export default {
  createAgent,
  createActor,
  createPublicActor,
  CANISTER_IDS
};
