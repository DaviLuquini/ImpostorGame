import { Player } from '@domain/models/player/player.model';
import { Role } from '@domain/models/role/role.model';
import { IGameConfig } from '@domain/models/game/game-config.interface';

export function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

export class AssignRolesUseCase {
    static execute(players: Player[], config: IGameConfig): void {
        const roles = this.generateRoles(players.length, config);
        const shuffledRoles = shuffle(roles);

        players.forEach((player, index) => {
            player.assignRole(shuffledRoles[index]);
        });
    }

    private static generateRoles(playerCount: number, config: IGameConfig): Role[] {
        const roles: Role[] = [];

        for (let i = 0; i < config.imposterCount; i++) {
            roles.push(Role.createImposter());
        }

        if (config.includeSpecialRoles && playerCount >= 5) {
            roles.push(Role.createDetective());
            if (playerCount >= 7) {
                roles.push(Role.createDoctor());
            }
        }

        const remainingCount = playerCount - roles.length;
        for (let i = 0; i < remainingCount; i++) {
            roles.push(Role.createCrewmate());
        }

        return roles;
    }
}
