/**
 * Category defines both visual theme AND game terminology
 */
export interface Category {
    id: string;
    name: string;
    description: string;
    cssClass: string;
    preview: CategoryPreview;
    terminology: CategoryTerminology;
    words: string[]; // Secret words for this category
}

export interface CategoryPreview {
    primary: string;
    secondary: string;
    background: string;
    text: string;
}

/**
 * Game terminology that changes based on category
 */
export interface CategoryTerminology {
    impostor: string;      // What the impostor role is called
    crewmate: string;      // What the crew/good team is called
    impostorTeam: string;  // Team name for impostors
    crewmateTeam: string;  // Team name for crew
}
