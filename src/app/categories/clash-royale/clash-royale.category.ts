import { Category } from '../category.interface';

export const ClashRoyaleCategory: Category = {
    id: 'clash-royale',
    name: 'Clash Royale',
    description: 'Battle for the arena!',
    cssClass: 'theme-clash-royale',
    preview: {
        primary: '#f5a623',    // Orange/Gold
        secondary: '#4a90d9',  // Blue
        background: '#1a1a2e', // Dark purple-ish
        text: '#ffffff'
    },
    terminology: {
        impostor: 'Impostor',
        crewmate: 'Crewmate',
        impostorTeam: 'Enemy Clan',
        crewmateTeam: 'Royal Clan'
    },
    words: [
        'Hog Rider',
        'P.E.K.K.A',
        'Mega Knight',
        'Electro Wizard',
        'Balloon',
        'Golem',
        'Lava Hound',
        'Royal Giant',
        'Sparky',
        'Miner',
        'Musketeer',
        'Valkyrie',
        'Witch',
        'Wizard',
        'Baby Dragon',
        'Inferno Dragon',
        'Bandit',
        'Skeleton Army',
        'Goblin Barrel',
        'Fireball'
    ]
};
