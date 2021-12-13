export interface User {
    uid: string;
    nombres?: string;
    apellidos?: string;
    email: string;
    password?: string;
    //TODO: Agregar foto de perfil
    // foto_perfil?: string;
    nivel_educacion?: string;
    establecimiento?: string;
    pais?: string;
    ciudad?: string;
    genero?: string;
    cedula?: string;
}

export interface Carrera {
    id: string;
    nombre: string;
    num_ciclos: number;
    //TODO: Agregar foto de carrera
    // img: string;
}

export interface Materia {
    id: string;
    nombre: string;
    carreras?: Carrera[];
    //TODO: Agregar foto de materia
    // img: string;
}

export interface Video {
    id: string;
    titulo: string;
    tutor: string;
    materia: Materia;
    visualizaciones: number;
    fecha_publicacion: Date | null;
    url: string;
    file?: string;
    filename?: string;
}