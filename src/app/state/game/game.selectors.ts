import { computed } from '@angular/core';
import { GameState } from './game.state';
import { GamePhase } from '@domain/models/game/game-phase.enum';
import { PlayerStatus } from '@domain/models/player/player-status.enum';

export const GameSelectors = {
    isGameActive: computed(() => {
        const session = GameState.session();
        const phase = GameState.currentPhase();
        return session !== null && phase !== GamePhase.Setup;
    }),

    currentPhase: computed(() => GameState.currentPhase()),

    session: computed(() => GameState.session()),

    allPlayers: computed(() => GameState.players()),

    alivePlayers: computed(() =>
        GameState.players().filter(p => p.status === PlayerStatus.Alive)
    ),

    eliminatedPlayers: computed(() =>
        GameState.players().filter(p => p.status === PlayerStatus.Eliminated)
    ),

    currentPlayer: computed(() => {
        const players = GameState.players();
        const index = GameState.currentPlayerIndex();
        return players[index] ?? null;
    }),

    currentPlayerIndex: computed(() => GameState.currentPlayerIndex()),

    playerCount: computed(() => GameState.players().length),

    allPlayersViewedRoles: computed(() =>
        GameState.players().every(p => p.hasViewedRole)
    ),

    allPlayersVoted: computed(() =>
        GameState.players()
            .filter(p => p.status === PlayerStatus.Alive)
            .every(p => p.hasVoted)
    ),

    votes: computed(() => GameState.votes()),

    voteCount: computed(() => GameState.votes().length),

    roundNumber: computed(() => GameState.roundNumber()),

    timerSeconds: computed(() => GameState.timerSeconds()),

    isTimerRunning: computed(() => GameState.isTimerRunning()),

    timerFormatted: computed(() => {
        const seconds = GameState.timerSeconds();
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }),

    imposters: computed(() =>
        GameState.players().filter(p => p.role?.isImposter() ?? false)
    ),

    crewmates: computed(() =>
        GameState.players().filter(p => p.role?.isCrewmate() ?? false)
    ),

    aliveImposters: computed(() =>
        GameState.players().filter(p => p.status === PlayerStatus.Alive && (p.role?.isImposter() ?? false))
    ),

    aliveCrewmates: computed(() =>
        GameState.players().filter(p => p.status === PlayerStatus.Alive && (p.role?.isCrewmate() ?? false))
    ),

    winner: computed(() => GameState.session()?.winner ?? null),

    // Secret words for the current game
    secretWord: computed(() => GameState.secretWord()),
    impostorWord: computed(() => GameState.impostorWord())
};
