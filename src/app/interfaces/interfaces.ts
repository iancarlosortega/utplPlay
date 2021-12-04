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