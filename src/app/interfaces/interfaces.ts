export interface User {
    uid: string;
    name?: string;
    last_name?: string;
    email: string;
    password?: string;
    photo_url?: string;
    photo_filename?: string;
    file?: string;
    education_level?: string;
    institution?: string;
    country?: string;
    city?: string;
    genre?: string;
    identification_card?: string;
    search_history?: Records[];
    claims?: Claim;
}

export interface Records {
    id: string;
    name: string;
}

export interface Claim {
    admin?: boolean;
    editor?: boolean;
}

export interface Area {
    name: string,
    value: string,
}

export interface Career {
    id: string;
    name: string;
    duration: number;
    area: Area;
    views: number;
    file?: string;
    photo_url?: string;
    photo_filename?: string;
}

export interface Course {
    id: string;
    name: string;
    description: string;
    keywords?: string[];
    purposes?: string[];
    careers?: Career[];
    views: number;
}

export interface Video {
    id: string;
    title: string;
    teacher: string;
    course: Course;
    views: number;
    publication_date: any | null;
    url: string;
    file?: string;
    filename?: string;
}