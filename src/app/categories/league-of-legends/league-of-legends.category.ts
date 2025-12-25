import { Category } from '../category.interface';

export const LeagueOfLegendsCategory: Category = {
    id: 'league-of-legends',
    name: 'League of Legends',
    description: 'Welcome to Summoner\'s Rift',
    cssClass: 'theme-league-of-legends',
    preview: {
        primary: '#c89b3c',    // Gold
        secondary: '#0ac8b9',  // Teal/Cyan
        background: '#010a13', // Dark blue-black
        text: '#f0e6d2'        // Light gold
    },
    terminology: {
        impostor: 'Impostor',
        crewmate: 'Crewmate',
        impostorTeam: 'Enemy Team',
        crewmateTeam: 'Allied Team'
    },
    words: [
        'Teemo',
        'Yasuo',
        'Ahri',
        'Jinx',
        'Lux',
        'Thresh',
        'Lee Sin',
        'Zed',
        'Vayne',
        'Darius',
        'Garen',
        'Miss Fortune',
        'Ezreal',
        'Katarina',
        'Blitzcrank',
        'Morgana',
        'Leona',
        'Jhin',
        'Kayn',
        'Akali'
    ]
};
