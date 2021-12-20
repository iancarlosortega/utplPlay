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
    careers?: Career[];
}

export interface Video {
    id: string;
    title: string;
    teacher: string;
    course: Course;
    views: number;
    publication_date: Date | null;
    url: string;
    file?: string;
    filename?: string;
}