import { Usuario } from "./Usuario";

export interface UsuarioResponse{
    totalPages: number,
    currentPage: number,
    usuariosJSON: Usuario[]
}