import { GrupoUsuario } from "./GrupoUsuario";
import { Submodulo } from "./Submodulo";

export interface PermisoSubmodulo {
    id: number;
    submodulo: Submodulo;
    user_group: GrupoUsuario;
    checked: boolean;
}