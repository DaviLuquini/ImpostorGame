import { signal } from '@angular/core';
import { GameSession } from '@domain/models/game/game-session.model';
import { GamePhase } from '@domain/models/game/game-phase.enum';
import { Player } from '@domain/models/player/player.model';
import { Vote } from '@domain/models/voting/vote.model';

export const GameState = {
    session: signal<GameSession | null>(null),
    currentPhase: signal<GamePhase>(GamePhase.Setup),
    players: signal<Player[]>([]),
    currentPlayerIndex: signal<number>(0),
    votes: signal<Vote[]>([]),
    roundNumber: signal<number>(1),
    timerSeconds: signal<number>(0),
    isTimerRunning: signal<boolean>(false),
    // Secret words for the current game
    secretWord: signal<string>(''),      // The word crewmates know
    impostorWord: signal<string>('')      // The fake word impostor sees
};
