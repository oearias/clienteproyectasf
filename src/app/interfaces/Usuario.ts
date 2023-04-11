export interface Usuario{
    id: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    nombre_completo: string;
    usuario:string;
    email: string;
    password: string;
    reset_token: string;
    created_at: Date;
    role_id: number;
    role_nombre: string;
    role: string;
}