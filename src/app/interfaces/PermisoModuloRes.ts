import { Modulo } from "./Modulo";
import { PermisoModulo } from "./PermisoModulo";
import { PermisoSubmodulo } from "./PermisoSubmodulo";
import { Submodulo } from "./Submodulo";

export interface PermisoModuloRes {
    modulos: Modulo[];
    submodulos: Submodulo[];
    permisos_modulos: PermisoModulo[];
    permisos_submodulos: PermisoSubmodulo[];
}