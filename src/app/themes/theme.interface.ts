export interface Theme {
    id: string;
    name: string;
    description: string;
    cssClass: string;
    preview: ThemePreview;
}

export interface ThemePreview {
    primary: string;
    secondary: string;
    background: string;
    text: string;
}
