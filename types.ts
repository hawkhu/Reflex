export enum GameState {
  IDLE = 'IDLE',         // Initial state
  WAITING = 'WAITING',   // Red screen, waiting for green
  READY = 'READY',       // Green screen, user should click
  RESULT = 'RESULT',     // Show time
  TOO_SOON = 'TOO_SOON', // User clicked too early
}

export interface Attempt {
  id: number;
  time: number; // milliseconds
  timestamp: number;
}
