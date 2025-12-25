import { GameState } from './game.state';
import { GameSession } from '@domain/models/game/game-session.model';
import { GamePhase } from '@domain/models/game/game-phase.enum';
import { Player } from '@domain/models/player/player.model';
import { Vote } from '@domain/models/voting/vote.model';
import { IGameConfig } from '@domain/models/game/game-config.interface';
import { AssignRolesUseCase } from '@domain/use-cases/role/assign-roles.use-case';

export const GameActions = {
    createGame(config: Partial<IGameConfig>): void {
        const session = new GameSession(config);
        GameState.session.set(session);
        GameState.currentPhase.set(GamePhase.Lobby);
        GameState.votes.set([]);
        GameState.roundNumber.set(1);
        GameState.currentPlayerIndex.set(0);
    },

    addPlayer(name: string): void {
        const player = new Player(name);
        GameState.players.update(players => [...players, player]);
        const session = GameState.session();
        if (session) {
            session.addPlayer(player);
        }
    },

    removePlayer(playerId: string): void {
        GameState.players.update(players => players.filter(p => p.id !== playerId));
        const session = GameState.session();
        if (session) {
            session.removePlayer(playerId);
        }
    },

    setPhase(phase: GamePhase): void {
        GameState.currentPhase.set(phase);
        const session = GameState.session();
        if (session) {
            session.setPhase(phase);
        }
    },

    startGame(words?: { crewmateWord: string; impostorWord: string }): void {
        const session = GameState.session();
        const players = GameState.players();

        if (session && players.length >= 3) {
            AssignRolesUseCase.execute(players, session.config);
            GameState.players.set([...players]);

            // Set secret words if provided
            if (words) {
                GameState.secretWord.set(words.crewmateWord);
                GameState.impostorWord.set(words.impostorWord);
            }

            GameActions.setPhase(GamePhase.RoleReveal);
            GameState.currentPlayerIndex.set(0);
        }
    },

    markCurrentPlayerViewedRole(): void {
        const players = GameState.players();
        const index = GameState.currentPlayerIndex();

        if (players[index]) {
            players[index].markRoleViewed();
            GameState.players.set([...players]);
        }
    },

    nextPlayer(): boolean {
        const players = GameState.players();
        const currentIndex = GameState.currentPlayerIndex();

        if (currentIndex + 1 >= players.length) {
            GameState.currentPlayerIndex.set(0);
            return false;
        }

        GameState.currentPlayerIndex.update(i => i + 1);
        return true;
    },

    castVote(voterId: string, targetId: string | null): void {
        const vote = new Vote(voterId, targetId);
        GameState.votes.update(votes => [...votes, vote]);

        const players = GameState.players();
        const voter = players.find(p => p.id === voterId);
        if (voter) {
            voter.hasVoted = true;
            GameState.players.set([...players]);
        }
    },

    eliminatePlayer(playerId: string): void {
        const players = GameState.players();
        const player = players.find(p => p.id === playerId);
        if (player) {
            player.eliminate();
            GameState.players.set([...players]);
        }
    },

    startNewRound(): void {
        GameState.roundNumber.update(r => r + 1);
        GameState.votes.set([]);
        const players = GameState.players();
        players.forEach(p => p.resetForNewRound());
        GameState.players.set([...players]);
        GameState.currentPlayerIndex.set(0);
    },

    setTimer(seconds: number): void {
        GameState.timerSeconds.set(seconds);
    },

    startTimer(): void {
        GameState.isTimerRunning.set(true);
    },

    stopTimer(): void {
        GameState.isTimerRunning.set(false);
    },

    tickTimer(): void {
        GameState.timerSeconds.update(t => Math.max(0, t - 1));
    },

    resetGame(): void {
        GameState.session.set(null);
        GameState.currentPhase.set(GamePhase.Setup);
        GameState.players.set([]);
        GameState.votes.set([]);
        GameState.roundNumber.set(1);
        GameState.currentPlayerIndex.set(0);
        GameState.timerSeconds.set(0);
        GameState.isTimerRunning.set(false);
        GameState.secretWord.set('');
        GameState.impostorWord.set('');
    }
};
