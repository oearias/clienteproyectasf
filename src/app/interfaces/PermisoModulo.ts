import { GrupoUsuario } from "./GrupoUsuario";
import { Modulo } from "./Modulo";

export interface PermisoModulo {
    id: number;
    modulo: Modulo;
    user_group: GrupoUsuario,
    checked: boolean;
}