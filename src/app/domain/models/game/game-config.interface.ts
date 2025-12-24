import { GameMode } from './game-mode.enum';

export interface IGameConfig {
    mode: GameMode;
    imposterCount: number;
    discussionTimeSeconds: number;
    votingTimeSeconds: number;
    includeSpecialRoles: boolean;
}

export const DEFAULT_GAME_CONFIG: IGameConfig = {
    mode: GameMode.Classic,
    imposterCount: 1,
    discussionTimeSeconds: 120,
    votingTimeSeconds: 60,
    includeSpecialRoles: false
};

export function getConfigForMode(mode: GameMode): Partial<IGameConfig> {
    switch (mode) {
        case GameMode.SpeedRound:
            return { discussionTimeSeconds: 60, votingTimeSeconds: 30 };
        case GameMode.Extended:
            return { discussionTimeSeconds: 180, votingTimeSeconds: 90 };
        default:
            return {};
    }
}
