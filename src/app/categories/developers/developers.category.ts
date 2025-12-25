import { Category } from '../category.interface';

export const DevelopersCategory: Category = {
    id: 'developers',
    name: 'Developers',
    description: 'Debug the impostor!',
    cssClass: 'theme-developers',
    preview: {
        primary: '#61dafb',    // React blue
        secondary: '#4caf50',  // Green (success)
        background: '#1e1e1e', // VS Code dark
        text: '#d4d4d4'
    },
    terminology: {
        impostor: 'Impostor',
        crewmate: 'Crewmate',
        impostorTeam: 'Bugs',
        crewmateTeam: 'Dev Team'
    },
    words: [
        'JavaScript',
        'TypeScript',
        'Python',
        'React',
        'Angular',
        'Vue',
        'Node.js',
        'Docker',
        'Kubernetes',
        'Git',
        'API',
        'Database',
        'Frontend',
        'Backend',
        'DevOps',
        'Agile',
        'Sprint',
        'Code Review',
        'Pull Request',
        'Deploy'
    ]
};
