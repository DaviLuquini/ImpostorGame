import { RoleType } from './role-type.enum';
import { Team } from './team.enum';

export interface IRoleAbility {
    name: string;
    description: string;
}

export class Role {
    constructor(
        public type: RoleType,
        public team: Team,
        public name: string,
        public description: string,
        public abilities: IRoleAbility[] = []
    ) { }

    isImposter(): boolean {
        return this.team === Team.Imposters;
    }

    isCrewmate(): boolean {
        return this.team === Team.Crewmates;
    }

    static createImposter(): Role {
        return new Role(
            RoleType.Imposter,
            Team.Imposters,
            'Imposter',
            'Blend in with the crew and eliminate them without getting caught.',
            [{ name: 'Deception', description: 'Lie about your identity' }]
        );
    }

    static createCrewmate(): Role {
        return new Role(
            RoleType.Crewmate,
            Team.Crewmates,
            'Crewmate',
            'Find and vote out the imposters before they eliminate everyone.',
            [{ name: 'Vote', description: 'Vote to eliminate suspects' }]
        );
    }

    static createDetective(): Role {
        return new Role(
            RoleType.Detective,
            Team.Crewmates,
            'Detective',
            'Use your investigative skills to identify the imposters.',
            [{ name: 'Investigate', description: 'Once per game, check if a player is an imposter' }]
        );
    }

    static createDoctor(): Role {
        return new Role(
            RoleType.Doctor,
            Team.Crewmates,
            'Doctor',
            'Protect your fellow crewmates from elimination.',
            [{ name: 'Protect', description: 'Once per game, save a player from elimination' }]
        );
    }

    static createJester(): Role {
        return new Role(
            RoleType.Jester,
            Team.Crewmates,
            'Jester',
            'Get yourself voted out to win the game!',
            [{ name: 'Fool', description: 'Win by being eliminated in voting' }]
        );
    }
}
