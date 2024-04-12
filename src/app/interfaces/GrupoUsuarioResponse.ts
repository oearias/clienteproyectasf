import { GrupoUsuario } from "./GrupoUsuario";


export interface GrupoUsuarioResponse{
    totalPages: number,
    currentPage: number,
    gruposUsuariosJSON: GrupoUsuario[]
}