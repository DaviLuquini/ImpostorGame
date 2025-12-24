import { Player } from '../player/player.model';
import { GamePhase } from './game-phase.enum';
import { IGameConfig, DEFAULT_GAME_CONFIG } from './game-config.interface';
import { Team } from '../role/team.enum';

export class GameSession {
    id: string;
    config: IGameConfig;
    players: Player[] = [];
    currentPhase: GamePhase = GamePhase.Setup;
    currentRound = 1;
    currentPlayerIndex = 0;
    createdAt: Date;
    winner: Team | null = null;

    constructor(config: Partial<IGameConfig> = {}) {
        this.id = crypto.randomUUID();
        this.config = { ...DEFAULT_GAME_CONFIG, ...config };
        this.createdAt = new Date();
    }

    addPlayer(player: Player): void {
        this.players.push(player);
    }

    removePlayer(playerId: string): void {
        this.players = this.players.filter(p => p.id !== playerId);
    }

    setPhase(phase: GamePhase): void {
        this.currentPhase = phase;
    }

    getCurrentPlayer(): Player | null {
        return this.players[this.currentPlayerIndex] ?? null;
    }

    nextPlayer(): Player | null {
        this.currentPlayerIndex++;
        if (this.currentPlayerIndex >= this.players.length) {
            this.currentPlayerIndex = 0;
            return null;
        }
        return this.getCurrentPlayer();
    }

    resetPlayerIndex(): void {
        this.currentPlayerIndex = 0;
    }

    getAlivePlayers(): Player[] {
        return this.players.filter(p => p.isAlive());
    }

    getImposters(): Player[] {
        return this.players.filter(p => p.role?.isImposter());
    }

    getCrewmates(): Player[] {
        return this.players.filter(p => p.role?.isCrewmate());
    }

    getAllPlayersViewedRoles(): boolean {
        return this.players.every(p => p.hasViewedRole);
    }

    checkWinCondition(): Team | null {
        const aliveImposters = this.getAlivePlayers().filter(p => p.role?.isImposter()).length;
        const aliveCrewmates = this.getAlivePlayers().filter(p => p.role?.isCrewmate()).length;

        if (aliveImposters === 0) {
            return Team.Crewmates;
        }

        if (aliveImposters >= aliveCrewmates) {
            return Team.Imposters;
        }

        return null;
    }

    endGame(winner: Team): void {
        this.winner = winner;
        this.currentPhase = GamePhase.Results;
    }
}
