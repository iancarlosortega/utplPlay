export interface User {
    uid: string;
    name?: string;
    last_name?: string;
    email: string;
    password?: string;
    photo_url?: string;
    education_level?: string;
    institution?: string;
    country?: string;
    city?: string;
    genre?: string;
    identification_card?: string;
}

export interface Area {
    name: string,
    value: string
}

export interface Career {
    id: string;
    name: string;
    duration: number;
    area: Area;
    views: number;
    //TODO: Agregar foto de carrera
    // img: string;
}

export interface Course {
    id: string;
    name: string;
    careers?: Career[];
    //TODO: Agregar foto de materia
    // img: string;
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