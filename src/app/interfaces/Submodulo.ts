import { Modulo } from "./Modulo";

export interface Submodulo {
    id: number;
    nombre: string;
    url: string;
    icon: string;
    modulo: Modulo;
}