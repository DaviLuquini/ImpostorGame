import { PlayerStatus } from './player-status.enum';

export interface IPlayer {
    id: string;
    name: string;
    status: PlayerStatus;
    avatarColor: string;
}
