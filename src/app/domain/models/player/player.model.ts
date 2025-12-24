import { Role } from '../role/role.model';
import { PlayerStatus } from './player-status.enum';
import { IPlayer } from './player.interface';

const AVATAR_COLORS = [
    '#E74C3C', '#3498DB', '#2ECC71', '#9B59B6', '#F39C12',
    '#1ABC9C', '#E91E63', '#00BCD4', '#FF5722', '#795548'
];

export class Player implements IPlayer {
    id: string;
    name: string;
    status: PlayerStatus;
    avatarColor: string;
    private _role: Role | null = null;
    hasViewedRole = false;
    hasVoted = false;

    constructor(name: string, id?: string) {
        this.id = id ?? crypto.randomUUID();
        this.name = name;
        this.status = PlayerStatus.Waiting;
        this.avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    }

    get role(): Role | null {
        return this._role;
    }

    assignRole(role: Role): void {
        this._role = role;
        this.status = PlayerStatus.Alive;
    }

    markRoleViewed(): void {
        this.hasViewedRole = true;
    }

    isAlive(): boolean {
        return this.status === PlayerStatus.Alive;
    }

    eliminate(): void {
        this.status = PlayerStatus.Eliminated;
    }

    resetForNewRound(): void {
        this.hasVoted = false;
    }

    toJSON(): IPlayer {
        return {
            id: this.id,
            name: this.name,
            status: this.status,
            avatarColor: this.avatarColor
        };
    }
}
